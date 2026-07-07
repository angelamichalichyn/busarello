import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/data/products";
import { AddToCartForm } from "@/components/AddToCartForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const categoryLabel = product.category === "COLCHAO" ? "Colchões" : "Estofados";
  const categoryHref = product.category === "COLCHAO" ? "/colchoes" : "/estofados";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { label: categoryLabel, href: categoryHref },
          { label: product.name },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-12 mt-4">
        <div className="relative aspect-square bg-sand-light rounded-2xl overflow-hidden">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-ink/30 text-sm font-serif italic">
              Sem imagem
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow mb-2">{categoryLabel === "Colchões" ? "Colchão" : "Estofado"}</p>
          <h1 className="font-serif text-3xl text-pine">{product.name}</h1>
          <p className="mt-4 text-ink/70 whitespace-pre-line leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <AddToCartForm
              productName={product.name}
              variants={product.variants.map((v) => ({
                id: v.id,
                size: v.size,
                price: Number(v.price),
                stockQuantity: v.stockQuantity,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
