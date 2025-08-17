import React, { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  name: string;
  width?: number;
  height?: number;
  angleDeg?: number;
  stripeThickness?: number;
  toneOverride?: "light" | "dark";
  tintHue?: number;
  disableShimmer?: boolean;
  className?: string;
};

const linearize = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

async function measureLogoLightness(src: string): Promise<number | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    const done = new Promise<HTMLImageElement>((res, rej) => {
      img.onload = () => res(img);
      img.onerror = (e) => rej(e);
    });
    img.src = src;
    const el = await done;

    const w = Math.min(72, el.naturalWidth || 72);
    const h = Math.min(72, el.naturalHeight || 72);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(el, 0, 0, w, h);
    const { data } = ctx.getImageData(0, 0, w, h);

    let sum = 0,
      count = 0;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 40) continue;
      const r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      const L =
        0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
      sum += L;
      count++;
    }
    return count ? sum / count : null;
  } catch {
    return null;
  }
}

const getCachedTone = (src: string) => {
  try {
    const v = localStorage.getItem(`logo-tone:${src}`);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
};
const setCachedTone = (src: string, tone: "light" | "dark") => {
  try {
    localStorage.setItem(`logo-tone:${src}`, tone);
  } catch {}
};

export default function LogoGlassStripe({
  src,
  name,
  width = 240,
  height = 140,
  angleDeg = -12,
  stripeThickness = 56,
  toneOverride,
  tintHue,
  disableShimmer,
  className = "",
}: Props) {
  const [tone, setTone] = useState<"light" | "dark">(
    toneOverride ?? getCachedTone(src) ?? "light",
  );
  const [ready, setReady] = useState(!!toneOverride || !!getCachedTone(src));
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    if (toneOverride) {
      setReady(true);
      return;
    }

    const cached = getCachedTone(src);
    if (cached) {
      setTone(cached);
      setReady(true);
      return;
    }

    measureLogoLightness(src)
      .then((L) => {
        if (!mounted) return;
        const t: "light" | "dark" = L !== null && L >= 0.65 ? "dark" : "light";
        setTone(t);
        setCachedTone(src, t);
        setReady(true);
      })
      .catch(() => {
        if (!mounted) return;
        setTone("light");
        setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, [src, toneOverride]);

  const h = tintHue ?? (tone === "dark" ? 220 : 0);
  const s = tone === "dark" ? 12 : 10;
  const l = tone === "dark" ? 58 : 100;

  const logoFilter =
    "drop-shadow(0 0 0.35px rgba(0,0,0,.40)) drop-shadow(0 0 0.35px rgba(255,255,255,.40))";

  const styleVars: React.CSSProperties = {
    width,
    height,
    ["--stripe-thickness" as any]: `${stripeThickness}px`,
    ["--stripe-max-width" as any]: `${Math.round(width * 0.9)}px`,
    ["--stripe-rotate" as any]: `${angleDeg}deg`,
    ["--stripe-tint" as any]: `${h} ${s}% ${l}%`,
    ["--stripe-tint-alpha" as any]: tone === "dark" ? 0.18 : 0.12,
    ["--stripe-highlight-alpha" as any]: 0.55,
  };

  return (
    <div
      ref={hostRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={styleVars}
      aria-label={`${name} logo`}
    >
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[var(--stripe-rotate)] lg-shimmer`}
        style={{ width: "min(100%, var(--stripe-max-width))" }}
        aria-hidden="true"
      >
        <div className="lg-glass relative"></div>
        {disableShimmer ? null : <div className="lg-shine"></div>}
      </div>

      <img
        src={src}
        alt={name}
        width={Math.round(width * 0.55)}
        height={Math.round(height * 0.55)}
        loading="lazy"
        crossOrigin="anonymous"
        style={{
          maxWidth: "60%",
          maxHeight: "60%",
          objectFit: "contain",
          filter: logoFilter,
        }}
      />
      {!ready && <span className="sr-only">Loading {name} logo…</span>}
    </div>
  );
}
