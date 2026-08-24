from __future__ import annotations

from pathlib import Path

import imageio_ffmpeg
import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "projects" / "medieval-pirate-walkthrough.mp4"
PREVIEW_DIR = ROOT / "public" / "projects" / "medieval-pirate-video"

# The route moves from the storefront into the central display and then
# deeper into the retail space.
SOURCES = [
    Path(r"D:\Users\4lx\Desktop\1111\7.png"),
    Path(r"D:\Users\4lx\Desktop\1111\8.png"),
    Path(r"D:\Users\4lx\Desktop\1111\9.png"),
]

FPS = 30
SCENE_SECONDS = 4
TRANSITION_SECONDS = 0.9
SIZE = (1296, 800)


def ease(value: float) -> float:
    return value * value * (3.0 - 2.0 * value)


def render_view(image: Image.Image, scene: int, progress: float) -> Image.Image:
    width, height = image.size
    target_aspect = SIZE[0] / SIZE[1]
    max_width = min(width, int(height * target_aspect))
    max_height = int(max_width / target_aspect)

    # Restrained architectural camera moves: push in, orbit, then drift.
    moves = [
        ((0.50, 0.49), (0.50, 0.57), (1.00, 0.82)),
        ((0.44, 0.52), (0.56, 0.50), (0.96, 0.84)),
        ((0.43, 0.53), (0.59, 0.49), (0.95, 0.83)),
    ]
    start, end, zoom = moves[scene]
    p = ease(progress)
    center_x = (start[0] + (end[0] - start[0]) * p) * width
    center_y = (start[1] + (end[1] - start[1]) * p) * height
    scale = zoom[0] + (zoom[1] - zoom[0]) * p
    crop_width = int(max_width * scale)
    crop_height = int(max_height * scale)

    left = int(center_x - crop_width / 2)
    top = int(center_y - crop_height / 2)
    left = max(0, min(width - crop_width, left))
    top = max(0, min(height - crop_height, top))
    crop = image.crop((left, top, left + crop_width, top + crop_height))
    return crop.resize(SIZE, Image.Resampling.LANCZOS)


def main() -> None:
    missing = [path for path in SOURCES if not path.exists()]
    if missing:
        raise FileNotFoundError(f"Missing source images: {missing}")

    images = [Image.open(path).convert("RGB") for path in SOURCES]
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PREVIEW_DIR.mkdir(parents=True, exist_ok=True)

    # Keep the cropped stills as reusable project assets.
    for index, image in enumerate(images):
        render_view(image, index, 0.5).save(
            PREVIEW_DIR / f"scene-{index + 1:02d}.jpg",
            quality=91,
            optimize=True,
        )

    writer = imageio_ffmpeg.write_frames(
        str(OUTPUT),
        SIZE,
        fps=FPS,
        codec="libx264",
        pix_fmt_in="rgb24",
        pix_fmt_out="yuv420p",
        quality=None,
        output_params=["-crf", "24", "-preset", "medium", "-movflags", "+faststart", "-an"],
    )
    writer.send(None)
    frames_per_scene = SCENE_SECONDS * FPS
    transition_frames = int(TRANSITION_SECONDS * FPS)

    try:
        for scene in range(len(images)):
            next_scene = (scene + 1) % len(images)
            for frame in range(frames_per_scene):
                progress = frame / max(1, frames_per_scene - 1)
                current = render_view(images[scene], scene, progress)
                if frame >= frames_per_scene - transition_frames:
                    blend_progress = (
                        frame - (frames_per_scene - transition_frames)
                    ) / max(1, transition_frames - 1)
                    blend_progress = ease(blend_progress)
                    incoming_progress = blend_progress * (transition_frames / frames_per_scene)
                    if scene == len(images) - 1:
                        incoming_progress = 0.0
                    incoming = render_view(images[next_scene], next_scene, incoming_progress)
                    current = Image.blend(current, incoming, blend_progress)
                writer.send(np.asarray(current, dtype=np.uint8))
    finally:
        writer.close()
        for image in images:
            image.close()

    size_mb = OUTPUT.stat().st_size / (1024 * 1024)
    print(
        f"Created {OUTPUT} "
        f"({len(images) * SCENE_SECONDS:.1f}s, {SIZE[0]}x{SIZE[1]}, {size_mb:.2f} MB)"
    )


if __name__ == "__main__":
    main()
