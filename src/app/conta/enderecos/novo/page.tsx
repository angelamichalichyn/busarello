import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AddAddressForm } from "@/components/AddAddressForm";

export const metadata = { title: "Novo Endereço | Busarello Estofados" };

export default async function NewAddressPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/conta/entrar?callbackUrl=/conta/enderecos/novo");

  const { redirect: redirectTo } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { label: "Minha conta", href: "/conta" },
          { label: "Endereços", href: "/conta/enderecos" },
          { label: "Novo endereço" },
        ]}
      />
      <h1 className="font-serif text-3xl text-pine mb-8">Novo endereço</h1>
      <div className="card p-6 md:p-8">
        <AddAddressForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
