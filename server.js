// W2G Builder Claude local server. Builds the app, then serves docs/ at http://localhost:8787
// Run with --lan to also allow phones on the same Wi-Fi to open it, and --open to open it in its own app window.
const http = require("http");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");

require("./build.js");

const PORT = Number(process.env.PORT) || 8787;
const LAN = process.argv.includes("--lan");
const HOST = LAN ? "0.0.0.0" : "127.0.0.1";
const DOCS = path.join(__dirname, "docs");
const URL_HERE = "http://localhost:" + PORT;

// Opens the app as its own window (no tabs or address bar). Chrome first because the
// saved candidate list lives in the browser profile, then Edge, then the default browser.
function openWindow() {
  if (!process.argv.includes("--open")) return;
  const pf = [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"], process.env.LOCALAPPDATA].filter(Boolean);
  const browsers = [];
  for (const base of pf) browsers.push(path.join(base, "Google", "Chrome", "Application", "chrome.exe"), path.join(base, "Microsoft", "Edge", "Application", "msedge.exe"));
  const exe = browsers.find(f => fs.existsSync(f));
  if (exe) spawn(exe, ["--app=" + URL_HERE], { detached: true, stdio: "ignore" }).unref();
  else spawn("cmd", ["/c", "start", "", URL_HERE], { detached: true, stdio: "ignore" }).unref();
}
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".webmanifest": "application/manifest+json", ".png": "image/png" };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(DOCS, path.normalize(p));
  if (req.method !== "GET" || !file.startsWith(DOCS + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("Not found");
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, HOST, () => {
  console.log("W2G Builder Claude is running.");
  console.log("  On this PC:   http://localhost:" + PORT);
  if (LAN) {
    for (const nets of Object.values(os.networkInterfaces()))
      for (const n of nets || []) if (n.family === "IPv4" && !n.internal) console.log("  On your phone (same Wi-Fi): http://" + n.address + ":" + PORT);
  }
  console.log("Keep this window open while you use the app. Close it to stop.");
  openWindow();
}).on("error", e => {
  console.error(e.code === "EADDRINUSE" ? "Port " + PORT + " is already in use. W2G Builder Claude may already be running: open http://localhost:" + PORT : e.message);
  if (e.code === "EADDRINUSE") openWindow();
  process.exitCode = 1;
});
