"use client";

import { useState } from "react";
import { resolveImageUrl } from "@/services/products";

type ProductThumbnailProps = {
  image?: string | null;
  alt: string;
  label: string;
  className?: string;
};

export function ProductThumbnail({ image, alt, label, className = "h-40" }: ProductThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const src = resolveImageUrl(image);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center border-b border-line bg-paper-muted text-xs uppercase tracking-wide text-muted ${className}`}
      >
        {label}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center overflow-hidden border-b border-line bg-paper-muted ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- product photos come from many scraped retailer domains, not worth a next/image remotePatterns entry per store */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-contain p-2"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
