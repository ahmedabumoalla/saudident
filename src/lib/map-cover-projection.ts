import type { NormalizedPoint } from "@/types/experience";

export type MapSize = { width: number; height: number };

export const CAMPUS_IMAGE_SIZE: MapSize = { width: 1448, height: 1086 };

export function getCoverGeometry(container: MapSize, image: MapSize = CAMPUS_IMAGE_SIZE) {
  const scale = Math.max(container.width / image.width, container.height / image.height);
  const renderedWidth = image.width * scale;
  const renderedHeight = image.height * scale;

  return {
    scale,
    renderedWidth,
    renderedHeight,
    offsetX: (container.width - renderedWidth) / 2,
    offsetY: (container.height - renderedHeight) / 2,
  };
}

export function projectCoverPoint(
  point: NormalizedPoint,
  container: MapSize,
  edgeInset = 28,
): NormalizedPoint {
  if (!container.width || !container.height) return point;

  const geometry = getCoverGeometry(container);
  const rawX = geometry.offsetX + point.x * geometry.renderedWidth;
  const rawY = geometry.offsetY + point.y * geometry.renderedHeight;
  const x = Math.min(container.width - edgeInset, Math.max(edgeInset, rawX));
  const y = Math.min(container.height - edgeInset, Math.max(edgeInset, rawY));

  return { x: x / container.width, y: y / container.height };
}

export function unprojectCoverPoint(point: NormalizedPoint, container: MapSize): NormalizedPoint {
  if (!container.width || !container.height) return point;

  const geometry = getCoverGeometry(container);
  const imageX = (point.x * container.width - geometry.offsetX) / geometry.renderedWidth;
  const imageY = (point.y * container.height - geometry.offsetY) / geometry.renderedHeight;

  return {
    x: Math.min(1, Math.max(0, imageX)),
    y: Math.min(1, Math.max(0, imageY)),
  };
}
