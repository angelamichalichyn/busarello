"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

const sortOptions = [
  { value: "relevancia", label: "Relevância" },
  { value: "menor-preco", label: "Menor preço" },
  { value: "maior-preco", label: "Maior preço" },
  { value: "nome-az", label: "Nome (A-Z)" },
];

export function CatalogFilters({ sizes }: { sizes: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-sand-light">
      <div className="flex items-center gap-2 text-ink/50 text-sm">
        <SlidersHorizontal className="w-4 h-4" />
        Filtrar por
      </div>

      {sizes.length > 0 && (
        <select
          className="input py-2 w-auto"
          value={searchParams.get("tamanho") ?? ""}
          onChange={(e) => updateParam("tamanho", e.target.value)}
        >
          <option value="">Todos os tamanhos</option>
          {sizes.map((size) => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      )}

      <select
        className="input py-2 w-auto"
        value={searchParams.get("preco") ?? ""}
        onChange={(e) => updateParam("preco", e.target.value)}
      >
        <option value="">Qualquer preço</option>
        <option value="0-1000">Até R$ 1.000</option>
        <option value="1000-2000">R$ 1.000 - R$ 2.000</option>
        <option value="2000-">Acima de R$ 2.000</option>
      </select>

      <select
        className="input py-2 w-auto ml-auto"
        value={searchParams.get("ordenar") ?? "relevancia"}
        onChange={(e) => updateParam("ordenar", e.target.value)}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
