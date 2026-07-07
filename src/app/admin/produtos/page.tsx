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
        <h1 className="font-serif text-2xl text-pine">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn-primary">
          Novo produto
        </Link>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/admin/produtos/${p.id}`}
            className="flex items-center justify-between rounded-sm border border-sand-light p-3 text-sm text-ink hover:border-clay transition-colors"
          >
            <span>{p.name}</span>
            <span className="text-ink/50">{p.category}</span>
            <span className="text-ink/50">{p.variants.length} variação(ões)</span>
            <span className={p.active ? "text-pine" : "text-ink/40"}>
              {p.active ? "Ativo" : "Inativo"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
