"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Building2, ChevronLeft, MapPin, Navigation, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";
import type { Branch } from "@/types";
import { SafeImage } from "./safe-image";

export function MapCanvas({ branches }: { branches: Branch[] }) {
  const [active, setActive] = useState(branches[1].slug);
  return (
    <div className="map-canvas" aria-label="خريطة تفاعلية لفروع سعودي دنت في عسير">
      <div className="map-topography" /><div className="map-road road-one" /><div className="map-road road-two" />
      <span className="map-region">منطقة عسير<small>ASEER REGION</small></span>
      {branches.map((branch) => (
        <div className={`hotspot ${active === branch.slug ? "hotspot-active" : ""}`} key={branch.slug} style={{ left: `${branch.coordinates.x}%`, top: `${branch.coordinates.y}%` }} onMouseEnter={() => setActive(branch.slug)}>
          <button onClick={() => setActive(branch.slug)} aria-label={`عرض ${branch.name}`}><span className="pin-pulse" /><MapPin fill="currentColor" /></button>
          <div className="hotspot-label"><b>{branch.city}</b><small>{branch.coordinates.lat.toFixed(3)}° N</small></div>
          {active === branch.slug && (
            <motion.div className="map-card" initial={{ opacity: 0, scale: .92, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
              <div className="map-card-image"><SafeImage src={branch.cardImage} alt={branch.name} fill sizes="300px" /></div>
              <div className="map-card-body"><span>مجمع سعودي دنت</span><h3>{branch.name}</h3><p>{branch.description.slice(0, 82)}…</p>
                <div className="map-card-meta"><small><Building2 /> {branch.departments.length} تخصصات</small><small><Stethoscope /> {branch.doctors.length} أطباء</small></div>
                <Link href={`/branch/${branch.slug}`}>استكشف الفرع <ArrowLeft /></Link>
              </div>
            </motion.div>
          )}
        </div>
      ))}
      <div className="map-compass"><Navigation /><span>ش</span></div>
      <div className="map-scale"><span /> 10 كم</div>
      <div className="branch-tabs">
        {branches.map((branch) => <button key={branch.slug} className={active === branch.slug ? "active" : ""} onClick={() => setActive(branch.slug)}><i />{branch.city}<ChevronLeft /></button>)}
      </div>
    </div>
  );
}
