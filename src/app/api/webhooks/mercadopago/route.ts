import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getMercadoPagoPayment } from "@/lib/integrations/mercadopago";
import { applyMercadoPagoPaymentResult } from "@/lib/payment-handler";

/**
 * Valida o header x-signature conforme o algoritmo do Mercado Pago:
 * HMAC-SHA256 de "id:{data.id};request-id:{x-request-id};ts:{ts};" usando
 * MERCADOPAGO_WEBHOOK_SECRET. Sem a secret configurada, a validação é
 * pulada (comportamento anterior, mantido para não travar ambientes que
 * ainda não configuraram o webhook no painel do Mercado Pago).
 */
function isValidSignature(request: Request, dataId: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true;

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  if (!signatureHeader || !requestId) return false;

  let ts: string | undefined;
  let hash: string | undefined;
  for (const part of signatureHeader.split(",")) {
    const [key, value] = part.split("=").map((s) => s?.trim());
    if (key === "ts") ts = value;
    if (key === "v1") hash = value;
  }
  if (!ts || !hash) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  if (expected.length !== hash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hash));
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => null);

  const paymentId: string | undefined =
    url.searchParams.get("data.id") ?? body?.data?.id ?? url.searchParams.get("id") ?? undefined;
  const type: string | undefined = body?.type ?? url.searchParams.get("type") ?? undefined;

  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ ok: true });
  }

  if (!isValidSignature(request, paymentId)) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  try {
    const payment = await getMercadoPagoPayment(paymentId);
    const orderNumber = payment.external_reference;
    if (!orderNumber) {
      return NextResponse.json({ ok: true });
    }

    await applyMercadoPagoPaymentResult({
      orderNumber,
      externalId: String(payment.id),
      status: (payment.status as "approved" | "pending" | "in_process" | "rejected" | "cancelled" | "refunded") ?? "pending",
      method: payment.payment_method_id,
      rawPayload: payment,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago", error);
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 });
  }
}
