"use client";

import { useState, type SyntheticEvent } from "react";
import Link from "next/link";
import Image from "next/image";

export function CategoryShowcaseLink({
  href,
  image,
  alt,
}: {
  href: string;
  image?: string;
  alt: string;
}) {
  const [aspectRatio, setAspectRatio] = useState("16 / 10");

  function handleImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
    }
  }

  return (
    <Link
      href={href}
      className="group relative block rounded-2xl overflow-hidden bg-paper"
      style={{ aspectRatio: image ? aspectRatio : "16 / 10" }}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          onLoad={handleImageLoad}
        />
      ) : (
        <div className="flex h-full items-center justify-center text-ink/30 text-sm font-serif italic">
          Sem imagem
        </div>
      )}
    </Link>
  );
}
