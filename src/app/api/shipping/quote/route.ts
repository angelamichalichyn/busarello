import { NextResponse } from "next/server";
import { z } from "zod";
import { getOrCreateCart } from "@/lib/cart";
import { quoteShipping } from "@/lib/integrations/frenet";

const quoteSchema = z.object({
  cep: z.string().min(8).max(9),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const cart = await getOrCreateCart();
  if (cart.items.length === 0) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const items = cart.items.map((item) => ({
    weightKg: Number(item.variant.weightKg),
    heightCm: Number(item.variant.heightCm),
    widthCm: Number(item.variant.widthCm),
    lengthCm: Number(item.variant.lengthCm),
    quantity: item.quantity,
  }));

  try {
    const quotes = await quoteShipping(parsed.data.cep, items);
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Erro ao cotar frete via Frenet", error);
    return NextResponse.json({ error: "Não foi possível calcular o frete agora" }, { status: 502 });
  }
}
