import React, { useEffect, useState } from "react";

type Props = {
  src: string;
  name: string;
  width?: number;
  height?: number;
  toneOverride?: "light" | "dark";
  intensity?: number;
  className?: string;
  boostInDarkTheme?: boolean;
};

const rl = (v: number) => {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

async function measureLogoLightness(src: string): Promise<number | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    const ready = new Promise<HTMLImageElement>((res, rej) => {
      img.onload = () => res(img);
      img.onerror = (e) => rej(e);
    });
    img.src = src;
    const el = await ready;
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
      const L = 0.2126 * rl(r) + 0.7152 * rl(g) + 0.0722 * rl(b);
      sum += L;
      count++;
    }
    return count ? sum / count : null;
  } catch {
    return null;
  }
}

const cacheGet = (src: string) => {
  try {
    const v = localStorage.getItem(`logo-tone:${src}`);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
};
const cacheSet = (src: string, tone: "light" | "dark") => {
  try {
    localStorage.setItem(`logo-tone:${src}`, tone);
  } catch {}
};

export default function LogoSpot({
  src,
  name,
  width = 240,
  height = 140,
  toneOverride,
  intensity,
  className = "",
  boostInDarkTheme = true,
}: Props) {
  const [tone, setTone] = useState<"light" | "dark">(
    toneOverride ?? cacheGet(src) ?? "light",
  );
  const [ready, setReady] = useState<boolean>(
    !!toneOverride || !!cacheGet(src),
  );
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      if (document.documentElement.classList.contains("dark")) return true;
    }
    if (typeof window !== "undefined" && "matchMedia" in window) {
      try {
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
      } catch {}
    }
    return false;
  });

  useEffect(() => {
    if (toneOverride) {
      setReady(true);
      return;
    }
    const cached = cacheGet(src);
    if (cached) {
      setTone(cached);
      setReady(true);
      return;
    }
    let mounted = true;
    measureLogoLightness(src)
      .then((L) => {
        if (!mounted) return;
        const t: "light" | "dark" = L !== null && L >= 0.65 ? "dark" : "light";
        setTone(t);
        cacheSet(src, t);
        setReady(true);
      })
      .catch(() => {
        if (mounted) {
          setTone("light");
          setReady(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [src, toneOverride]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const flag =
        document.documentElement.classList.contains("dark") ||
        (mq ? mq.matches : false);
      setIsDarkTheme(flag);
    };
    handler();
    mq && mq.addEventListener && mq.addEventListener("change", handler);
    const obs = new MutationObserver(handler);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      mq && mq.removeEventListener && mq.removeEventListener("change", handler);
      obs.disconnect();
    };
  }, []);

  const spot =
    tone === "dark"
      ? { h: 220, s: 12, l: 10, a: 0.46 }
      : { h: 0, s: 0, l: 100, a: 0.42 };
  const userIntensity = Math.max(0, Math.min(3, intensity ?? 1.1));
  const isLightSpot = tone === "light";
  const isDarkSpot = tone === "dark";

  const boostFactor = 1.0;
  const dampenFactor = isLightSpot && isDarkTheme ? 0.68 : 1.0;
  const a = userIntensity * spot.a * boostFactor * dampenFactor;

  const ringA = isLightSpot && isDarkTheme ? 0.6 : 0.55;

  const spotW = isLightSpot && isDarkTheme ? "86%" : "90%";
  const spotH = isLightSpot && isDarkTheme ? "50%" : "54%";
  const spotBlur = isLightSpot && isDarkTheme ? "18px" : "20px";

  const vars: React.CSSProperties = {
    width,
    height,
    ["--ls-h" as any]: spot.h,
    ["--ls-s" as any]: `${spot.s}%`,
    ["--ls-l" as any]: `${spot.l}%`,
    ["--ls-a" as any]: a,
    ["--ls-spot-w" as any]: spotW,
    ["--ls-spot-h" as any]: spotH,
    ["--ls-spot-blur" as any]: spotBlur,
    ["--ls-ring-a" as any]: ringA,
  };

  return (
    <div
      className={`ls-host ${className}`}
      style={vars}
      aria-label={`${name} logo`}
    >
      <div className="ls-spot" aria-hidden="true" />
      <img
        className="ls-img"
        src={src}
        alt={name}
        width={Math.round(width * 0.56)}
        height={Math.round(height * 0.56)}
        loading="lazy"
        crossOrigin="anonymous"
      />
      {!ready && <span className="sr-only">Loading {name} logo…</span>}
    </div>
  );
}
