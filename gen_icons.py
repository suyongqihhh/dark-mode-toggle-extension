#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate Dark Mode Toggle extension icons (16/48/128 PNG)"""
import struct, zlib, os

OUTPUT_DIR = r"C:\Users\Administrator\dark-mode-toggle-extension\icons"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def make_png(size, draw_fn):
    w = h = size
    raw = bytearray(w * h * 4)
    def set_px(x, y, r, g, b, a=255):
        if 0 <= x < w and 0 <= y < h:
            i = (y * w + x) * 4
            raw[i], raw[i+1], raw[i+2], raw[i+3] = r, g, b, a
    draw_fn(set_px, w, h)
    raw_rows = bytearray()
    for y in range(h):
        raw_rows.append(0)
        raw_rows.extend(raw[y * w * 4 : (y+1) * w * 4])
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(bytes(raw_rows), 9)) + chunk(b"IEND", b"")

def draw_moon(set_px, w, h):
    import math
    cx, cy, r = w//2, h//2, min(w,h)//2 - 1
    for y in range(h):
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            if dist <= r:
                # Inside circle - foreground
                set_px(x, y, 160, 180, 255, 255)
            else:
                set_px(x, y, 0, 0, 0, 0)
    # Cut out a smaller circle to make crescent
    for y in range(h):
        for x in range(w):
            dx2 = x - (cx + r//3)
            dy2 = y - (cy - r//3)
            dist2 = math.sqrt(dx2*dx2 + dy2*dy2)
            if dist2 <= r * 0.75:
                set_px(x, y, 0, 0, 0, 0)
    # Add small stars
    for sx, sy in [(cx - r//2, cy - r//3), (cx + r//3, cy + r//4), (cx - r//4, cy + r//3)]:
        for dy in range(-1, 2):
            for dx in range(-1, 2):
                set_px(int(sx)+dx, int(sy)+dy, 255, 255, 200, 255)

for size in (16, 48, 128):
    png = make_png(size, draw_moon)
    path = os.path.join(OUTPUT_DIR, f"icon{size}.png")
    with open(path, "wb") as f:
        f.write(png)
    print(f"[OK] Generated {path} ({size}x{size})")

print("All icons generated.")
