import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/format";

type ProductCardProps = {
  slug: string;
  name: string;
  categoryName?: string;
  image?: string;
  fromPrice: number;
};

export function ProductCard({ slug, name, categoryName, image, fromPrice }: ProductCardProps) {
  return (
    <Link
      href={`/produto/${slug}`}
      className="group rounded-2xl overflow-hidden bg-paper hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/30 text-sm font-serif italic">
            Sem imagem
          </div>
        )}
      </div>

      <div className="p-5">
        {categoryName && (
          <span className="text-xs uppercase tracking-wider text-ink/40 font-medium">
            {categoryName}
          </span>
        )}
        <h3 className="font-serif text-lg text-pine mt-2 mb-3 group-hover:text-clay transition-colors">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-ink/50">a partir de</span>
            <p className="text-xl font-semibold text-clay">{formatCurrencyBRL(fromPrice)}</p>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-clay flex items-center justify-center group-hover:bg-clay transition-colors">
            <ArrowRight className="w-4 h-4 text-clay group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
