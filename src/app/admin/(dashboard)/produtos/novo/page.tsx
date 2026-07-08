import { createProduct } from "@/lib/actions/admin-products";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { getAllCategories } from "@/lib/data/products";

export default async function NewProductPage() {
  const categories = await getAllCategories();

  return (
    <div>
      <h1 className="text-2xl font-bold text-pine mb-6">Novo produto</h1>
      <form action={createProduct} className="admin-card p-6 space-y-4 max-w-lg">
        <div>
          <label className="block text-sm mb-1 text-ink">Nome</label>
          <input name="name" required className="admin-input" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink">Categoria</label>
          <select name="categoryId" required className="admin-input">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji ? `${c.emoji} ` : ""}
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink">Descrição</label>
          <textarea name="description" required rows={5} className="admin-input" />
        </div>
        <ImageUploader name="images" label="Fotos do produto" />
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="active" defaultChecked className="accent-clay" /> Produto ativo
        </label>
        <button type="submit" className="admin-btn-primary">
          Criar produto
        </button>
      </form>
    </div>
  );
}
