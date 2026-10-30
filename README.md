# W2G Builder Claude

A phone app that helps a consulting team attract young, energetic candidates. It writes a weekly hiring post in English and Malay, reminds you 3 days before posting day, drafts replies to candidate DMs for your approval, and exports a candidate list as a PDF.

Candidate data stays on your own device (browser storage). Nothing is uploaded, and nothing is posted or sent without your approval.

## Install on your phone
Open the GitHub Pages link for this repository on your phone, then:
- **iPhone (Safari):** tap Share, then **Add to Home Screen**.
- **Android (Chrome):** tap ⋮, then **Install app** or **Add to Home screen**.

## Develop
- `index.html` is the app (the single source file).
- `node build.js` builds the installable app into `docs/` (manifest, icons, offline support).
- `node server.js` builds and serves it at http://localhost:8787 (`--lan` to open it from a phone on the same Wi-Fi).
- `node gen-icons.js` redraws the app icons.

Commit and push `docs/` after building. GitHub Pages serves the `docs/` folder.

See [GUIDE.md](GUIDE.md) for how to use the app.
