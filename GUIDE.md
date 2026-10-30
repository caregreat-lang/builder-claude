# Builder Claude: how to use it

**What it fixes:** your hiring posts weren't reaching young, energetic candidates, and replying to every DM took too much time.
**What it does:** each week it writes a fun hiring post in English, Malay and Chinese (中文), reminds you 3 days before posting day, drafts replies to candidate DMs, and keeps a candidate list you can download as a PDF.

App link (open it on your phone or computer, signed in to claude.ai):
https://claude.ai/artifact/NtZxEK2tsqgzed5Cf5fuRD

## Language / 语言
Tap **中文** at the top right to switch all buttons and menus to Chinese. Tap **EN** to switch back. Each phone or PC remembers its own choice, and phones set to Chinese start in Chinese.

点击右上角的 **中文** 即可把所有按钮和菜单切换成中文，点 **EN** 切换回英文。

## Install it on your phone (with its own icon)
1. On your phone, open **https://caregreat-lang.github.io/builder-claude/**
2. **iPhone:** in Safari, tap Share, then **Add to Home Screen**, then Add.
   **Android:** in Chrome, tap ⋮, then **Install app** (or **Add to Home screen**).
3. The pink chat-bubble **Builder Claude** icon appears on your home screen. It opens full screen like a normal app and works offline once opened.

Your candidate list is saved on the phone only, never on GitHub.

To update the app after changing `index.html` on your PC, run `node build.js`, then commit and push. The phone picks up the new version the next time you open the app while online.

## Running it on your PC
1. Double-click **Builder Claude** on your Desktop. A black window opens and the app opens in your browser at http://localhost:8787.
2. Keep the black window open while you use the app. Close it to stop.
3. To use it from your phone, start **Start Builder Claude (phone access).bat** in the `builder-claude` folder instead. The black window shows an address like `http://192.168.x.x:8787` to open on your phone (same Wi-Fi). If Windows asks about network access, allow **Private networks** only.

How the PC version differs from the claude.ai link:
- Your data is saved in the browser on the device you use. The PC and the phone keep separate lists. Use the same device for one list.
- Posts and DM replies use the built-in templates and basic reader. Claude's AI writing only works on the claude.ai link.
- **Download PDF** saves straight to your Downloads folder.
- Clearing your browser's history or site data deletes the saved list. Download the PDF regularly as a backup.

## One-time setup (2 minutes)
1. Open **This week → Settings**. Enter your company name, the roles you're hiring for, your posting day and time, then tap **Save settings**.
2. Tap **Add to Google Calendar**. This creates a weekly event 3 days before posting day, so your phone reminds you even when the app is closed.
3. On your phone, open the link and use your browser's **Add to Home Screen** so the app opens like a normal app.

## Every week
1. **Reminder** (3 days before): the This week screen turns pink and your calendar alerts you.
2. **Create post**: choose a theme and RedNote or Instagram, then tap **Write post**. Edit the English, Malay and Chinese captions if you want, then tap **Approve post**.
3. Tap **Copy English**, **Copy Malay** or **Copy Chinese**, open RedNote or Instagram, paste and publish. Then tap **Mark as posted**.

## When candidates DM you
1. Copy the DM from RedNote or Instagram.
2. Go to **Reply DMs**, paste the message, add their @username, and tap **Read DM and draft reply**.
3. Check the details it found. Anything the candidate didn't say is marked **Not stated** and is never guessed. The reply asks the candidate for it.
4. Switch between English, Malay and 中文, edit the reply if needed, then tap **Approve, copy and save candidate**. Paste the reply into the chat.

## Candidate PDF
Go to **Candidates**, choose who to include (everyone, shortlisted, or everyone except "not a fit"), and tap **Download PDF**.
Columns: Name, Education Background, Working Experience, Source, Status. Missing details print as "Not provided - ask candidate". Chinese names and schools print correctly.

## Safety rules built in
- Nothing is posted or sent automatically. You approve every post and every reply.
- Deleting a candidate asks you to confirm first.
- Your data is saved privately to your claude.ai account and syncs between your phone and computer.
- You never enter your RedNote or Instagram password into this app.
- Candidates' details are personal data under Malaysia's PDPA. Each reply draft tells the candidate their details are used only for recruitment.
