from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract perspective-correct Saudi Dent materials from the approved corridor photo.")
    parser.add_argument("source", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    with Image.open(args.source) as source_image:
        source = source_image.convert("RGB")
        if source.size != (7008, 4672):
            raise ValueError(f"Expected the approved 7008x4672 source, got {source.size}")

        # Output corners map to the visible floor trapezoid: far-left, near-left,
        # near-right, far-right. This removes the camera perspective while
        # preserving the photographed tile, veining, grout, and cyan lighting.
        floor_projection = source.transform(
            (2048, 4096),
            Image.Transform.QUAD,
            data=(3010, 2220, 120, 4660, 6888, 4660, 4200, 2220),
            resample=Image.Resampling.BICUBIC,
        )
        # Keep only the clean photographed tile field. The far end of the
        # projection contains real banners and walls, which must remain 3D
        # objects rather than becoming baked into the floor.
        floor = floor_projection.crop((300, 1500, 1700, 4080)).resize(
            (2048, 4096),
            Image.Resampling.LANCZOS,
        )
        floor.save(args.output_dir / "corridor-floor-photo.webp", "WEBP", quality=94, method=6)

        # Clean upper portion of the foreground black-marble pier. It contains
        # the real stone color and subtle photographic illumination without the
        # door handle, campaign banner, or decorative grille.
        black_marble = source.crop((6320, 500, 6960, 1350)).resize(
            (768, 920),
            Image.Resampling.LANCZOS,
        )
        black_marble.save(args.output_dir / "black-marble-photo.webp", "WEBP", quality=94, method=6)


if __name__ == "__main__":
    main()
