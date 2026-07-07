import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";
import { SignOutButton } from "@/components/SignOutButton";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/conta/entrar");

  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: "desc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Minha conta</h1>
        <SignOutButton />
      </div>

      <section>
        <h2 className="text-lg font-medium mb-3">Meus pedidos</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-neutral-600">Você ainda não fez nenhum pedido.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/pedido/${order.orderNumber}`}
                className="flex justify-between rounded border p-3 text-sm hover:bg-neutral-50"
              >
                <span>{order.orderNumber}</span>
                <span>{order.status}</span>
                <span>{formatCurrencyBRL(Number(order.total))}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium mb-3">Meus endereços</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-neutral-600">
            Nenhum endereço salvo. Você pode cadastrar um durante o checkout.
          </p>
        ) : (
          <div className="space-y-2">
            {addresses.map((a) => (
              <div key={a.id} className="rounded border p-3 text-sm">
                {a.recipientName} — {a.street}, {a.number}, {a.city}/{a.state} — {a.cep}
                {a.isDefault && <span className="ml-2 text-xs text-green-700">(padrão)</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
