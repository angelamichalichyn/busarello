import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createMercadoPagoPayment } from "@/lib/integrations/mercadopago";
import { applyMercadoPagoPaymentResult } from "@/lib/payment-handler";

const payloadSchema = z.object({
  orderNumber: z.string().min(1),
  formData: z.record(z.string(), z.unknown()),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { orderNumber, formData } = parsed.data;

  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) {
    return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
  }
  if (order.status !== "AGUARDANDO_PAGAMENTO") {
    return NextResponse.json({ error: "Este pedido não está aguardando pagamento" }, { status: 409 });
  }

  try {
    const result = await createMercadoPagoPayment(formData, {
      orderNumber: order.orderNumber,
      transactionAmount: Number(order.total),
      description: `Pedido ${order.orderNumber} - Busarello Estofados`,
    });

    await applyMercadoPagoPaymentResult({
      orderNumber: order.orderNumber,
      externalId: String(result.id),
      status: (result.status as "approved" | "pending" | "in_process" | "rejected" | "cancelled" | "refunded") ?? "pending",
      method: result.payment_method_id,
      rawPayload: result,
    });

    return NextResponse.json({
      status: result.status,
      statusDetail: result.status_detail,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento no Mercado Pago", error);
    return NextResponse.json({ error: "Não foi possível processar o pagamento" }, { status: 502 });
  }
}
