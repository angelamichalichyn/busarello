import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  updateProduct,
  createVariant,
  updateVariant,
  deleteVariant,
} from "@/lib/actions/admin-products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: { orderBy: { size: "asc" } } },
  });

  if (!product) notFound();

  const updateProductWithId = updateProduct.bind(null, product.id);
  const createVariantWithId = createVariant.bind(null, product.id);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold mb-6">{product.name}</h1>
        <form action={updateProductWithId} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input name="name" defaultValue={product.name} required className="w-full rounded border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm mb-1">Categoria</label>
            <select name="category" defaultValue={product.category} className="w-full rounded border px-3 py-2">
              <option value="COLCHAO">Colchão</option>
              <option value="ESTOFADO">Estofado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Descrição</label>
            <textarea
              name="description"
              defaultValue={product.description}
              required
              rows={5}
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Imagens (uma URL por linha)</label>
            <textarea
              name="images"
              defaultValue={product.images.join("\n")}
              rows={3}
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={product.active} /> Produto ativo
          </label>
          <button type="submit" className="rounded bg-neutral-900 text-white px-4 py-2">
            Salvar produto
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-4">Variações (tamanhos)</h2>
        <div className="space-y-4">
          {product.variants.map((variant) => {
            const updateVariantWithIds = updateVariant.bind(null, product.id, variant.id);
            const deleteVariantWithIds = deleteVariant.bind(null, product.id, variant.id);
            return (
              <div key={variant.id} className="rounded border p-4">
                <form action={updateVariantWithIds} className="grid grid-cols-4 gap-2 text-sm">
                  <input name="size" defaultValue={variant.size} placeholder="Tamanho" className="rounded border px-2 py-1" />
                  <input name="sku" defaultValue={variant.sku} placeholder="SKU" className="rounded border px-2 py-1" />
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={variant.price.toString()}
                    placeholder="Preço"
                    className="rounded border px-2 py-1"
                  />
                  <input
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    defaultValue={variant.compareAtPrice?.toString() ?? ""}
                    placeholder="Preço comparativo"
                    className="rounded border px-2 py-1"
                  />
                  <input
                    name="stockQuantity"
                    type="number"
                    defaultValue={variant.stockQuantity}
                    placeholder="Estoque"
                    className="rounded border px-2 py-1"
                  />
                  <input
                    name="weightKg"
                    type="number"
                    step="0.01"
                    defaultValue={variant.weightKg.toString()}
                    placeholder="Peso (kg)"
                    className="rounded border px-2 py-1"
                  />
                  <input
                    name="heightCm"
                    type="number"
                    step="0.01"
                    defaultValue={variant.heightCm.toString()}
                    placeholder="Altura (cm)"
                    className="rounded border px-2 py-1"
                  />
                  <input
                    name="widthCm"
                    type="number"
                    step="0.01"
                    defaultValue={variant.widthCm.toString()}
                    placeholder="Largura (cm)"
                    className="rounded border px-2 py-1"
                  />
                  <input
                    name="lengthCm"
                    type="number"
                    step="0.01"
                    defaultValue={variant.lengthCm.toString()}
                    placeholder="Comprimento (cm)"
                    className="rounded border px-2 py-1"
                  />
                  <label className="flex items-center gap-2 col-span-2">
                    <input type="checkbox" name="active" defaultChecked={variant.active} /> Ativo
                  </label>
                  <button type="submit" className="rounded border border-neutral-900 px-3 py-1">
                    Salvar
                  </button>
                </form>
                <form action={deleteVariantWithIds} className="mt-2">
                  <button type="submit" className="text-xs text-red-600 underline">
                    Remover variação
                  </button>
                </form>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded border border-dashed p-4">
          <h3 className="text-sm font-medium mb-3">Nova variação</h3>
          <form action={createVariantWithId} className="grid grid-cols-4 gap-2 text-sm">
            <input name="size" placeholder="Tamanho (ex: Casal)" required className="rounded border px-2 py-1" />
            <input name="sku" placeholder="SKU" required className="rounded border px-2 py-1" />
            <input name="price" type="number" step="0.01" placeholder="Preço" required className="rounded border px-2 py-1" />
            <input name="compareAtPrice" type="number" step="0.01" placeholder="Preço comparativo" className="rounded border px-2 py-1" />
            <input name="stockQuantity" type="number" placeholder="Estoque" required className="rounded border px-2 py-1" />
            <input name="weightKg" type="number" step="0.01" placeholder="Peso (kg)" required className="rounded border px-2 py-1" />
            <input name="heightCm" type="number" step="0.01" placeholder="Altura (cm)" required className="rounded border px-2 py-1" />
            <input name="widthCm" type="number" step="0.01" placeholder="Largura (cm)" required className="rounded border px-2 py-1" />
            <input name="lengthCm" type="number" step="0.01" placeholder="Comprimento (cm)" required className="rounded border px-2 py-1" />
            <label className="flex items-center gap-2 col-span-2">
              <input type="checkbox" name="active" defaultChecked /> Ativo
            </label>
            <button type="submit" className="rounded bg-neutral-900 text-white px-3 py-1">
              Adicionar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
