import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center flex-wrap gap-2 text-sm">
        <li className="flex items-center">
          <Link href="/" className="text-ink/50 hover:text-clay transition-colors">
            Início
          </Link>
          {items.length > 0 && <ChevronRight className="w-4 h-4 mx-2 text-ink/30" />}
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link href={item.href} className="text-ink/50 hover:text-clay transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-pine font-medium">{item.label}</span>
            )}
            {index < items.length - 1 && <ChevronRight className="w-4 h-4 mx-2 text-ink/30" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
