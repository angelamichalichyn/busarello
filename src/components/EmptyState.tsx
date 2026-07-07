import Link from "next/link";
import { PackageOpen } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 rounded-full bg-sand/30 flex items-center justify-center mb-6">
        {icon ?? <PackageOpen className="w-10 h-10 text-ink/30" />}
      </div>
      <h2 className="font-serif text-2xl text-pine mb-3">{title}</h2>
      <p className="text-ink/60 max-w-md mb-8 leading-relaxed">{description}</p>
      {action && (
        <Link href={action.href} className="btn-primary">
          {action.label}
        </Link>
      )}
    </div>
  );
}
