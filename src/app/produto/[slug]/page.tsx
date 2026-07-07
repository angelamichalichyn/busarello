import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug } from "@/lib/data/products";
import { AddToCartForm } from "@/components/AddToCartForm";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 grid md:grid-cols-2 gap-10">
      <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden">
        {product.images[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400 text-sm">
            Sem imagem
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="mt-4 text-neutral-700 whitespace-pre-line">{product.description}</p>

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
  );
}
