import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";

const statusOptions = [
  "AGUARDANDO_PAGAMENTO",
  "PAGO",
  "ENVIADO",
  "ENTREGUE",
  "CANCELADO",
] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as (typeof statusOptions)[number] } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Pedidos</h1>

      <div className="flex gap-2 mb-6 text-sm">
        <Link href="/admin/pedidos" className={!status ? "font-semibold underline" : ""}>
          Todos
        </Link>
        {statusOptions.map((s) => (
          <Link
            key={s}
            href={`/admin/pedidos?status=${s}`}
            className={status === s ? "font-semibold underline" : ""}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/pedidos/${order.id}`}
            className="flex justify-between rounded border p-3 text-sm hover:bg-neutral-50"
          >
            <span>{order.orderNumber}</span>
            <span>{order.status}</span>
            <span>{formatCurrencyBRL(Number(order.total))}</span>
            <span className="text-neutral-500">
              {order.createdAt.toLocaleDateString("pt-BR")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
