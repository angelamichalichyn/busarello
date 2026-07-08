import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, Plus, Check } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";

export const metadata = { title: "Meus Endereços | Busarello Estofados" };

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) redirect("/conta/entrar?callbackUrl=/conta/enderecos");

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Minha conta", href: "/conta" }, { label: "Endereços" }]} />

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-3xl text-pine">Meus endereços</h1>
        <Link href="/conta/enderecos/novo" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo endereço
        </Link>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          title="Nenhum endereço cadastrado"
          description="Cadastre um endereço para agilizar suas próximas compras."
          icon={<MapPin className="w-10 h-10 text-ink/30" />}
          action={{ label: "Cadastrar endereço", href: "/conta/enderecos/novo" }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="card p-6 relative">
              {address.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Principal
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-clay shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-ink">
                    {address.street}, {address.number}
                  </p>
                  {address.complement && <p className="text-sm text-ink/60">{address.complement}</p>}
                  <p className="text-sm text-ink/60">{address.neighborhood}</p>
                  <p className="text-sm text-ink/60">
                    {address.city} - {address.state}
                  </p>
                  <p className="text-sm text-ink/40 mt-1">CEP: {address.cep}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
