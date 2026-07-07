import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  updateProduct,
  createVariant,
  updateVariant,
  deleteVariant,
} from "@/lib/actions/admin-products";
import { ImageUploader } from "@/components/admin/ImageUploader";

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
        <h1 className="font-serif text-2xl text-pine mb-6">{product.name}</h1>
        <form action={updateProductWithId} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm mb-1 text-ink/70">Nome</label>
            <input name="name" defaultValue={product.name} required className="input" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-ink/70">Categoria</label>
            <select name="category" defaultValue={product.category} className="input">
              <option value="COLCHAO">Colchão</option>
              <option value="ESTOFADO">Estofado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1 text-ink/70">Descrição</label>
            <textarea
              name="description"
              defaultValue={product.description}
              required
              rows={5}
              className="input"
            />
          </div>
          <ImageUploader name="images" label="Fotos do produto" initialImages={product.images} />
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="active" defaultChecked={product.active} className="accent-clay" /> Produto ativo
          </label>
          <button type="submit" className="btn-primary">
            Salvar produto
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-serif text-xl text-pine mb-4">Variações (tamanhos)</h2>
        <div className="space-y-4">
          {product.variants.map((variant) => {
            const updateVariantWithIds = updateVariant.bind(null, product.id, variant.id);
            const deleteVariantWithIds = deleteVariant.bind(null, product.id, variant.id);
            return (
              <div key={variant.id} className="rounded-sm border border-sand-light p-4">
                <form action={updateVariantWithIds} className="space-y-3 text-sm">
                  <div className="grid grid-cols-4 gap-2">
                    <input name="size" defaultValue={variant.size} placeholder="Tamanho" className="input py-1.5" />
                    <input name="sku" defaultValue={variant.sku} placeholder="SKU" className="input py-1.5" />
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      defaultValue={variant.price.toString()}
                      placeholder="Preço"
                      className="input py-1.5"
                    />
                    <input
                      name="compareAtPrice"
                      type="number"
                      step="0.01"
                      defaultValue={variant.compareAtPrice?.toString() ?? ""}
                      placeholder="Preço comparativo"
                      className="input py-1.5"
                    />
                    <input
                      name="stockQuantity"
                      type="number"
                      defaultValue={variant.stockQuantity}
                      placeholder="Estoque"
                      className="input py-1.5"
                    />
                    <input
                      name="weightKg"
                      type="number"
                      step="0.01"
                      defaultValue={variant.weightKg.toString()}
                      placeholder="Peso (kg)"
                      className="input py-1.5"
                    />
                    <input
                      name="heightCm"
                      type="number"
                      step="0.01"
                      defaultValue={variant.heightCm.toString()}
                      placeholder="Altura (cm)"
                      className="input py-1.5"
                    />
                    <input
                      name="widthCm"
                      type="number"
                      step="0.01"
                      defaultValue={variant.widthCm.toString()}
                      placeholder="Largura (cm)"
                      className="input py-1.5"
                    />
                    <input
                      name="lengthCm"
                      type="number"
                      step="0.01"
                      defaultValue={variant.lengthCm.toString()}
                      placeholder="Comprimento (cm)"
                      className="input py-1.5"
                    />
                  </div>
                  <ImageUploader
                    name="images"
                    label="Fotos desta variação (opcional — usa as fotos do produto se vazio)"
                    initialImages={variant.images}
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-ink/70">
                      <input type="checkbox" name="active" defaultChecked={variant.active} className="accent-clay" /> Ativo
                    </label>
                    <button type="submit" className="rounded-sm border border-pine text-pine px-3 py-1.5 hover:bg-pine hover:text-cream transition-colors">
                      Salvar
                    </button>
                  </div>
                </form>
                <form action={deleteVariantWithIds} className="mt-2">
                  <button type="submit" className="text-xs text-ink/50 underline underline-offset-4 hover:text-red-700">
                    Remover variação
                  </button>
                </form>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-sm border border-dashed border-sand p-4">
          <h3 className="text-sm text-ink/70 mb-3">Nova variação</h3>
          <form action={createVariantWithId} className="space-y-3 text-sm">
            <div className="grid grid-cols-4 gap-2">
              <input name="size" placeholder="Tamanho (ex: Casal)" required className="input py-1.5" />
              <input name="sku" placeholder="SKU" required className="input py-1.5" />
              <input name="price" type="number" step="0.01" placeholder="Preço" required className="input py-1.5" />
              <input name="compareAtPrice" type="number" step="0.01" placeholder="Preço comparativo" className="input py-1.5" />
              <input name="stockQuantity" type="number" placeholder="Estoque" required className="input py-1.5" />
              <input name="weightKg" type="number" step="0.01" placeholder="Peso (kg)" required className="input py-1.5" />
              <input name="heightCm" type="number" step="0.01" placeholder="Altura (cm)" required className="input py-1.5" />
              <input name="widthCm" type="number" step="0.01" placeholder="Largura (cm)" required className="input py-1.5" />
              <input name="lengthCm" type="number" step="0.01" placeholder="Comprimento (cm)" required className="input py-1.5" />
            </div>
            <ImageUploader name="images" label="Fotos desta variação (opcional)" />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-ink/70">
                <input type="checkbox" name="active" defaultChecked className="accent-clay" /> Ativo
              </label>
              <button type="submit" className="btn-primary py-1.5">
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
