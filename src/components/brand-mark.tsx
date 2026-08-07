"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function BrandMark({ light = false }: { light?: boolean }) {
  const [logoFailed, setLogoFailed] = useState(false);
  return (
    <Link href="/" className={`brand-mark ${light ? "brand-mark-light" : ""}`} aria-label="العودة إلى الرئيسية">
      {!logoFailed && <Image className="brand-logo" src={light ? "/branding/saudident-logo-white.png" : "/branding/saudident-logo.png"} alt="سعودي دنت" width={165} height={52} priority onError={() => setLogoFailed(true)} />}
      {logoFailed && <><span className="brand-symbol" aria-hidden="true">S</span><span><strong>سعودي دنت</strong><small>SAUDI DENT</small></span></>}
    </Link>
  );
}
