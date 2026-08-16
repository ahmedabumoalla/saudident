import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type ControlPlacement = {
  x: number;
  y: number;
  scale: number;
  angle?: number;
  tilt?: number;
  depth?: number;
};

function sanitizeLayout(value: unknown): Record<string, ControlPlacement> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const sanitized: Record<string, ControlPlacement> = {};
  for (const [key, placement] of Object.entries(value)) {
    if (!/^[a-z0-9:._-]{1,160}$/i.test(key) || !placement || typeof placement !== "object" || Array.isArray(placement)) {
      return null;
    }

    const candidate = placement as Partial<ControlPlacement>;
    if (
      typeof candidate.x !== "number" || !Number.isFinite(candidate.x) || candidate.x < 0 || candidate.x > 100
      || typeof candidate.y !== "number" || !Number.isFinite(candidate.y) || candidate.y < 0 || candidate.y > 100
      || typeof candidate.scale !== "number" || !Number.isFinite(candidate.scale) || candidate.scale < 0.25 || candidate.scale > 3
      || (candidate.angle !== undefined && (typeof candidate.angle !== "number" || !Number.isFinite(candidate.angle) || candidate.angle < -180 || candidate.angle > 180))
      || (candidate.tilt !== undefined && (typeof candidate.tilt !== "number" || !Number.isFinite(candidate.tilt) || candidate.tilt < 0 || candidate.tilt > 85))
      || (candidate.depth !== undefined && (typeof candidate.depth !== "number" || !Number.isFinite(candidate.depth) || candidate.depth < 0.25 || candidate.depth > 1.5))
    ) {
      return null;
    }

    sanitized[key] = {
      x: Number(candidate.x.toFixed(2)),
      y: Number(candidate.y.toFixed(2)),
      scale: Number(candidate.scale.toFixed(2)),
      ...(candidate.angle === undefined ? {} : { angle: Number(candidate.angle.toFixed(2)) }),
      ...(candidate.tilt === undefined ? {} : { tilt: Number(candidate.tilt.toFixed(2)) }),
      ...(candidate.depth === undefined ? {} : { depth: Number(candidate.depth.toFixed(2)) }),
    };
  }

  return sanitized;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const layout = sanitizeLayout(await request.json());
    if (!layout) {
      return NextResponse.json({ error: "Invalid conference layout." }, { status: 400 });
    }

    const layoutPath = path.join(process.cwd(), "src", "data", "conference-layout.json");
    await writeFile(layoutPath, `${JSON.stringify(layout, null, 2)}\n`, "utf8");
    return NextResponse.json({ saved: true, controls: Object.keys(layout).length });
  } catch {
    return NextResponse.json({ error: "Could not save conference layout." }, { status: 500 });
  }
}
