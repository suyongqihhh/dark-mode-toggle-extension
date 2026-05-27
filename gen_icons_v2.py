#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate clean Dark Mode Toggle icons - simple sun/moon design"""
import struct, zlib, math, os

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

def draw_sun(set_px, w, h):
    """Draw a clean sun icon (light mode) - yellow circle with rays"""
    cx, cy, r = w//2, h//2, min(w,h)//3
    # Anti-aliased circle
    for y in range(h):
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            # Main circle (sun body)
            if dist <= r + 0.8:
                alpha = max(0, min(255, int((r + 0.8 - dist) * 255)))
                # Sun rays
                angle = math.atan2(dy, dx)
                ray = (math.sin(angle * 8) + 1) * 0.15 + 0.7  # 8 rays
                if dist > r * 0.3:
                    brightness = int(255 * ray)
                    set_px(x, y, brightness, brightness, int(80*ray), alpha)
                else:
                    set_px(x, y, 255, 255, 200, alpha)
            # Draw rays
            elif dist <= r * 1.8:
                angle = math.atan2(dy, dx)
                ray_intensity = max(0, 1 - (dist - r) / (r * 0.8))
                ray_pattern = (math.sin(angle * 8) + 1) / 2
                if ray_pattern > 0.5:
                    alpha = int(ray_intensity * 200)
                    set_px(x, y, 255, 255, 180, alpha)

def draw_moon(set_px, w, h):
    """Draw a clean crescent moon icon (dark mode) - white crescent on dark bg"""
    cx, cy, r = w//2, h//2, min(w,h)//3
    for y in range(h):
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            # Moon body (circle)
            if dist <= r + 0.8:
                alpha = max(0, min(255, int((r + 0.8 - dist) * 255)))
                # Cut out crescent (smaller circle offset)
                dx2 = x - (cx + r*0.4)
                dy2 = y - (cy - r*0.4)
                dist2 = math.sqrt(dx2*dx2 + dy2*dy2)
                if dist2 > r * 0.85:
                    # Part of crescent - bright white/blue
                    brightness = int(200 + 55 * (1 - dist/r))
                    set_px(x, y, brightness, brightness, 255, alpha)
                else:
                    # Cut out part - transparent
                    pass
            # Stars
            for sx, sy in [(cx - r, cy - r*0.8), (cx + r*0.7, cy + r*0.3), (cx - r*0.6, cy + r*0.7)]:
                sdist = math.sqrt((x-sx)**2 + (y-sy)**2)
                if sdist < 1.5:
                    set_px(x, y, 200, 220, 255, 255)

# Generate: use moon icon for now (dark mode theme)
for size in (16, 48, 128):
    png = make_png(size, draw_moon)
    path = os.path.join(OUTPUT_DIR, f"icon{size}.png")
    with open(path, "wb") as f:
        f.write(png)
    print(f"[OK] {path} ({size}x{size})")

print("Done.")
