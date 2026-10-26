// Screenshots each slide of the carousel inside a section.
// Usage: node scripts/shoot-slides.mjs <sectionId> <outPrefix> [width] [height]
// Needs Chrome; talks to it over the DevTools protocol.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const [section = "branding", prefix = ".codex-scratch/slide", W = "1440", H = "900"] = process.argv.slice(2);
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${W},${H}`,
  "--remote-debugging-port=9333", `--user-data-dir=${process.cwd()}/.codex-scratch/chrome`, "about:blank",
]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let page;
for (let t = 0; !page && t < 120; t++) {
  await wait(500);
  page = await fetch("http://127.0.0.1:9333/json").then((r) => r.json()).then((l) => l.find((p) => p.type === "page")).catch(() => undefined);
}
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d.result); };
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
const run = (expression) => send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });

await send("Page.enable");
await send("Page.navigate", { url: "http://localhost:3000/" });
await wait(5000);
await run(`document.getElementById(${JSON.stringify(section)}).querySelector('.carousel-track').scrollIntoView({block:'start'})`);
const n = (await run(`document.getElementById(${JSON.stringify(section)}).querySelectorAll('.carousel-slide').length`)).result.value;
for (let i = 0; i < n; i++) {
  await run(`(()=>{const t=document.getElementById(${JSON.stringify(section)}).querySelector('.carousel-track');t.scrollTo({left:t.children[${i}].offsetLeft,behavior:'auto'});})()`);
  await wait(1600);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${prefix}-${String(i + 1).padStart(2, "0")}.png`, Buffer.from(shot.data, "base64"));
}
ws.close();
chrome.kill();
console.log(`${n} slides`);
