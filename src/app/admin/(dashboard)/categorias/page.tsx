import { Plus, Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/admin-categories";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">Categorias</h1>

      <div className="admin-card p-5 mb-6">
        <h2 className="text-sm font-medium text-zinc-300 mb-3">Nova categoria</h2>
        <form action={createCategory} className="flex gap-2">
          <input name="emoji" placeholder="🛏️" maxLength={4} className="admin-input w-16 text-center" />
          <input name="name" placeholder="Nome da categoria" required className="admin-input flex-1" />
          <button type="submit" className="admin-btn-primary shrink-0">
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="admin-card divide-y divide-zinc-800">
        {categories.map((category) => {
          const updateAction = updateCategory.bind(null, category.id);
          const deleteAction = deleteCategory.bind(null, category.id);
          return (
            <div key={category.id} className="flex items-center gap-3 p-4">
              <form action={updateAction} className="flex items-center gap-2 flex-1">
                <input
                  name="emoji"
                  defaultValue={category.emoji ?? ""}
                  maxLength={4}
                  className="admin-input w-14 text-center py-1.5"
                />
                <div className="flex-1">
                  <input
                    name="name"
                    defaultValue={category.name}
                    required
                    className="admin-input py-1.5"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    id: {category.slug} · {category._count.products} produto(s)
                  </p>
                </div>
                <button type="submit" className="admin-btn-outline py-1.5 text-xs">
                  Salvar
                </button>
              </form>
              <form action={deleteAction}>
                <button type="submit" className="text-zinc-500 hover:text-red-400 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
