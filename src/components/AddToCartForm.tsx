"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrencyBRL } from "@/lib/format";

type Variant = {
  id: string;
  size: string;
  price: number;
  stockQuantity: number;
};

export function AddToCartForm({
  variants,
}: {
  productName: string;
  variants: Variant[];
}) {
  const router = useRouter();
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const selected = variants.find((v) => v.id === variantId);

  async function handleAddToCart() {
    setError(null);
    setAdded(false);
    if (!selected) return;

    if (selected.stockQuantity < 1) {
      setError("Produto fora de estoque");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, quantity }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível adicionar ao carrinho");
      return;
    }

    setAdded(true);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs tracking-[0.15em] uppercase text-ink/60 mb-3">Tamanho</label>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVariantId(v.id)}
              className={`rounded-xl border-2 px-4 py-2 text-sm transition-colors ${
                v.id === variantId
                  ? "border-pine bg-pine text-cream"
                  : "border-sand text-ink/80 hover:border-pine"
              } ${v.stockQuantity < 1 ? "opacity-40" : ""}`}
              disabled={v.stockQuantity < 1}
            >
              {v.size}
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <p className="font-serif text-3xl text-clay">{formatCurrencyBRL(selected.price)}</p>
      )}

      <div className="flex items-center gap-3">
        <label className="text-xs tracking-[0.15em] uppercase text-ink/60" htmlFor="quantity">Quantidade</label>
        <input
          id="quantity"
          type="number"
          min={1}
          max={20}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="input w-20 text-center"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      {added && <p className="text-sm text-pine">Adicionado ao carrinho.</p>}

      <button
        type="button"
        onClick={handleAddToCart}
        disabled={loading || !selected || selected.stockQuantity < 1}
        className="btn-primary w-full"
      >
        {loading ? "Adicionando..." : "Adicionar ao carrinho"}
      </button>
    </div>
  );
}
