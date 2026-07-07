import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/format";

type ProductCardProps = {
  slug: string;
  name: string;
  category?: "COLCHAO" | "ESTOFADO";
  image?: string;
  fromPrice: number;
};

export function ProductCard({ slug, name, category, image, fromPrice }: ProductCardProps) {
  return (
    <Link
      href={`/produto/${slug}`}
      className="group card overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand/20">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink/30 text-sm font-serif italic">
            Sem imagem
          </div>
        )}
      </div>

      <div className="p-5">
        {category && (
          <span className="text-xs uppercase tracking-wider text-ink/40 font-medium">
            {category === "COLCHAO" ? "Colchão" : "Estofado"}
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
