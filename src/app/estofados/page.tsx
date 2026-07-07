import { getProductsByCategory } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";

export const metadata = { title: "Estofados | Busarello Estofados" };

export default async function EstofadosPage() {
  const products = await getProductsByCategory("ESTOFADO");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">Estofados</h1>
      {products.length === 0 ? (
        <p className="text-neutral-600">Nenhum estofado disponível no momento.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              image={product.images[0]}
              fromPrice={Number(product.variants[0]?.price ?? 0)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
