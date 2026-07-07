"use client";

import { useState } from "react";

export function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `Nome: ${form.name}\nE-mail: ${form.email}\nTelefone: ${form.phone}\n\n${form.message}`;
    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(
      form.subject || "Contato pelo site"
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-ink mb-2">Nome</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} className="input" placeholder="Seu nome" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">E-mail</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="seu@email.com" required />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink mb-2">Telefone</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className="input" placeholder="(00) 00000-0000" />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-ink mb-2">Assunto</label>
        <select id="subject" name="subject" value={form.subject} onChange={handleChange} className="input" required>
          <option value="">Selecione um assunto</option>
          <option value="Dúvida sobre produto">Dúvida sobre produto</option>
          <option value="Status do pedido">Status do pedido</option>
          <option value="Solicitar orçamento">Solicitar orçamento</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink mb-2">Mensagem</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="input resize-none"
          placeholder="Como podemos ajudar?"
          required
        />
      </div>
      {sent && (
        <p className="text-sm text-pine">
          Abrimos seu aplicativo de e-mail com a mensagem pronta para envio.
        </p>
      )}
      <button type="submit" className="btn-primary w-full">
        Enviar mensagem
      </button>
    </form>
  );
}
