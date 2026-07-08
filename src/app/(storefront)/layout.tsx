import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="storefront" className="flex min-h-full flex-1 flex-col bg-cream text-ink">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
