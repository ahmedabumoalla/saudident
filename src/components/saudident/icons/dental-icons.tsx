import type { SaudiDentService } from "@/data/saudident";
import type { ReactNode } from "react";

export function DentalIcon({ name }: { name: SaudiDentService["icon"] }) {
  const paths: Record<SaudiDentService["icon"], ReactNode> = {
    implant: <><path d="M12 3v5M8 6h8M9 10h6l-1 10h-4L9 10Z"/><path d="m10 13 4 2m-4 1 4 2"/></>,
    root: <><path d="M8 3c-3 2-3 6-1 9l2 8 3-5 3 5 2-8c2-3 2-7-1-9-2-1-3 1-4 1s-2-2-4-1Z"/><path d="M12 6v7m0 0-2 3m2-3 2 3"/></>,
    prostho: <><path d="M5 8c2-5 12-5 14 0v7c-4 2-10 2-14 0V8Z"/><path d="M7 10h10M8 14h8"/></>,
    gum: <><path d="M4 13c4-5 12-5 16 0M6 16c4-3 8-3 12 0"/><path d="M9 9c0-4 6-4 6 0v4H9V9Z"/></>,
    braces: <><path d="M5 7c3-3 11-3 14 0v8c-3 3-11 3-14 0V7Z"/><path d="M6 11h12M8 9v4m4-4v4m4-4v4"/></>,
    smile: <><path d="M4 8c4-3 12-3 16 0-2 8-14 8-16 0Z"/><path d="M7 10c3 2 7 2 10 0"/><path d="m18 3 .5 1.5L20 5l-1.5.5L18 7l-.5-1.5L16 5l1.5-.5L18 3Z"/></>,
    oral: <><path d="M5 12c3-5 11-7 14-1-1 6-9 8-14 1Z"/><path d="M9 12h6M12 9v6"/></>,
    filling: <><path d="M8 3c-3 2-3 6-1 9l2 8 3-5 3 5 2-8c2-3 2-7-1-9-2-1-3 1-4 1s-2-2-4-1Z"/><path d="m9 8 3 2 3-2"/></>,
    kids: <><path d="M7 9c0-5 10-5 10 0v5c-2 5-8 5-10 0V9Z"/><path d="M9 12h.01M15 12h.01M10 15c1 1 3 1 4 0"/></>,
    crown: <><path d="m5 8 3 3 4-6 4 6 3-3-2 10H7L5 8Z"/><path d="M8 15h8"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{paths[name]}</svg>;
}
