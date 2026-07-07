import { NextResponse } from "next/server";
import { getMercadoPagoPayment } from "@/lib/integrations/mercadopago";
import { applyMercadoPagoPaymentResult } from "@/lib/payment-handler";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const paymentId: string | undefined = body?.data?.id ?? new URL(request.url).searchParams.get("id") ?? undefined;
  const type: string | undefined = body?.type ?? new URL(request.url).searchParams.get("type") ?? undefined;

  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ ok: true });
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
