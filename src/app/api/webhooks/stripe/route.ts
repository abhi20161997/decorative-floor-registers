import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import type Stripe from "stripe";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const FROM_EMAIL = "orders@decorativefloorregisters.com";

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  try {
    // Read raw body as text for signature verification
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    try {
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session
      );
    } catch (err) {
      console.error("Error handling checkout.session.completed:", err);
      // Still return 200 to Stripe so they don't retry
      // But log the error for investigation
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  // Parse variant data from metadata
  const variantData = JSON.parse(session.metadata?.variant_ids || "[]") as {
    variantId: string;
    quantity: number;
  }[];
  const discountCode = session.metadata?.discount_code || null;

  if (variantData.length === 0) {
    console.error("No variant data in session metadata");
    return;
  }

  // Fetch variants with product/finish/size info
  const variantIds = variantData.map((v) => v.variantId);
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select(
      `
      id,
      product_id,
      finish_id,
      size_id,
      sku,
      price,
      stock_qty,
      active,
      product:products!inner(id, name, slug),
      finish:finishes!inner(id, name),
      size:sizes!inner(id, label)
    `
    )
    .in("id", variantIds);

  if (variantsError || !variants) {
    console.error("Error fetching variants for order:", variantsError);
    return;
  }

  // Get customer info from Stripe session
  const customerEmail =
    session.customer_details?.email || "unknown@example.com";
  const customerName = session.customer_details?.name || "Customer";

  // Find or create customer
  let customerId: string | null = null;
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id")
    .eq("email", customerEmail)
    .single();

  if (existingCustomer) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({
        email: customerEmail,
        name: customerName,
      })
      .select("id")
      .single();
    customerId = newCustomer?.id || null;
  }

  // Build shipping address (Stripe v22: under collected_information)
  const stripeAddress =
    session.collected_information?.shipping_details?.address;
  const shippingAddress = {
    line1: stripeAddress?.line1 || "",
    line2: stripeAddress?.line2 || undefined,
    city: stripeAddress?.city || "",
    state: stripeAddress?.state || "",
    zip: stripeAddress?.postal_code || "",
    country: stripeAddress?.country || "US",
  };

  // Calculate totals
  const subtotal = variantData.reduce((sum, vd) => {
    const variant = variants.find((v) => v.id === vd.variantId);
    return sum + (variant ? variant.price * vd.quantity : 0);
  }, 0);

  // Stripe provides the final totals in cents
  const total = (session.amount_total || 0) / 100;
  const discountAmount = subtotal - total + (total > subtotal ? 0 : 0);
  // More reliable: use Stripe's own calculations
  const shippingCost =
    (session.shipping_cost?.amount_total || 0) / 100;
  const actualDiscount = Math.max(
    0,
    subtotal + shippingCost - total
  );

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      customer_email: customerEmail,
      customer_name: customerName,
      shipping_address: shippingAddress,
      status: "paid",
      stripe_session_id: session.id,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null,
      subtotal,
      discount_amount: actualDiscount,
      discount_code: discountCode || null,
      shipping_cost: shippingCost,
      tax: 0,
      total,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Error creating order:", orderError);
    return;
  }

  // Create order items
  const orderItems = variantData.map((vd) => {
    const variant = variants.find((v) => v.id === vd.variantId)!;
    const product = variant.product as unknown as {
      id: string;
      name: string;
      slug: string;
    };
    const finish = variant.finish as unknown as { id: string; name: string };
    const size = variant.size as unknown as { id: string; label: string };

    return {
      order_id: order.id,
      variant_id: vd.variantId,
      product_name: product.name,
      variant_desc: `${finish.name} - ${size.label}`,
      quantity: vd.quantity,
      unit_price: variant.price,
      total_price: variant.price * vd.quantity,
    };
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
  }

  // Decrement stock_qty on variants (if tracked)
  for (const vd of variantData) {
    const variant = variants.find((v) => v.id === vd.variantId);
    if (variant && variant.stock_qty !== null) {
      const { error: stockError } = await supabase
        .from("product_variants")
        .update({ stock_qty: variant.stock_qty - vd.quantity })
        .eq("id", vd.variantId);

      if (stockError) {
        console.error(
          `Error updating stock for variant ${vd.variantId}:`,
          stockError
        );
      }
    }
  }

  // Increment discount code usage if applicable
  if (discountCode) {
    const { error: discountError } = await supabase.rpc(
      "increment_discount_usage",
      { code_value: discountCode.toUpperCase() }
    );
    if (discountError) {
      console.error("Error incrementing discount usage:", discountError);
    }
  }

  // Build order items HTML for emails
  const itemsHtml = orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product_name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.variant_desc}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.total_price.toFixed(2)}</td>
      </tr>`
    )
    .join("");

  // Send order confirmation email to customer
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmed - #${order.id.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #3B2F2F;">
          <h1 style="color: #3B2F2F; border-bottom: 2px solid #C9A96E; padding-bottom: 10px;">
            Order Confirmed
          </h1>
          <p>Hi ${customerName},</p>
          <p>Thank you for your order! We&rsquo;re preparing it for shipment.</p>

          <h2 style="color: #3B2F2F; font-size: 18px; margin-top: 24px;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #FAF7F2;">
                <th style="padding: 8px; text-align: left;">Product</th>
                <th style="padding: 8px; text-align: left;">Variant</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="margin-top: 16px; text-align: right;">
            <p style="margin: 4px 0;"><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
            ${actualDiscount > 0 ? `<p style="margin: 4px 0; color: #16a34a;"><strong>Discount:</strong> -$${actualDiscount.toFixed(2)}</p>` : ""}
            <p style="margin: 4px 0;"><strong>Shipping:</strong> ${shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</p>
            <p style="margin: 8px 0; font-size: 18px;"><strong>Total: $${total.toFixed(2)}</strong></p>
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #FAF7F2; border-radius: 8px;">
            <h3 style="margin: 0 0 8px; font-size: 14px; color: #6B5E5E;">Shipping To</h3>
            <p style="margin: 0;">
              ${customerName}<br>
              ${shippingAddress.line1}<br>
              ${shippingAddress.line2 ? shippingAddress.line2 + "<br>" : ""}
              ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}
            </p>
          </div>

          <p style="margin-top: 24px; color: #6B5E5E; font-size: 14px;">
            You&rsquo;ll receive a shipping notification with tracking info once your order ships.
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error("Error sending confirmation email:", emailErr);
  }

  // Send admin notification email
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New Order #${order.id.slice(0, 8).toUpperCase()} - $${total.toFixed(2)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>New Order Received</h1>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Total:</strong> $${total.toFixed(2)}</p>
          ${discountCode ? `<p><strong>Discount Code:</strong> ${discountCode}</p>` : ""}

          <h2>Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f3f4f6;">
                <th style="padding: 8px; text-align: left;">Product</th>
                <th style="padding: 8px; text-align: left;">Variant</th>
                <th style="padding: 8px; text-align: center;">Qty</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <h2>Shipping Address</h2>
          <p>
            ${customerName}<br>
            ${shippingAddress.line1}<br>
            ${shippingAddress.line2 ? shippingAddress.line2 + "<br>" : ""}
            ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}
          </p>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error("Error sending admin notification:", emailErr);
  }
}
