"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { formatCurrencyBRL } from "@/lib/format";

export function CartItemRow({
  itemId,
  productName,
  size,
  unitPrice,
  quantity,
  stockQuantity,
}: {
  itemId: string;
  productName: string;
  size: string;
  unitPrice: number;
  quantity: number;
  stockQuantity: number;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateQuantity(newQuantity: number) {
    setError(null);
    setLoading(true);
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao atualizar quantidade");
      return;
    }
    router.refresh();
  }

  async function removeItem() {
    setLoading(true);
    await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex items-center justify-between py-6">
      <div>
        <p className="font-serif text-lg text-pine">{productName}</p>
        <p className="text-sm text-ink/60">Tamanho: {size}</p>
        <p className="text-sm text-ink/60">{formatCurrencyBRL(unitPrice)} / un.</p>
        {error && <p className="text-sm text-red-700">{error}</p>}
      </div>
      <div className="flex items-center gap-4">
        <input
          type="number"
          min={1}
          max={Math.min(20, stockQuantity)}
          value={quantity}
          disabled={loading}
          onChange={(e) => updateQuantity(Number(e.target.value))}
          className="input w-16 text-center"
        />
        <p className="w-24 text-right text-clay">{formatCurrencyBRL(unitPrice * quantity)}</p>
        <button
          type="button"
          onClick={removeItem}
          disabled={loading}
          aria-label="Remover item"
          className="text-ink/40 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}
