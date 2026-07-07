import { createProduct } from "@/lib/actions/admin-products";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl text-pine mb-6">Novo produto</h1>
      <form action={createProduct} className="space-y-4 max-w-lg">
        <div>
          <label className="block text-sm mb-1 text-ink/70">Nome</label>
          <input name="name" required className="input" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">Categoria</label>
          <select name="category" className="input">
            <option value="COLCHAO">Colchão</option>
            <option value="ESTOFADO">Estofado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">Descrição</label>
          <textarea name="description" required rows={5} className="input" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-ink/70">Imagens (uma URL por linha)</label>
          <textarea name="images" rows={3} className="input" />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" name="active" defaultChecked className="accent-clay" /> Produto ativo
        </label>
        <button type="submit" className="btn-primary">
          Criar produto
        </button>
      </form>
    </div>
  );
}
