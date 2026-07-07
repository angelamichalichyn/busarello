import Link from "next/link";
import { getCart } from "@/lib/cart";
import { formatCurrencyBRL } from "@/lib/format";
import { CartItemRow } from "@/components/CartItemRow";

export default async function CartPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.variant.price) * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">Carrinho</h1>

      {items.length === 0 ? (
        <div>
          <p className="text-neutral-600 mb-4">Seu carrinho está vazio.</p>
          <Link href="/colchoes" className="underline">Ver colchões</Link>
        </div>
      ) : (
        <>
          <div>
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

          <div className="mt-6 flex items-center justify-between">
            <p className="text-lg">Subtotal</p>
            <p className="text-lg font-semibold">{formatCurrencyBRL(subtotal)}</p>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block w-full rounded bg-neutral-900 text-white py-3 text-center"
          >
            Ir para o checkout
          </Link>
        </>
      )}
    </div>
  );
}
