"use client";

import { useState } from "react";

type Props = {
  slug: string;
  colors: [string, string, string];
  /** Real alt text for the photo, shown to screen readers either way. */
  alt: string;
  /** Visible caption under the image (detail page only). */
  caption?: string;
  className?: string;
};

/**
 * Shows the real recipe photo from /public/recipes/{slug}.png when it
 * exists. Most recipes don't have one yet (see docs/10-prompts-imagenes-100-recetas.md
 * and `npm run generate:images`), so this falls back to an abstract
 * editorial placeholder gradient instead of a broken image -- never
 * presented as a real photo itself, the caption always says so.
 */
export function RecipePlate({ slug, colors, alt, caption, className }: Props) {
  const [photoFailed, setPhotoFailed] = useState(false);
  const [p1, p2, p3] = colors;

  return (
    <figure className={className}>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line"
        style={{
          background: `
            radial-gradient(120% 120% at 28% 18%, ${p1}, transparent 60%),
            radial-gradient(100% 100% at 78% 72%, ${p2}, transparent 55%),
            radial-gradient(90% 90% at 50% 50%, ${p3}, transparent 72%),
            var(--cream-2)`,
        }}
      >
        {!photoFailed && (
          // eslint-disable-next-line @next/next/no-img-element -- source set may or may not exist per recipe, so a plain <img> with onError is simpler than teaching next/image about a dynamic missing-file fallback
          <img
            src={`/recipes/${slug}.png`}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setPhotoFailed(true)}
          />
        )}
        {photoFailed && (
          <div className="absolute inset-[9%] rounded-full border border-white/30 mix-blend-overlay" />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs leading-relaxed text-cacao-soft">
          {photoFailed ? (
            <>
              <b className="font-semibold">Ilustración editorial de referencia</b> — {caption}
            </>
          ) : (
            caption
          )}
        </figcaption>
      )}
    </figure>
  );
}
