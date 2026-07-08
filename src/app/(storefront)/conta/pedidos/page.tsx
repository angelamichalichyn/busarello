import { redirect } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Meus Pedidos | Busarello Estofados" };

const statusLabels: Record<string, string> = {
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  PAGO: "Pagamento confirmado",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/conta/entrar?callbackUrl=/conta/pedidos");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Minha conta", href: "/conta" }, { label: "Pedidos" }]} />
      <h1 className="font-serif text-3xl text-pine mb-8">Meus pedidos</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="Você ainda não fez nenhum pedido"
          description="Explore nossa coleção de colchões e estofados de qualidade."
          icon={<Package className="w-10 h-10 text-ink/30" />}
          action={{ label: "Ver produtos", href: "/colchoes" }}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/pedido/${order.orderNumber}`}
              className="card flex items-center justify-between p-5 text-sm text-ink hover:border-clay transition-colors"
            >
              <div>
                <p className="font-medium text-pine">{order.orderNumber}</p>
                <p className="text-ink/50 mt-0.5">{order.createdAt.toLocaleDateString("pt-BR")}</p>
              </div>
              <span className="text-ink/60">{statusLabels[order.status] ?? order.status}</span>
              <span className="text-clay font-semibold">{formatCurrencyBRL(Number(order.total))}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
