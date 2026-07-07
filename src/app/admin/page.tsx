import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";

export default async function AdminDashboardPage() {
  const [recentOrders, failedSyncs] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.sigecloudSync.findMany({
      where: { status: "ERRO" },
      include: { order: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {failedSyncs.length > 0 && (
        <section>
          <h2 className="text-lg font-medium mb-3 text-red-700">
            Pedidos com falha na sincronização com o Sigecloud
          </h2>
          <div className="space-y-2">
            {failedSyncs.map((s) => (
              <Link
                key={s.id}
                href={`/admin/pedidos/${s.orderId}`}
                className="block rounded border border-red-200 bg-red-50 p-3 text-sm hover:bg-red-100"
              >
                Pedido {s.order.orderNumber} — {s.lastError}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-medium mb-3">Pedidos recentes</h2>
        <div className="space-y-2">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/admin/pedidos/${order.id}`}
              className="flex justify-between rounded border p-3 text-sm hover:bg-neutral-50"
            >
              <span>{order.orderNumber}</span>
              <span>{order.status}</span>
              <span>{formatCurrencyBRL(Number(order.total))}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
