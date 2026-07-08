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
        <h1 className="text-2xl font-bold text-white">Produtos</h1>
        <Link href="/admin/produtos/novo" className="admin-btn-primary">
          <Plus className="w-4 h-4" />
          Novo produto
        </Link>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-zinc-500 border-b border-zinc-800">
              <th className="px-4 py-3 font-medium">Produto</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Preço</th>
              <th className="px-4 py-3 font-medium">Estoque</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((p) => {
              const prices = p.variants.map((v) => Number(v.price));
              const minPrice = prices.length ? Math.min(...prices) : 0;
              const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
              const toggleAction = toggleProductActive.bind(null, p.id, !p.active);
              const deleteAction = deleteProduct.bind(null, p.id);

              return (
                <tr key={p.id} className="hover:bg-zinc-900/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/produtos/${p.id}`} className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-zinc-800 shrink-0">
                        {p.images[0] && (
                          <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                        )}
                      </div>
                      <div>
                        <p className="text-zinc-100 font-medium">{p.name}</p>
                        <p className="text-zinc-500 text-xs">{p.slug}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-400">
                    {p.category.emoji} {p.category.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-200">{formatCurrencyBRL(minPrice)}</td>
                  <td className={`px-4 py-3 ${totalStock <= 5 ? "text-amber-400" : "text-zinc-200"}`}>
                    {totalStock}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleAction}>
                      <button
                        type="submit"
                        title={p.active ? "Ativo — clique para desativar" : "Inativo — clique para ativar"}
                        className={p.active ? "text-green-400" : "text-zinc-600"}
                      >
                        {p.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/produtos/${p.id}`} className="text-zinc-400 hover:text-white">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <form action={deleteAction}>
                        <button type="submit" className="text-zinc-400 hover:text-red-400">
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
