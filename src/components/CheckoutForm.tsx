"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Truck, ClipboardList, Check, ChevronLeft, ChevronRight } from "lucide-react";
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

type Step = "endereco" | "frete" | "revisao";

const steps: { key: Step; label: string; icon: typeof MapPin }[] = [
  { key: "endereco", label: "Endereço", icon: MapPin },
  { key: "frete", label: "Frete", icon: Truck },
  { key: "revisao", label: "Revisão", icon: ClipboardList },
];

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

  const [currentStep, setCurrentStep] = useState<Step>("endereco");
  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

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

  const selectedAddress = useNewAddress
    ? null
    : addresses.find((a) => a.id === selectedAddressId) ?? null;

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

  function validateAddressStep() {
    if (!isLoggedIn && (!guestContact.name || !guestContact.email || !guestContact.phone)) {
      return "Preencha seus dados de contato";
    }
    if (useNewAddress) {
      const { recipientName, phone, cep, street, number, neighborhood, city, state } = newAddress;
      if (!recipientName || !phone || !cep || !street || !number || !neighborhood || !city || !state) {
        return "Preencha o endereço de entrega completo";
      }
    } else if (!selectedAddressId) {
      return "Selecione um endereço de entrega";
    }
    return null;
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

  function handleNext() {
    setError(null);
    if (currentStep === "endereco") {
      const validationError = validateAddressStep();
      if (validationError) {
        setError(validationError);
        return;
      }
    }
    if (currentStep === "frete" && !selectedQuote) {
      setError("Selecione uma opção de frete");
      return;
    }
    const next = steps[currentStepIndex + 1];
    if (next) setCurrentStep(next.key);
  }

  function handleBack() {
    setError(null);
    const prev = steps[currentStepIndex - 1];
    if (prev) setCurrentStep(prev.key);
  }

  async function handleSubmit() {
    setError(null);
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-10">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors shrink-0 ${
                  index <= currentStepIndex ? "bg-clay text-white" : "bg-sand/30 text-ink/30"
                }`}
              >
                {index < currentStepIndex ? <Check className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
              </div>
              <span
                className={`ml-2 text-sm hidden sm:inline ${
                  index <= currentStepIndex ? "text-pine font-medium" : "text-ink/30"
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${index < currentStepIndex ? "bg-clay" : "bg-sand/30"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="card p-6 md:p-8">
          {currentStep === "endereco" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-pine">Endereço de entrega</h2>

              {addresses.length > 0 && (
                <div className="grid gap-3">
                  {addresses.map((a) => (
                    <label
                      key={a.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                        !useNewAddress && selectedAddressId === a.id
                          ? "border-clay bg-clay/5"
                          : "border-sand/40 hover:border-sand"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        className="mr-2 accent-clay"
                        checked={!useNewAddress && selectedAddressId === a.id}
                        onChange={() => {
                          setUseNewAddress(false);
                          setSelectedAddressId(a.id);
                        }}
                      />
                      {a.recipientName} — {a.street}, {a.number}, {a.city}/{a.state} — {a.cep}
                    </label>
                  ))}
                  <label className="text-sm">
                    <input
                      type="radio"
                      name="address"
                      className="mr-2 accent-clay"
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
                    className="input col-span-2"
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress({ ...newAddress, recipientName: e.target.value })}
                  />
                  <input
                    placeholder="Telefone"
                    className="input"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  />
                  <input
                    placeholder="CEP"
                    className="input"
                    value={newAddress.cep}
                    onChange={(e) => setNewAddress({ ...newAddress, cep: e.target.value })}
                    onBlur={handleCepBlur}
                  />
                  <input
                    placeholder="Rua"
                    className="input col-span-2"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  />
                  <input
                    placeholder="Número"
                    className="input"
                    value={newAddress.number}
                    onChange={(e) => setNewAddress({ ...newAddress, number: e.target.value })}
                  />
                  <input
                    placeholder="Complemento (opcional)"
                    className="input"
                    value={newAddress.complement}
                    onChange={(e) => setNewAddress({ ...newAddress, complement: e.target.value })}
                  />
                  <input
                    placeholder="Bairro"
                    className="input"
                    value={newAddress.neighborhood}
                    onChange={(e) => setNewAddress({ ...newAddress, neighborhood: e.target.value })}
                  />
                  <input
                    placeholder="Cidade"
                    className="input"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                  <input
                    placeholder="UF"
                    maxLength={2}
                    className="input"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value.toUpperCase() })}
                  />
                  {cepLoading && <p className="col-span-2 text-sm text-ink/50">Buscando CEP...</p>}
                </div>
              )}

              {!isLoggedIn && (
                <div>
                  <p className="text-sm font-medium text-ink mb-3">Seus dados de contato</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      placeholder="Seu nome"
                      className="input col-span-2"
                      value={guestContact.name}
                      onChange={(e) => setGuestContact({ ...guestContact, name: e.target.value })}
                    />
                    <input
                      placeholder="E-mail"
                      type="email"
                      className="input"
                      value={guestContact.email}
                      onChange={(e) => setGuestContact({ ...guestContact, email: e.target.value })}
                    />
                    <input
                      placeholder="Telefone"
                      className="input"
                      value={guestContact.phone}
                      onChange={(e) => setGuestContact({ ...guestContact, phone: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === "frete" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-pine">Frete</h2>
              <button
                type="button"
                onClick={handleCalculateShipping}
                disabled={quoteLoading}
                className="btn-outline"
              >
                {quoteLoading ? "Calculando..." : "Calcular frete"}
              </button>

              {quotes && quotes.length > 0 && (
                <div className="grid gap-3">
                  {quotes.map((q, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                        selectedQuote === q ? "border-clay bg-clay/5" : "border-sand/40 hover:border-sand"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shipping"
                          className="accent-clay"
                          checked={selectedQuote === q}
                          onChange={() => setSelectedQuote(q)}
                        />
                        <span>
                          <span className="block font-medium text-ink">
                            {q.carrierName} — {q.serviceName}
                          </span>
                          <span className="block text-ink/60">até {q.estimatedDays} dia(s)</span>
                        </span>
                      </span>
                      <span className="font-semibold text-pine">{formatCurrencyBRL(q.price)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStep === "revisao" && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl text-pine">Revisão do pedido</h2>

              <div className="space-y-4">
                <div className="p-4 bg-sand/10 rounded-xl">
                  <p className="text-sm text-ink/50 mb-1">Endereço de entrega</p>
                  {selectedAddress ? (
                    <>
                      <p className="font-medium text-ink">
                        {selectedAddress.street}, {selectedAddress.number}
                      </p>
                      <p className="text-sm text-ink/60">
                        {selectedAddress.neighborhood} — {selectedAddress.city}/{selectedAddress.state}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-ink">
                        {newAddress.street}, {newAddress.number}
                      </p>
                      <p className="text-sm text-ink/60">
                        {newAddress.neighborhood} — {newAddress.city}/{newAddress.state}
                      </p>
                    </>
                  )}
                </div>

                <div className="p-4 bg-sand/10 rounded-xl">
                  <p className="text-sm text-ink/50 mb-1">Frete</p>
                  <p className="font-medium text-ink">
                    {selectedQuote ? `${selectedQuote.carrierName} — ${selectedQuote.serviceName}` : "—"}
                  </p>
                </div>

                <div className="border-t border-sand/30 pt-4">
                  <h3 className="font-medium text-ink mb-3">Itens do pedido</h3>
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2 text-sm">
                      <span className="text-ink/70">
                        {item.productName} ({item.size}) x{item.quantity}
                      </span>
                      <span className="font-medium text-ink">
                        {formatCurrencyBRL(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && <p className="mt-6 text-sm text-red-700">{error}</p>}

          <div className="flex justify-between mt-8 pt-6 border-t border-sand/20">
            {currentStepIndex > 0 ? (
              <button type="button" onClick={handleBack} className="btn-outline inline-flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </button>
            ) : (
              <div />
            )}

            {currentStep !== "revisao" ? (
              <button type="button" onClick={handleNext} className="btn-primary inline-flex items-center gap-2">
                Próximo
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary inline-flex items-center gap-2"
              >
                {submitting ? "Finalizando..." : "Ir para pagamento"}
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="card p-6 sticky top-24">
          <h2 className="font-serif text-xl text-pine mb-6">Resumo do pedido</h2>

          <div className="space-y-3 text-sm">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-ink/70">
                  {item.productName} ({item.size}) x{item.quantity}
                </span>
                <span className="text-ink">{formatCurrencyBRL(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-sand/20 mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/60">Subtotal</span>
              <span className="text-ink">{formatCurrencyBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Frete</span>
              <span className="text-ink">{selectedQuote ? formatCurrencyBRL(selectedQuote.price) : "—"}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-sand/20">
              <span className="font-semibold text-pine">Total</span>
              <span className="font-bold text-xl text-clay">
                {formatCurrencyBRL(subtotal + (selectedQuote?.price ?? 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
