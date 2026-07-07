"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [selected, setSelected] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-sand-light rounded-2xl overflow-hidden">
        <div className="flex h-full items-center justify-center text-ink/30 text-sm font-serif italic">
          Sem imagem
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square bg-sand-light rounded-2xl overflow-hidden">
        <Image
          src={images[selected]}
          alt={alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelected(index)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors shrink-0 ${
                index === selected ? "border-clay" : "border-transparent hover:border-sand"
              }`}
            >
              <Image src={image} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
