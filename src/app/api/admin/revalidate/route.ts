import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = (await request.json().catch(() => ({}))) as {
    paths?: string[];
  };

  const paths = Array.isArray(body.paths) ? body.paths : [];
  for (const p of paths) {
    if (typeof p === "string" && p.startsWith("/")) {
      revalidatePath(p);
    }
  }

  return NextResponse.json({ revalidated: paths }, { status: 200 });
}
