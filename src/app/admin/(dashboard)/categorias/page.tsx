import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/admin-categories";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-pine mb-6">Categorias</h1>

      <div className="admin-card p-5 mb-6">
        <h2 className="text-sm font-medium text-ink mb-3">Nova categoria</h2>
        <form action={createCategory} className="space-y-3">
          <div className="flex gap-2">
            <input name="emoji" placeholder="🛏️" maxLength={4} className="admin-input w-16 text-center" />
            <input name="name" placeholder="Nome da categoria" required className="admin-input flex-1" />
            <button type="submit" className="admin-btn-primary shrink-0">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <ImageUploader name="images" label="Foto principal (usada na home)" />
        </form>
      </div>

      <div className="admin-card divide-y divide-sand-light">
        {categories.map((category) => {
          const updateAction = updateCategory.bind(null, category.id);
          const deleteAction = deleteCategory.bind(null, category.id);
          return (
            <div key={category.id} className="p-4">
              <form action={updateAction} className="space-y-3">
                <div className="flex items-center gap-3">
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
                    <p className="text-xs text-ink/50 mt-1">
                      id: {category.slug} · {category._count.products} produto(s)
                    </p>
                  </div>
                  <button type="submit" className="admin-btn-outline py-1.5 text-xs shrink-0">
                    Salvar
                  </button>
                </div>
                <div className="pl-[4.25rem]">
                  <ImageUploader
                    name="images"
                    label="Foto principal (usada na home)"
                    initialImages={category.imageUrl ? [category.imageUrl] : []}
                  />
                </div>
              </form>
              <form action={deleteAction} className="pl-[4.25rem] mt-2">
                <button type="submit" className="text-xs text-ink/50 underline underline-offset-4 hover:text-red-600">
                  Remover categoria
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
