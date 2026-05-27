#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate clean anti-aliased icons - dark mode moon"""
import struct, zlib, math, os

OUTPUT_DIR = r"C:\Users\Administrator\dark-mode-toggle-extension\icons"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def make_png(w, h, pixels):
    raw_rows = bytearray()
    for y in range(h):
        raw_rows.append(0)
        raw_rows.extend(pixels[y * w * 4 : (y+1) * w * 4])
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw_rows), 9)) + chunk(b"IEND", b"")

def clamp(v): return max(0, min(255, int(v)))

def supersample(size, draw_fn):
    """Render at 4x then downsample with box filter"""
    big = size * 4
    buf = bytearray(big * big * 4)
    def set_big(x, y, r, g, b, a=255):
        if 0 <= x < big and 0 <= y < big:
            i = (y * big + x) * 4
            buf[i]   = clamp(r)
            buf[i+1] = clamp(g)
            buf[i+2] = clamp(b)
            buf[i+3] = clamp(a)
    draw_fn(set_big, big, big)

    out = bytearray(size * size * 4)
    for py in range(size):
        for px in range(size):
            rr = gg = bb = aa = cnt = 0
            for dy in range(4):
                for dx in range(4):
                    bx = px * 4 + dx
                    by = py * 4 + dy
                    i = (by * big + bx) * 4
                    if buf[i+3] > 0:
                        rr += buf[i]; gg += buf[i+1]; bb += buf[i+2]; aa += buf[i+3]
                        cnt += 1
            if cnt > 0:
                i2 = (py * size + px) * 4
                out[i2], out[i2+1], out[i2+2], out[i2+3] = rr//cnt, gg//cnt, bb//cnt, aa//cnt
    return out

def draw_moon(set_px, w, h):
    cx, cy, r = w//2, h//2, w//2 - 2
    for y in range(h):
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            if dist <= r + 1.0:
                alpha = clamp((r + 1.0 - dist) * 255)
                dx2 = x - (cx + r*0.35)
                dy2 = y - (cy - r*0.35)
                dist2 = math.sqrt(dx2*dx2 + dy2*dy2)
                if dist2 > r * 0.75:
                    br = clamp(210 + 45 * (1 - dist/r))
                    set_px(x, y, br, min(255, br+20), 255, alpha)
    # Stars
    for sx, sy in [(w*0.25, h*0.3), (w*0.7, h*0.2), (w*0.65, h*0.7)]:
        for dy in range(-1, 2):
            for dx in range(-1, 2):
                nx, ny = int(sx)+dx, int(sy)+dy
                if 0 <= nx < w and 0 <= ny < h:
                    d = math.sqrt((nx-sx)**2 + (ny-sy)**2)
                    if d <= 1.2:
                        alpha = clamp((1.2-d)*200)
                        set_px(nx, ny, 220, 250, 255, alpha)

# Generate with anti-aliasing
for size in (16, 48, 128):
    pixels = supersample(size, draw_moon)
    png = make_png(size, size, pixels)
    path = os.path.join(OUTPUT_DIR, f"icon{size}.png")
    with open(path, "wb") as f:
        f.write(png)
    print(f"[OK] {path} ({size}x{size})")

print("Done with anti-aliasing.")
