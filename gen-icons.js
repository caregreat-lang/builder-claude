// Draws the W2G Builder Claude app icon (grow arrow in a pink circle + W2G on navy) and writes PNGs. No dependencies.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const BG = [21, 26, 45], PINK = [216, 30, 91], WHITE = [255, 255, 255];

// Thick strokes: distance from a point to a polyline (round caps and joins).
function segDist(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - ax - t * dx, py - ay - t * dy);
}
function onStroke(u, v, lines, half) {
  for (const pts of lines) for (let i = 1; i < pts.length; i++) if (segDist(u, v, pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]) <= half) return true;
  return false;
}
function arc(cx, cy, rx, ry, from, to, n = 24) {
  return Array.from({ length: n + 1 }, (_, i) => { const a = (from + (to - from) * i / n) * Math.PI / 180; return [cx + rx * Math.cos(a), cy - ry * Math.sin(a)]; });
}
// Grow arrow inside a pink circle.
const ARROW = [[[0.405, 0.525], [0.575, 0.355]], [[0.475, 0.355], [0.575, 0.355], [0.575, 0.455]]];
// "W2G" letters drawn as strokes, kept inside the maskable safe zone.
const T = 0.75, H = 0.1, BOT = T + H;
const LETTERS = [
  [[0.355, T], [0.38, BOT], [0.41, T + 0.035], [0.44, BOT], [0.465, T]],
  [...arc(0.5175, T + 0.027, 0.0325, 0.027, 160, -40), [0.485, BOT], [0.55, BOT]],
  [...arc(0.605, T + H / 2, 0.04, H / 2, 40, 360), [0.605, T + H / 2]],
].map(pts => pts.map(([x, y]) => [0.5 + (x - 0.5) * 1.5, 0.62 + (y - T) * 1.5]));
// Colour at a point in the unit square; withText=false for tiny icons where letters would blur.
function colour(u, v, withText) {
  if (withText && u > 0.25 && u < 0.75 && v > 0.59 && v < 0.8 && onStroke(u, v, LETTERS, 0.022)) return WHITE;
  const cy = withText ? 0.37 : 0.5, r = withText ? 0.18 : 0.34;
  if (Math.hypot(u - 0.5, v - cy) <= r) {
    const k = r / 0.245;
    return onStroke(0.5 + (u - 0.5) / k, 0.44 + (v - cy) / k, ARROW, 0.034) ? WHITE : PINK;
  }
  return BG;
}
function png(size) {
  const SS = 4, raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0;
      for (let j = 0; j < SS; j++) for (let i = 0; i < SS; i++) {
        const c = colour((x + (i + 0.5) / SS) / size, (y + (j + 0.5) / SS) / size, size >= 64);
        r += c[0]; g += c[1]; b += c[2];
      }
      const o = y * (size * 4 + 1) + 1 + x * 4, n = SS * SS;
      raw[o] = Math.round(r / n); raw[o + 1] = Math.round(g / n); raw[o + 2] = Math.round(b / n); raw[o + 3] = 255;
    }
  }
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = buf => { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type), data]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
    return Buffer.concat([len, td, c]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

const out = path.join(__dirname, "docs", "icons");
fs.mkdirSync(out, { recursive: true });
for (const [name, size] of [["icon-512.png", 512], ["icon-192.png", 192], ["apple-touch-icon.png", 180], ["favicon-32.png", 32]])
  fs.writeFileSync(path.join(out, name), png(size));
// Windows icon for the desktop shortcut (an .ico can hold PNG images directly).
const imgs = [256, 48, 32].map(s => png(s)), head = Buffer.alloc(6 + 16 * imgs.length);
head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4);
let off = head.length;
imgs.forEach((img, i) => {
  const e = 6 + 16 * i, s = [256, 48, 32][i] % 256;
  head[e] = s; head[e + 1] = s; head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6);
  head.writeUInt32LE(img.length, e + 8); head.writeUInt32LE(off, e + 12); off += img.length;
});
fs.writeFileSync(path.join(__dirname, "app.ico"), Buffer.concat([head, ...imgs]));
console.log("Icons written to docs/icons and app.ico");
