"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrencyBRL } from "@/lib/format";

type SavedAddress = {
  id: string;
  label: string;
  recipientName: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  isDefault: boolean;
};

type CartItem = {
  id: string;
  productName: string;
  size: string;
  unitPrice: number;
  quantity: number;
};

type ShippingQuote = {
  carrierName: string;
  serviceName: string;
  price: number;
  estimatedDays: number;
};

const emptyAddress = {
  recipientName: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export function CheckoutForm({
  isLoggedIn,
  addresses,
  cartItems,
}: {
  isLoggedIn: boolean;
  addresses: SavedAddress[];
  cartItems: CartItem[];
}) {
  const router = useRouter();
  const subtotal = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null
  );
  const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [guestContact, setGuestContact] = useState({ name: "", email: "", phone: "" });

  const [cepLoading, setCepLoading] = useState(false);
  const [quotes, setQuotes] = useState<ShippingQuote[] | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<ShippingQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveCep = useNewAddress
    ? newAddress.cep
    : addresses.find((a) => a.id === selectedAddressId)?.cep ?? "";

  async function handleCepBlur() {
    const cleanCep = newAddress.cep.replace(/\D/g, "");
    if (!useNewAddress || cleanCep.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setNewAddress((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch {
      // busca de CEP é apenas um auxílio; segue com preenchimento manual se falhar
    } finally {
      setCepLoading(false);
    }
  }

  async function handleCalculateShipping() {
    setError(null);
    const cleanCep = effectiveCep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setError("Informe um CEP válido");
      return;
    }
    setQuoteLoading(true);
    setQuotes(null);
    setSelectedQuote(null);
    const res = await fetch("/api/shipping/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cep: cleanCep }),
    });
    setQuoteLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível calcular o frete");
      return;
    }
    const data = await res.json();
    setQuotes(data.quotes);
    if (data.quotes.length === 0) {
      setError("Nenhuma opção de frete disponível para este CEP");
    }
  }

  async function handleSubmit() {
    setError(null);
    if (!selectedQuote) {
      setError("Selecione uma opção de frete");
      return;
    }
    if (!isLoggedIn && (!guestContact.name || !guestContact.email || !guestContact.phone)) {
      setError("Preencha seus dados de contato");
      return;
    }

    setSubmitting(true);
    const payload: Record<string, unknown> = { shipping: selectedQuote };

    if (!useNewAddress && selectedAddressId) {
      payload.addressId = selectedAddressId;
    } else {
      payload.address = newAddress;
    }
    if (!isLoggedIn) {
      payload.guestContact = guestContact;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível finalizar o pedido");
      return;
    }

    const data = await res.json();
    router.push(`/checkout/pagamento/${data.order.orderNumber}`);
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-medium mb-4">Endereço de entrega</h2>

        {addresses.length > 0 && (
          <div className="space-y-2 mb-4">
            {addresses.map((a) => (
              <label
                key={a.id}
                className={`block rounded border p-3 cursor-pointer ${
                  !useNewAddress && selectedAddressId === a.id ? "border-neutral-900" : "border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="mr-2"
                  checked={!useNewAddress && selectedAddressId === a.id}
                  onChange={() => {
                    setUseNewAddress(false);
                    setSelectedAddressId(a.id);
                  }}
                />
                {a.recipientName} — {a.street}, {a.number}, {a.city}/{a.state} — {a.cep}
              </label>
            ))}
            <label className="block">
              <input
                type="radio"
                name="address"
                className="mr-2"
                checked={useNewAddress}
                onChange={() => setUseNewAddress(true)}
              />
              Usar novo endereço
            </label>
          </div>
        )}

        {useNewAddress && (
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Nome do destinatário"
              className="col-span-2 rounded border px-3 py-2"
              value={newAddress.recipientName}
              onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
            />
            <input
              placeholder="Telefone"
              className="rounded border px-3 py-2"
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            />
            <input
              placeholder="CEP"
              className="rounded border px-3 py-2"
              value={newAddress.cep}
              onChange={(e) => setNewAddress({ ...newAddress, cep: e.target.value })}
              onBlur={handleCepBlur}
            />
            <input
              placeholder="Rua"
              className="col-span-2 rounded border px-3 py-2"
              value={newAddress.street}
              onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
            />
            <input
              placeholder="Número"
              className="rounded border px-3 py-2"
              value={newAddress.number}
              onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
            />
            <input
              placeholder="Complemento (opcional)"
              className="rounded border px-3 py-2"
              value={newAddress.complement}
              onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
            />
            <input
              placeholder="Bairro"
              className="rounded border px-3 py-2"
              value={newAddress.neighborhood}
              onChange={(e) => setNewAddress({ ...newAddress, neighborhood: e.target.value })}
            />
            <input
              placeholder="Cidade"
              className="rounded border px-3 py-2"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            />
            <input
              placeholder="UF"
              maxLength={2}
              className="rounded border px-3 py-2"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value.toUpperCase() })}
            />
            {cepLoading && <p className="col-span-2 text-sm text-neutral-500">Buscando CEP...</p>}
          </div>
        )}

        {!isLoggedIn && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <input
              placeholder="Seu nome"
              className="col-span-2 rounded border px-3 py-2"
              value={guestContact.name}
              onChange={(e) => setGuestContact({ ...guestContact, name: e.target.value })}
            />
            <input
              placeholder="E-mail"
              type="email"
              className="rounded border px-3 py-2"
              value={guestContact.email}
              onChange={(e) => setGuestContact({ ...guestContact, email: e.target.value })}
            />
            <input
              placeholder="Telefone"
              className="rounded border px-3 py-2"
              value={guestContact.phone}
              onChange={(e) => setGuestContact({ ...guestContact, phone: e.target.value })}
            />
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-medium mb-4">Frete</h2>
        <button
          type="button"
          onClick={handleCalculateShipping}
          disabled={quoteLoading}
          className="rounded border border-neutral-900 px-4 py-2 disabled:opacity-50"
        >
          {quoteLoading ? "Calculando..." : "Calcular frete"}
        </button>

        {quotes && quotes.length > 0 && (
          <div className="mt-4 space-y-2">
            {quotes.map((q, idx) => (
              <label
                key={idx}
                className={`block rounded border p-3 cursor-pointer ${
                  selectedQuote === q ? "border-neutral-900" : "border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  name="shipping"
                  className="mr-2"
                  checked={selectedQuote === q}
                  onChange={() => setSelectedQuote(q)}
                />
                {q.carrierName} — {q.serviceName} — {formatCurrencyBRL(q.price)} — até {q.estimatedDays} dia(s)
              </label>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-medium mb-4">Resumo</h2>
        <div className="space-y-1 text-sm">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.productName} ({item.size}) x{item.quantity}
              </span>
              <span>{formatCurrencyBRL(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t mt-2">
            <span>Subtotal</span>
            <span>{formatCurrencyBRL(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Frete</span>
            <span>{selectedQuote ? formatCurrencyBRL(selectedQuote.price) : "—"}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t mt-2">
            <span>Total</span>
            <span>{formatCurrencyBRL(subtotal + (selectedQuote?.price ?? 0))}</span>
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !selectedQuote}
        className="w-full rounded bg-neutral-900 text-white py-3 disabled:opacity-50"
      >
        {submitting ? "Processando..." : "Ir para pagamento"}
      </button>
    </div>
  );
}
