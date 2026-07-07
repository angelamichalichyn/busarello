"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="flex items-center justify-between border-b py-4">
      <div>
        <p className="font-medium">{productName}</p>
        <p className="text-sm text-neutral-600">Tamanho: {size}</p>
        <p className="text-sm text-neutral-600">{formatCurrencyBRL(unitPrice)} / un.</p>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={Math.min(20, stockQuantity)}
          value={quantity}
          disabled={loading}
          onChange={(e) => updateQuantity(Number(e.target.value))}
          className="w-16 rounded border px-2 py-1"
        />
        <p className="w-24 text-right font-medium">{formatCurrencyBRL(unitPrice * quantity)}</p>
        <button
          type="button"
          onClick={removeItem}
          disabled={loading}
          className="text-sm text-red-600 underline"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
