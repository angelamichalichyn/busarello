import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCart } from "@/lib/cart";
import { CheckoutForm } from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await auth();
  const cart = await getCart();

  if (!cart || cart.items.length === 0) {
    redirect("/carrinho");
  }

  const addresses = session?.user
    ? await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { isDefault: "desc" },
      })
    : [];

  const cartItems = cart.items.map((item) => ({
    id: item.id,
    productName: item.variant.product.name,
    size: item.variant.size,
    unitPrice: Number(item.variant.price),
    quantity: item.quantity,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-serif text-3xl text-pine mb-10">Checkout</h1>
      <CheckoutForm
        isLoggedIn={Boolean(session?.user)}
        addresses={addresses.map((a) => ({
          id: a.id,
          label: a.label,
          recipientName: a.recipientName,
          cep: a.cep,
          street: a.street,
          number: a.number,
          neighborhood: a.neighborhood,
          city: a.city,
          state: a.state,
          isDefault: a.isDefault,
        }))}
        cartItems={cartItems}
      />
    </div>
  );
}
