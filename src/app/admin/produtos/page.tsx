import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <Link href="/admin/produtos/novo" className="rounded bg-neutral-900 text-white px-4 py-2 text-sm">
          Novo produto
        </Link>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/admin/produtos/${p.id}`}
            className="flex items-center justify-between rounded border p-3 text-sm hover:bg-neutral-50"
          >
            <span>{p.name}</span>
            <span className="text-neutral-500">{p.category}</span>
            <span className="text-neutral-500">{p.variants.length} variação(ões)</span>
            <span className={p.active ? "text-green-700" : "text-neutral-400"}>
              {p.active ? "Ativo" : "Inativo"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
