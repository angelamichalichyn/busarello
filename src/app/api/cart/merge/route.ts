import { NextResponse } from "next/server";
import { mergeGuestCartIntoUserCart } from "@/lib/cart";

export async function POST() {
  await mergeGuestCartIntoUserCart();
  return NextResponse.json({ ok: true });
}
