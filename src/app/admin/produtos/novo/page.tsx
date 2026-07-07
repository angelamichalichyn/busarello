import { createProduct } from "@/lib/actions/admin-products";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Novo produto</h1>
      <form action={createProduct} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input name="name" required className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Categoria</label>
          <select name="category" className="w-full rounded border px-3 py-2">
            <option value="COLCHAO">Colchão</option>
            <option value="ESTOFADO">Estofado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Descrição</label>
          <textarea name="description" required rows={5} className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Imagens (uma URL por linha)</label>
          <textarea name="images" rows={3} className="w-full rounded border px-3 py-2" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked /> Produto ativo
        </label>
        <button type="submit" className="rounded bg-neutral-900 text-white px-4 py-2">
          Criar produto
        </button>
      </form>
    </div>
  );
}
