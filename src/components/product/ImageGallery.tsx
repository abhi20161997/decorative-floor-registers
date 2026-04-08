"use client";

import { useState, useRef, useCallback } from "react";

type GalleryImage = {
  url: string;
  alt: string;
};

type ImageGalleryProps = {
  images: GalleryImage[];
  productName?: string;
  finishGradient?: string;
};

function RegisterIllustration() {
  return (
    <div className="mx-auto w-32">
      <div
        className="rounded-lg border border-white/15 p-3"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="grid grid-cols-6 gap-[3px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/1] rounded-[1px]"
              style={{ background: "rgba(0,0,0,0.3)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ImageGallery({
  images,
  productName = "Floor Register",
  finishGradient = "linear-gradient(135deg, #d4c5b0, #c9a96e, #b8976a, #d4b978)",
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomStyle({
        transform: "scale(1.5)",
        transformOrigin: `${x}% ${y}%`,
      });
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    setZoomStyle({});
  }, []);

  const hasRealImages = images.length > 0;

  // Build display images: real images or placeholders with different gradients
  const displayImages = hasRealImages
    ? images
    : [
        { url: "", alt: `${productName} - Main View` },
        { url: "", alt: `${productName} - Detail View` },
        { url: "", alt: `${productName} - Angle View` },
      ];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        ref={imageRef}
        className="relative aspect-[4/3] cursor-crosshair overflow-hidden rounded-lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="flex h-full w-full items-center justify-center transition-transform duration-200 ease-out"
          style={{
            background: finishGradient,
            backgroundSize: "200% 200%",
            ...zoomStyle,
          }}
        >
          {hasRealImages ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={displayImages[activeIndex].url}
              alt={displayImages[activeIndex].alt}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <RegisterIllustration />
              <span className="text-sm font-medium text-white/60">
                {displayImages[activeIndex].alt}
              </span>
            </div>
          )}
        </div>

        {/* Brushed metal texture overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
          }}
        />
      </div>

      {/* Thumbnail strip */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all duration-200 ${
                index === activeIndex
                  ? "ring-2 ring-brass ring-offset-2 ring-offset-ivory"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className="flex h-full w-full items-center justify-center"
                style={{
                  background: finishGradient,
                  backgroundSize: "200% 200%",
                }}
              >
                {hasRealImages ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="mx-auto w-8">
                    <div className="grid grid-cols-4 gap-[1px]">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[3/1] rounded-[0.5px]"
                          style={{ background: "rgba(0,0,0,0.3)" }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
