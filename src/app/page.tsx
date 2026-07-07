import Link from "next/link";
import { getFeaturedProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/ProductCard";

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <div>
      <section className="bg-neutral-100">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h1 className="text-4xl font-semibold mb-4">Conforto que você sente todos os dias</h1>
          <p className="text-neutral-600 max-w-xl mx-auto mb-8">
            Colchões e estofados de qualidade, direto de fábrica, com entrega para todo o
            Brasil.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/colchoes" className="rounded bg-neutral-900 text-white px-6 py-3">
              Ver colchões
            </Link>
            <Link href="/estofados" className="rounded border border-neutral-900 px-6 py-3">
              Ver estofados
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">Destaques</h2>
        {featured.length === 0 ? (
          <p className="text-neutral-600">Em breve, novos produtos.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
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
      </section>
    </div>
  );
}
