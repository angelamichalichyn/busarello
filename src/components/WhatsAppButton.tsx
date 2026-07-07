import { MessageCircle } from "lucide-react";
import { CONTACT_WHATSAPP_LINK } from "@/lib/contact";

export function WhatsAppButton() {
  return (
    <a
      href={CONTACT_WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle className="w-7 h-7" fill="white" />
    </a>
  );
}
