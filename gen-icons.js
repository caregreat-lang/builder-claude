// Draws the Builder Claude app icon (pink chat bubble + spark on navy) and writes PNGs. No dependencies.
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const BG = [21, 26, 45], PINK = [216, 30, 91], WHITE = [255, 255, 255], SPARK = [255, 200, 87];

function roundRect(x, y, cx, cy, hw, hh, r) {
  const dx = Math.max(Math.abs(x - cx) - (hw - r), 0), dy = Math.max(Math.abs(y - cy) - (hh - r), 0);
  return Math.hypot(dx, dy) <= r;
}
function inTri(px, py, a, b, c) {
  const s = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
  const p = [px, py], d1 = s(p, a, b), d2 = s(p, b, c), d3 = s(p, c, a);
  return !((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0));
}
// Colour at a point in the unit square; everything sits inside the maskable safe zone.
function colour(u, v) {
  const sx = Math.abs(u - 0.735), sy = Math.abs(v - 0.275);
  if (Math.sqrt(sx) + Math.sqrt(sy) <= Math.sqrt(0.085)) return SPARK;
  for (const x of [0.385, 0.5, 0.615]) if (Math.hypot(u - x, v - 0.5) <= 0.04) return WHITE;
  if (roundRect(u, v, 0.5, 0.5, 0.25, 0.165, 0.09) || inTri(u, v, [0.33, 0.6], [0.29, 0.75], [0.46, 0.64])) return PINK;
  return BG;
}
function png(size) {
  const SS = 4, raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0;
      for (let j = 0; j < SS; j++) for (let i = 0; i < SS; i++) {
        const c = colour((x + (i + 0.5) / SS) / size, (y + (j + 0.5) / SS) / size);
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
console.log("Icons written to docs/icons");
