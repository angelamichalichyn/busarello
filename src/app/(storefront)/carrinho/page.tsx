import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { getCart } from "@/lib/cart";
import { formatCurrencyBRL } from "@/lib/format";
import { CartItemRow } from "@/components/CartItemRow";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EmptyState } from "@/components/EmptyState";

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <Breadcrumbs items={[{ label: "Carrinho" }]} />
        <EmptyState
          title="Seu carrinho está vazio"
          description="Explore nossa coleção de colchões e estofados de qualidade."
          icon={<ShoppingBag className="w-10 h-10 text-ink/30" />}
          action={{ label: "Ver produtos", href: "/colchoes" }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Carrinho" }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-3xl text-pine">Meu carrinho</h1>
            <span className="text-sm text-ink/50">
              {items.length} {items.length === 1 ? "item" : "itens"}
            </span>
          </div>

          <div className="divide-y divide-sand-light">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                itemId={item.id}
                productName={item.variant.product.name}
                size={item.variant.size}
                unitPrice={Number(item.variant.price)}
                quantity={item.quantity}
                stockQuantity={item.variant.stockQuantity}
              />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-serif text-xl text-pine mb-6">Resumo</h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-ink/60">Subtotal</span>
                <span className="text-ink font-medium">{formatCurrencyBRL(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/60">Frete</span>
                <span className="text-ink/40">Calculado no checkout</span>
              </div>
              <div className="border-t border-sand-light pt-3 flex justify-between">
                <span className="font-semibold text-pine">Total estimado</span>
                <span className="font-bold text-xl text-clay">{formatCurrencyBRL(subtotal)}</span>
              </div>
            </div>

            <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2">
              Finalizar compra
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/colchoes" className="btn-ghost w-full text-center mt-3 block">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
