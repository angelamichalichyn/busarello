import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";
import { isMercadoPagoConfigured } from "@/lib/integrations/mercadopago";
import { PaymentBrick } from "@/components/PaymentBrick";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const session = await auth();

  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) notFound();

  if (order.status !== "AGUARDANDO_PAGAMENTO") {
    redirect(`/pedido/${orderNumber}`);
  }

  const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;
  const payerEmail = session?.user?.email ?? order.guestEmail ?? "";

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Pagamento</h1>
      <p className="text-neutral-600 mb-6">
        Pedido {order.orderNumber} — Total: <strong>{formatCurrencyBRL(Number(order.total))}</strong>
      </p>

      {isMercadoPagoConfigured() && publicKey ? (
        <PaymentBrick
          publicKey={publicKey}
          orderNumber={order.orderNumber}
          amount={Number(order.total)}
          payerEmail={payerEmail}
        />
      ) : (
        <p className="rounded border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          O pagamento online ainda não está configurado. Configure as credenciais do Mercado
          Pago (MERCADOPAGO_ACCESS_TOKEN e MERCADOPAGO_PUBLIC_KEY) para ativar o checkout.
        </p>
      )}
    </div>
  );
}
