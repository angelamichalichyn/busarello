import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { AddToCartForm } from "@/components/AddToCartForm";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductCard } from "@/components/ProductCard";

const CATEGORY_ROUTES: Record<string, string> = {
  colchao: "/colchoes",
  estofado: "/estofados",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const categoryHref = CATEGORY_ROUTES[product.category.slug];

  const galleryImages = Array.from(
    new Set([...product.images, ...product.variants.flatMap((v) => v.images)])
  );

  const related = await getRelatedProducts(product.categoryId, product.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10">
      <Breadcrumbs
        items={[
          { label: product.category.name, href: categoryHref },
          { label: product.name },
        ]}
      />

      <div className="grid md:grid-cols-2 gap-12 mt-4">
        <ProductGallery images={galleryImages} alt={product.name} />

        <div>
          <p className="eyebrow mb-2">{product.category.name}</p>
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

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-serif text-2xl text-pine mb-8">Você também pode gostar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {related.map((item) => (
              <ProductCard
                key={item.id}
                slug={item.slug}
                name={item.name}
                categoryName={item.category.name}
                image={item.images[0]}
                fromPrice={Number(item.variants[0]?.price ?? 0)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
