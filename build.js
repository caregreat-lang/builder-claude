// Builds the installable phone app into docs/ (served by GitHub Pages and by server.js).
// index.html stays the single source; it is also what claude.ai publishes.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname, docs = path.join(root, "docs");
fs.mkdirSync(docs, { recursive: true });
if (!fs.existsSync(path.join(docs, "icons", "icon-512.png"))) require("./gen-icons.js");

const app = fs.readFileSync(path.join(root, "index.html"), "utf8");
const version = crypto.createHash("sha1").update(app).digest("hex").slice(0, 10);

const head = [
  '<meta charset="utf-8">',
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">',
  '<meta name="theme-color" content="#151A2D">',
  '<meta name="description" content="Weekly English + Malay hiring posts, DM reply drafts and a candidate PDF list.">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-title" content="Builder Claude">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
  '<link rel="manifest" href="manifest.webmanifest">',
  '<link rel="icon" type="image/png" sizes="32x32" href="icons/favicon-32.png">',
  '<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">',
  "<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>"
].join("");
const sw = `<script>if("serviceWorker" in navigator)addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));</script>`;

fs.writeFileSync(path.join(docs, "index.html"), `<!doctype html><html lang="en"><head>${head}</head><body>${app}${sw}</body></html>`);

fs.writeFileSync(path.join(docs, "manifest.webmanifest"), JSON.stringify({
  name: "Builder Claude",
  short_name: "Builder Claude",
  description: "Weekly English + Malay hiring posts, DM reply drafts and a candidate PDF list.",
  start_url: "./",
  scope: "./",
  display: "standalone",
  orientation: "portrait",
  background_color: "#151A2D",
  theme_color: "#151A2D",
  icons: [
    { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
}, null, 2));

// Offline support: the app page is fetched fresh when online; fonts and the PDF library are cached after first use.
fs.writeFileSync(path.join(docs, "sw.js"), `const CACHE="builder-claude-${version}";
const SHELL=["./","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  if(r.mode==="navigate"){e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put("./",c));return res}).catch(()=>caches.match("./")));return}
  e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res})));
});
`);
fs.writeFileSync(path.join(docs, ".nojekyll"), "");
console.log("Built docs/ (version " + version + ")");
