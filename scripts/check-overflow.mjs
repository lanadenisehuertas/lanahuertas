// Fails if any page scrolls sideways at common widths.
// Usage: node scripts/check-overflow.mjs
import { spawn } from "node:child_process";

const PAGES = ["/", "/design", "/videos", "/ui-ux"];
const WIDTHS = [320, 375, 500, 768, 1024, 1440, 1920];
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1440,900",
  "--remote-debugging-port=9334", `--user-data-dir=${process.cwd()}/.codex-scratch/chrome-ovf`, "about:blank",
]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let page;
for (let t = 0; !page && t < 120; t++) {
  await wait(500);
  page = await fetch("http://127.0.0.1:9334/json").then((r) => r.json()).then((l) => l.find((p) => p.type === "page")).catch(() => undefined);
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d.result); };
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

let bad = 0;
for (const w of WIDTHS) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
  for (const p of PAGES) {
    await send("Page.navigate", { url: `http://localhost:3000${p}` });
    await wait(3500);
    const r = await send("Runtime.evaluate", { expression: "document.documentElement.scrollWidth - innerWidth", returnByValue: true });
    const over = r.result.value;
    if (over > 0) { bad++; console.log(`OVERFLOW ${p} @ ${w}px: ${over}px`); }
  }
}
ws.close();
chrome.kill();
console.log(bad ? `${bad} overflow(s)` : "no horizontal overflow");
process.exit(bad ? 1 : 0);
