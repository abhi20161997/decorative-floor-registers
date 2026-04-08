import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type CheckoutBody = {
  items: { variantId: string; quantity: number }[];
  discountCode?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CheckoutBody;
    const { items, discountCode } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Fetch all variant data with product, finish, size joins
    const variantIds = items.map((i) => i.variantId);
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
        product:products!inner(id, name, slug, active),
        finish:finishes!inner(id, name),
        size:sizes!inner(id, label)
      `
      )
      .in("id", variantIds);

    if (variantsError) {
      console.error("Error fetching variants:", variantsError);
      return NextResponse.json(
        { error: "Failed to fetch product data" },
        { status: 500 }
      );
    }

    if (!variants || variants.length !== items.length) {
      return NextResponse.json(
        { error: "One or more items not found" },
        { status: 400 }
      );
    }

    // Validate all variants are active and in stock
    for (const variant of variants) {
      const product = variant.product as unknown as {
        id: string;
        name: string;
        slug: string;
        active: boolean;
      };
      if (!variant.active || !product.active) {
        return NextResponse.json(
          { error: `Product is no longer available` },
          { status: 400 }
        );
      }

      const requestedQty = items.find(
        (i) => i.variantId === variant.id
      )!.quantity;
      if (
        variant.stock_qty !== null &&
        variant.stock_qty < requestedQty
      ) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}`,
          },
          { status: 400 }
        );
      }
    }

    // Build Stripe line items
    const lineItems = variants.map((variant) => {
      const product = variant.product as unknown as {
        id: string;
        name: string;
        slug: string;
        active: boolean;
      };
      const finish = variant.finish as unknown as {
        id: string;
        name: string;
      };
      const size = variant.size as unknown as {
        id: string;
        label: string;
      };
      const item = items.find((i) => i.variantId === variant.id)!;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: `${finish.name} - ${size.label}`,
          },
          unit_amount: Math.round(variant.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      };
    });

    // Handle discount code
    const discounts: { coupon: string }[] = [];

    if (discountCode) {
      const { data: discount, error: discountError } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", discountCode.toUpperCase())
        .eq("active", true)
        .single();

      if (discountError || !discount) {
        return NextResponse.json(
          { error: "Invalid discount code" },
          { status: 400 }
        );
      }

      // Validate not expired
      if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
        return NextResponse.json(
          { error: "Discount code has expired" },
          { status: 400 }
        );
      }

      // Validate not maxed out
      if (
        discount.max_uses !== null &&
        discount.times_used >= discount.max_uses
      ) {
        return NextResponse.json(
          { error: "Discount code has reached its usage limit" },
          { status: 400 }
        );
      }

      // Validate minimum order total
      const subtotal = variants.reduce((sum, v) => {
        const qty = items.find((i) => i.variantId === v.id)!.quantity;
        return sum + v.price * qty;
      }, 0);

      if (
        discount.min_order_total !== null &&
        subtotal < discount.min_order_total
      ) {
        return NextResponse.json(
          {
            error: `Minimum order total of $${discount.min_order_total} required for this code`,
          },
          { status: 400 }
        );
      }

      // Create a Stripe coupon on the fly
      const couponParams =
        discount.type === "percentage"
          ? { percent_off: discount.value }
          : { amount_off: Math.round(discount.value * 100), currency: "usd" as const };

      const coupon = await stripe.coupons.create({
        ...couponParams,
        duration: "once",
      });

      discounts.push({ coupon: coupon.id });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      metadata: {
        variant_ids: JSON.stringify(
          items.map((i) => ({
            variantId: i.variantId,
            quantity: i.quantity,
          }))
        ),
        discount_code: discountCode || "",
      },
      ...(discounts.length > 0 ? { discounts } : {}),
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/checkout/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
