export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-500 flex flex-col sm:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} Busarello Estofados. Todos os direitos reservados.</p>
        <p>Colchões e estofados de qualidade.</p>
      </div>
    </footer>
  );
}
