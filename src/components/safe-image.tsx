"use client";

import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

export function SafeImage({ fallbackLabel = "صورة سعودي دنت", fallbackSrc, alt, ...props }: ImageProps & { fallbackLabel?: string; fallbackSrc?: string }) {
  const [failed, setFailed] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  if (failed) return <div className="image-placeholder"><span><ImageIcon /><b>{fallbackLabel}</b><small>ستُضاف الصورة قريباً</small></span></div>;
  return <Image {...props} alt={alt} src={usingFallback && fallbackSrc ? fallbackSrc : props.src} onError={() => fallbackSrc && !usingFallback ? setUsingFallback(true) : setFailed(true)} />;
}
