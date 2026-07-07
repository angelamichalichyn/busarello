"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const states = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export function AddAddressForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "Principal",
    recipientName: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCepBlur() {
    const cleanCep = form.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setForm((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
      }
    } catch {
      // busca de CEP é apenas um auxílio; segue com preenchimento manual se falhar
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.recipientName || !form.phone || !form.cep || !form.street || !form.number || !form.neighborhood || !form.city || !form.state) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível salvar o endereço.");
      return;
    }

    router.push(redirectTo || "/conta/enderecos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="recipientName" className="block text-sm font-medium text-ink mb-2">
            Nome do destinatário *
          </label>
          <input
            id="recipientName"
            name="recipientName"
            value={form.recipientName}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-ink mb-2">
            Telefone *
          </label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="input" required />
        </div>

        <div>
          <label htmlFor="cep" className="block text-sm font-medium text-ink mb-2">
            CEP *
          </label>
          <input
            id="cep"
            name="cep"
            value={form.cep}
            onChange={handleChange}
            onBlur={handleCepBlur}
            className="input"
            maxLength={9}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="street" className="block text-sm font-medium text-ink mb-2">
            Rua / Avenida *
          </label>
          <input id="street" name="street" value={form.street} onChange={handleChange} className="input" required />
        </div>

        <div>
          <label htmlFor="number" className="block text-sm font-medium text-ink mb-2">
            Número *
          </label>
          <input id="number" name="number" value={form.number} onChange={handleChange} className="input" required />
        </div>

        <div>
          <label htmlFor="complement" className="block text-sm font-medium text-ink mb-2">
            Complemento
          </label>
          <input id="complement" name="complement" value={form.complement} onChange={handleChange} className="input" />
        </div>

        <div>
          <label htmlFor="neighborhood" className="block text-sm font-medium text-ink mb-2">
            Bairro *
          </label>
          <input
            id="neighborhood"
            name="neighborhood"
            value={form.neighborhood}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-ink mb-2">
            Cidade *
          </label>
          <input id="city" name="city" value={form.city} onChange={handleChange} className="input" required />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-ink mb-2">
            Estado *
          </label>
          <select id="state" name="state" value={form.state} onChange={handleChange} className="input" required>
            <option value="">Selecione</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? "Salvando..." : "Salvar endereço"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}
