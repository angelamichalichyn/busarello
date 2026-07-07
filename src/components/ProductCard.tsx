import Link from "next/link";
import Image from "next/image";
import { formatCurrencyBRL } from "@/lib/format";

type ProductCardProps = {
  slug: string;
  name: string;
  image?: string;
  fromPrice: number;
};

export function ProductCard({ slug, name, image, fromPrice }: ProductCardProps) {
  return (
    <Link
      href={`/produto/${slug}`}
      className="group block overflow-hidden rounded-lg border border-neutral-200 hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square bg-neutral-100">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400 text-sm">
            Sem imagem
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-neutral-900 group-hover:underline">{name}</h3>
        <p className="mt-1 text-sm text-neutral-600">
          a partir de <span className="font-semibold">{formatCurrencyBRL(fromPrice)}</span>
        </p>
      </div>
    </Link>
  );
}
