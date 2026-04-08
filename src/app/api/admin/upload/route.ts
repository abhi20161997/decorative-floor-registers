import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const supabase = createAdminClient();

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filePath = `product-images/${fileName}`;

  const buffer = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(filePath);

  return NextResponse.json({ url: publicUrl }, { status: 201 });
}
