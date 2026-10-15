#!/usr/bin/env python3
"""Generate PNG app icons (no external deps): dark rounded square with a
red circle and white bar. Writes icons/icon-{192,512,maskable-512}.png."""

import os, struct, zlib, math

BG = (13, 17, 23, 255)
RED = (226, 35, 26, 255)
WHITE = (241, 244, 248, 255)
TRANSPARENT = (0, 0, 0, 0)


def png(path, size, radius, scale, alpha):
    cx = cy = size / 2
    circle_r = 13 * scale
    ring_w = 5.5 * scale / 2          # half stroke width
    bar_h = 7 * scale / 2             # half bar height
    bar_w = 17 * scale                # half bar width

    rows = []
    for y in range(size):
        row = bytearray([0])  # filter type 0
        for x in range(size):
            # rounded-rect coverage via distance to corner circle centres
            ox = max(radius - x, x - (size - 1 - radius), 0)
            oy = max(radius - y, y - (size - 1 - radius), 0)
            inside = (ox * ox + oy * oy) <= (radius + 0.5) ** 2
            px = TRANSPARENT if alpha else BG
            if inside:
                d = math.hypot(x - cx, y - cy)
                if abs(y - cy) <= bar_h and abs(x - cx) <= bar_w:
                    px = WHITE
                elif circle_r - ring_w <= d <= circle_r + ring_w:
                    px = RED
                else:
                    px = BG
            row += bytes(px)
        rows.append(bytes(row))

    raw = b"".join(rows)
    def chunk(tag, data):
        c = tag + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n")
        f.write(chunk(b"IHDR", ihdr))
        f.write(chunk(b"IDAT", zlib.compress(raw, 9)))
        f.write(chunk(b"IEND", b""))
    print("wrote", path)


os.makedirs("icons", exist_ok=True)
for size in (192, 512):
    png(f"icons/icon-{size}.png", size, size * 11 / 48, size / 48, alpha=False)
# maskable: same art on a full-bleed background (no rounded corners, no alpha)
png("icons/maskable-512.png", 512, 0, 512 / 48, alpha=False)
