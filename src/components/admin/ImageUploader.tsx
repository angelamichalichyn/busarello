"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";

export function ImageUploader({
  name,
  initialImages = [],
  label,
}: {
  name: string;
  initialImages?: string[];
  label?: string;
}) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Não foi possível enviar a imagem");
        continue;
      }
      setImages((prev) => [...prev, data.url]);
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-ink mb-2">{label}</label>}
      <input type="hidden" name={name} value={JSON.stringify(images)} />

      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url) => (
          <div key={url} className="relative w-24 h-24 rounded-xl overflow-hidden bg-sand/20 border border-sand-light group">
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remover imagem"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <label className="w-24 h-24 rounded-xl border-2 border-dashed border-sand flex flex-col items-center justify-center text-ink/50 cursor-pointer hover:border-clay hover:text-clay transition-colors">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          <span className="text-xs mt-1">{uploading ? "Enviando..." : "Adicionar"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={uploading}
          />
        </label>
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
