import Link from "next/link";
import Image from "next/image";
import { Plus, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatCurrencyBRL } from "@/lib/format";
import { toggleProductActive, deleteProduct } from "@/lib/actions/admin-products";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-pine">Produtos</h1>
        <Link href="/admin/produtos/novo" className="admin-btn-primary">
          <Plus className="w-4 h-4" />
          Novo produto
        </Link>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-ink/50 border-b border-sand-light">
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Estoque</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-light">
            {products.map((p) => {
              const prices = p.variants.map((v) => Number(v.price));
              const minPrice = prices.length ? Math.min(...prices) : 0;
              const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
              const toggleAction = toggleProductActive.bind(null, p.id, !p.active);
              const deleteAction = deleteProduct.bind(null, p.id);

              return (
                <tr key={p.id} className="hover:bg-sand-light/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/produtos/${p.id}`} className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-sand-light shrink-0">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-ink font-medium">{p.name}</p>
                        <p className="text-ink/50 text-xs">{p.slug}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {p.category.emoji} {p.category.name}
                  </td>
                  <td className="px-4 py-3 text-ink">{formatCurrencyBRL(minPrice)}</td>
                  <td className={`px-4 py-3 ${totalStock <= 5 ? "text-amber-600" : "text-ink"}`}>
                    {totalStock}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleAction}>
                      <button
                        type="submit"
                        title={p.active ? "Ativo — clique para desativar" : "Inativo — clique para ativar"}
                        className={p.active ? "text-green-600" : "text-ink/30"}
                      >
                        {p.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/produtos/${p.id}`} className="text-ink/50 hover:text-ink">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form action={deleteAction}>
                        <button type="submit" className="text-ink/50 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
