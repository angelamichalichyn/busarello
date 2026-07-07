import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, MapPin, ShoppingBag, LogOut } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/SignOutButton";

export const metadata = { title: "Minha Conta | Busarello Estofados" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/conta/entrar");

  const [ordersCount, addressesCount] = await Promise.all([
    prisma.order.count({ where: { userId: session.user.id } }),
    prisma.address.count({ where: { userId: session.user.id } }),
  ]);

  const cards = [
    {
      title: "Meus pedidos",
      description: "Acompanhe seus pedidos e histórico de compras",
      icon: Package,
      href: "/conta/pedidos",
      count: ordersCount,
    },
    {
      title: "Endereços",
      description: "Gerencie seus endereços de entrega",
      icon: MapPin,
      href: "/conta/enderecos",
      count: addressesCount,
    },
    {
      title: "Carrinho",
      description: "Itens salvos para compra",
      icon: ShoppingBag,
      href: "/carrinho",
      count: null,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-full bg-clay/10 flex items-center justify-center shrink-0">
          <User className="w-6 h-6 text-clay" />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-pine">
            Olá, {session.user.name?.split(" ")[0]}!
          </h1>
          <p className="text-ink/60 text-sm">{session.user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="card p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 rounded-full bg-sand/30 flex items-center justify-center mb-4 group-hover:bg-clay transition-colors">
              <card.icon className="w-5 h-5 text-clay group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-serif text-lg text-pine mb-2">{card.title}</h3>
            <p className="text-sm text-ink/60 mb-3">{card.description}</p>
            {card.count !== null && (
              <span className="text-sm font-medium text-clay">
                {card.count} {card.count === 1 ? "item" : "itens"}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="border-t border-sand-light pt-6">
        <SignOutButton icon={<LogOut className="w-4 h-4" />} />
      </div>
    </div>
  );
}
