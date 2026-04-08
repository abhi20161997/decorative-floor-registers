import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import { shippingNotificationEmail } from "@/lib/email-templates";

const FROM_EMAIL = "orders@decorativefloorregisters.com";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const supabase = createAdminClient();

  const { data, error: dbError } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const supabase = createAdminClient();
  const body = await request.json();

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.status) updates.status = body.status;
  if (body.tracking_number !== undefined)
    updates.tracking_number = body.tracking_number;
  if (body.notes !== undefined) updates.notes = body.notes;

  const { data, error: dbError } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select("*, order_items(*)")
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  // Send shipping notification email when status changes to "shipped"
  if (
    body.status === "shipped" &&
    data?.customer_email &&
    data?.tracking_number
  ) {
    try {
      const shippingAddress = (data.shipping_address as {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zip: string;
      }) || { line1: "", city: "", state: "", zip: "" };

      const items = ((data.order_items as Array<{
        product_name: string;
        variant_desc: string;
        quantity: number;
        unit_price: number;
        total_price: number;
      }>) || []).map((item) => ({
        product_name: item.product_name,
        variant_desc: item.variant_desc,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price,
      }));

      await resend.emails.send({
        from: FROM_EMAIL,
        to: data.customer_email,
        subject: `Your Order Has Shipped - #${id.slice(0, 8).toUpperCase()}`,
        html: shippingNotificationEmail({
          orderId: id,
          customerName: data.customer_name || "Customer",
          trackingNumber: data.tracking_number,
          items,
          shippingAddress,
        }),
      });
    } catch (emailErr) {
      console.error("Error sending shipping notification email:", emailErr);
    }
  }

  return NextResponse.json(data);
}
