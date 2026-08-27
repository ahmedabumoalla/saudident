import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import type { AbhaTourItemKind, AbhaTourOverlay } from "@/data/abha-tour";

const ITEM_KINDS = new Set<AbhaTourItemKind>([
  "arrow",
  "clinic",
  "sterilization",
  "radiology",
  "lounge",
  "reception",
  "prayer",
  "examination",
  "administration",
  "medical-director",
  "marketing",
]);

function sanitizeItem(value: unknown): AbhaTourOverlay | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const item = value as Partial<AbhaTourOverlay>;
  if (
    typeof item.id !== "string" || !/^[a-z0-9-]{1,100}$/i.test(item.id)
    || typeof item.sceneId !== "string" || !/^abha-(?:0[1-9]|1[01])$/.test(item.sceneId)
    || typeof item.kind !== "string" || !ITEM_KINDS.has(item.kind as AbhaTourItemKind)
    || typeof item.x !== "number" || !Number.isFinite(item.x) || item.x < 0 || item.x > 100
    || typeof item.y !== "number" || !Number.isFinite(item.y) || item.y < 0 || item.y > 100
    || typeof item.scale !== "number" || !Number.isFinite(item.scale) || item.scale < 0.25 || item.scale > 3
    || typeof item.angle !== "number" || !Number.isFinite(item.angle) || item.angle < -180 || item.angle > 180
    || typeof item.tilt !== "number" || !Number.isFinite(item.tilt) || item.tilt < 0 || item.tilt > 85
    || typeof item.depth !== "number" || !Number.isFinite(item.depth) || item.depth < 0.25 || item.depth > 1.5
    || (item.required !== undefined && typeof item.required !== "boolean")
  ) return null;

  const round = (number: number) => Number(number.toFixed(2));
  return {
    id: item.id,
    sceneId: item.sceneId,
    kind: item.kind as AbhaTourItemKind,
    x: round(item.x),
    y: round(item.y),
    scale: round(item.scale),
    angle: round(item.angle),
    tilt: round(item.tilt),
    depth: round(item.depth),
    ...(item.required ? { required: true } : {}),
  };
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });

  try {
    const value: unknown = await request.json();
    if (!Array.isArray(value) || value.length > 300) {
      return NextResponse.json({ error: "Invalid Abha tour layout." }, { status: 400 });
    }
    const items = value.map(sanitizeItem);
    if (items.some((item) => item === null)) {
      return NextResponse.json({ error: "Invalid Abha tour item." }, { status: 400 });
    }
    const sanitized = items as AbhaTourOverlay[];
    const requiredScenes = new Set(sanitized.filter((item) => item.required && item.kind === "arrow").map((item) => item.sceneId));
    if (requiredScenes.size !== 11) {
      return NextResponse.json({ error: "Every Abha scene must keep its main arrow." }, { status: 400 });
    }

    const layoutPath = path.join(process.cwd(), "src", "data", "abha-tour-layout.json");
    await writeFile(layoutPath, `${JSON.stringify(sanitized, null, 2)}\n`, "utf8");
    return NextResponse.json({ saved: true, items: sanitized.length });
  } catch {
    return NextResponse.json({ error: "Could not save Abha tour layout." }, { status: 500 });
  }
}
