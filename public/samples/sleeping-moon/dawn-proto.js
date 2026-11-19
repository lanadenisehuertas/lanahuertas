/* The dawn ending (see dawn-proto.css). The letter is sent through formsubmit.co, as on the live site; the stars are
   the site's guestbook (/api/garden), drawn as stars and moons. */
(() => {
  const { $, $$ } = SM, end = $("#talk"), board = $("#talk .dawnboard"), letter = $("#talk .letter");
  if (!board || !letter) return;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const arrow = `<svg viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h23M18.5 1.5L24 7l-5.5 5.5"/></svg>`;
  const ext = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>`;
  const KINDS = { star: "A star", crescent: "A crescent moon", half: "A half moon", full: "A full moon" };
  // each colour a visitor picks, as it shows in the morning sky: deep enough to read on the dawn (3:1 and up), never red
  const COLS = { lilac: "#5b3fc4", gold: "#8a5d00", pink: "#a3367f", sky: "#1f5c9e", peach: "#96541a", mint: "#1d7651" };
  const NAMES = { lilac: "Lilac", gold: "Gold", pink: "Pink", sky: "Sky blue", peach: "Peach", mint: "Mint" };

  end.dataset.hint = "First light. Open for UI/UX, brand and motion work.";

  /* The address and its copy button leave the letter for the ground, where they share one line: the address first and
     the button right beside it, since the button only makes sense next to what it copies. Under that line the two
     profiles pair up on the left and the way back to the moon stands alone on the right. The sign-off leaves the ground
     altogether and goes to the very foot of the board, where it reads as a quiet colophon. The letter becomes the form. */
  const addr = $(".t-addr", letter), copy = $("#t-copy", letter), links = $(".t-links", board), top = $("#t-top", board), made = $(".t-made", board);
  const mail = Object.assign(document.createElement("p"), { className: "t-mail" });
  mail.append(addr, copy); links.before(mail);
  const pair = Object.assign(document.createElement("span"), { className: "t-pair" });
  pair.append(...$$("a:not(#t-top)", links));
  links.prepend(pair); links.append(top);
  letter.innerHTML = `
    <form class="write" novalidate aria-labelledby="w-h">
      <h2 class="t-big" id="w-h">Let's talk</h2>
      <div class="two"><label class="fld"><span class="lr"><span class="l">Name</span><span class="err" id="w-err-name"></span></span><input name="name" autocomplete="name" maxlength="80" required aria-describedby="w-err-name"></label>
      <label class="fld"><span class="lr"><span class="l">Email</span><span class="err" id="w-err-email"></span></span><input name="email" type="email" autocomplete="email" maxlength="120" required aria-describedby="w-err-email"></label></div>
      <label class="fld"><span class="lr"><span class="l">Message</span><span class="err" id="w-err-message"></span></span><textarea name="message" rows="2" maxlength="2000" required aria-describedby="w-err-message"></textarea></label>
      <input class="hp" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="send-row"><button class="btn" type="submit">Send ${arrow}</button></div>
      <p class="w-done" role="status"></p>
    </form>
    <form class="vs-make" hidden novalidate aria-label="Leave a star or a moon">
      <fieldset><legend>Star or moon</legend><div class="opts shapes"></div></fieldset>
      <fieldset><legend>Colour</legend><div class="opts swatches"></div></fieldset>
      <label class="fld"><span class="lr"><span class="l">Name</span><span class="err" id="s-err-name"></span></span><input name="name" maxlength="24" autocomplete="given-name" required aria-describedby="s-err-name"></label>
      <label class="fld"><span class="lr"><span class="l">Note (optional)</span><span class="more" id="s-more">90 left</span></span><input name="note" maxlength="90" aria-describedby="s-more"></label>
      <div class="row"><button class="btn" type="submit">Leave it</button><button class="btn quiet vs-cancel" type="button">Not now</button></div>
    </form>`;
  /* The stars come after the ground in the reading order (and in the phone's single column): first the letter, then the
     other ways to reach me, then the sky the visitors left. The sign-off closes the board after all of them. */
  $(".t-ground", board).insertAdjacentHTML("afterend", `
    <div class="ls">
      <h2 class="end-h" id="vs-h">The last stars</h2>
      <p class="end-line vs-line" aria-live="polite"><span class="vs-count">0</span> left by visitors</p>
      <button class="btn vs-open" type="button">Leave yours ${arrow}</button>
    </div>
    <div class="vs-skybox" role="group" aria-labelledby="vs-h">
      <div class="vs-sky l"></div><div class="vs-sky r"></div>
      <p class="vs-note" aria-hidden="true"><b></b><span></span></p>
    </div>`);
  board.append(made);

  /* ---------- the letter: a private message (the live site sends these through formsubmit.co) ---------- */
  const write = $(".write", end), done = $(".w-done", end);
  const field = (name) => write.elements[name];
  const RULES = {
    name: (v) => (v ? "" : "Add your name."),
    email: (v) => (!v ? "Add your email." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Not an email yet."),
    message: (v) => (v ? "" : "Add a message."),
  };
  const checkOne = (name) => {
    const el = field(name), msg = RULES[name](el.value.trim());
    $(`#w-err-${name}`).textContent = msg;
    msg ? el.setAttribute("aria-invalid", "true") : el.removeAttribute("aria-invalid");
    return !msg;
  };
  // checked when sent, then again as a flagged field is corrected. The message sits beside the label, so nothing moves
  Object.keys(RULES).forEach((n) => field(n).addEventListener("input", () => field(n).hasAttribute("aria-invalid") && checkOne(n)));
  const ENDPOINT = "https://formsubmit.co/ajax/lanadenisehuertas@gmail.com";
  write.addEventListener("input", () => { if (done.textContent) done.textContent = ""; });
  write.addEventListener("submit", async (e) => {
    e.preventDefault();
    const bad = Object.keys(RULES).filter((n) => !checkOne(n));
    if (bad.length) { field(bad[0]).focus(); return; }
    const b = $("[type=submit]", write);
    if (b.disabled) return;
    const name = field("name").value.trim(), email = field("email").value.trim(), message = field("message").value.trim();
    const thanks = () => { done.textContent = `Sent. Thank you, ${name.split(" ")[0]}. I'll write back to ${email} within a few days.`; write.reset(); };
    // a bot fills the field people never see: it is thanked, and nothing is sent
    if (field("_honey").value) { thanks(); return; }
    b.disabled = true; b.firstChild.textContent = "Sending "; done.textContent = "";
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST", signal: ctrl.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, message, _replyto: email, _subject: `Portfolio message from ${name}`, _template: "table", _captcha: "false" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) !== "true") throw new Error("not sent");
      thanks();
    } catch {
      // the message stays in the form, so nothing typed is lost
      done.textContent = "That didn't send. Try again, or write to lanadenisehuertas@gmail.com.";
    } finally {
      clearTimeout(timer); b.disabled = false; b.firstChild.textContent = "Send ";
    }
  });

  /* ---------- the last stars: two fields of sky, one each side of the envelope. A star's x runs 0 to 1 across both ---------- */
  const zones = $$(".vs-sky", end), note = $(".vs-note", end), make = $(".vs-make", end), line = $(".vs-line", end), openBtn = $(".vs-open", end), boxEl = $(".vs-skybox", end);
  const zoneOf = (x) => (x < 0.5 ? 0 : 1), local = (x) => (x - zoneOf(x) * 0.5) * 2;
  const sprite = (kind) => {
    const on = [], dim = [];
    for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) {
      const dx = x - 5, dy = y - 5, d = Math.hypot(dx, dy), disc = d <= 5.2;
      let lit = false, faint = false;
      if (kind === "star") lit = Math.abs(dx) + Math.abs(dy) <= 2 || (dx === 0 && Math.abs(dy) <= 5) || (dy === 0 && Math.abs(dx) <= 5);
      else if (kind === "full") lit = disc;
      else if (kind === "half") { lit = disc && dx <= 0; faint = disc && !lit && d > 4.2; }
      else { lit = disc && Math.hypot(dx - 3.2, dy + 0.6) > 4.6; faint = disc && !lit && d > 4.2; }
      if (lit) on.push([x, y]); else if (faint) dim.push([x, y]);
    }
    const d = (cells) => cells.map(([x, y]) => `M${x} ${y}h1v1h-1z`).join("");
    return `<svg class="sp" viewBox="0 0 11 11" shape-rendering="crispEdges" aria-hidden="true"><path d="${d(on)}"/>${dim.length ? `<path class="dim" d="${d(dim)}"/>` : ""}</svg>`;
  };
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const kinds = Object.keys(KINDS), cols = Object.keys(COLS);
  // the guestbook keeps flowers for the rest of the site; each star and colour here is stored as one of its flowers and
  // colours, and read back the same way
  const TO_KIND = { star: "daisy", crescent: "bell", half: "cosmos", full: "lotus" };
  const FROM_KIND = { daisy: "star", bell: "crescent", cosmos: "half", lotus: "full", tulip: "star", heart: "full" };
  const TO_COL = { lilac: "lilac", gold: "butter", pink: "pink", sky: "sky", peach: "peach", mint: "blush" };
  const FROM_COL = { lilac: "lilac", butter: "gold", pink: "pink", sky: "sky", peach: "peach", blush: "mint", cream: "gold" };
  // Lana's and Peanut's are always there; a visitor's star takes its place in the sky from its id, so it keeps it
  const list = [
    { name: "Lana", note: "Thank you for staying until morning.", kind: "full", color: "lilac", x: 0.3, y: 0.34, seed: true },
    { name: "Peanut", note: "meow (she says hi)", kind: "crescent", color: "peach", x: 0.38, y: 0.5, seed: true },
  ];
  const spot = (id) => {
    let h = 2166136261; for (const ch of String(id)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const a = (h >>> 0) / 4294967296, b = (Math.imul(h, 2654435761) >>> 0) / 4294967296;
    let x = 0.02 + a * 0.96, y = 0.04 + b * 0.92;
    for (let k = 0; k < 12 && list.some((v) => Math.hypot(v.x - x, (v.y - y) * 0.55) < 0.06); k++) { x = 0.02 + ((x + 0.37) % 0.96); y = 0.04 + ((y + 0.53) % 0.92); }
    return { x, y };
  };
  const starEl = (v) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "vs-star" + (v.seed ? " seed" : "") + (v.mine ? " mine" : "");
    b.setAttribute("aria-label", `${KINDS[v.kind]} from ${v.name}${v.note ? ": " + v.note : ""}`);
    b.style.cssText = `--x:${local(v.x).toFixed(4)};--y:${v.y};--c:${COLS[v.color]}`;
    b.innerHTML = sprite(v.kind); b._v = v;
    return b;
  };
  // how many visitors have left one, or an invitation while there are none yet
  const count = () => {
    const n = list.filter((v) => !v.seed).length, ln = $(".vs-line", end);
    if (ln && !end.classList.contains("making")) ln.innerHTML = n ? `<span class="vs-count">${n}</span> left by visitors` : "None from visitors yet. Leave the first.";
  };
  list.forEach((v) => zones[zoneOf(v.x)].append(starEl(v)));
  // the visitors' stars, from the guestbook; while it cannot be reached only Lana's and Peanut's are shown
  fetch("/api/garden", { headers: { Accept: "application/json" } }).then((r) => r.json()).then((d) => {
    if (!d || !d.live || !Array.isArray(d.flowers)) return;
    d.flowers.slice().reverse().forEach((f) => {
      if (!f || !f.name) return;
      const v = { name: String(f.name), note: String(f.note || ""), kind: FROM_KIND[f.kind] || "star", color: FROM_COL[f.color] || "lilac", ...spot(f.id || f.name + f.t) };
      list.push(v); zones[zoneOf(v.x)].append(starEl(v));
    });
    count();
  }).catch(() => {});

  let lit = null;
  const show = (b) => {
    if (lit) lit.classList.remove("on");
    lit = b; b.classList.add("on");
    const box = boxEl.getBoundingClientRect(), r = b.getBoundingClientRect();
    const x = r.left + r.width / 2 - box.left, y = r.top + r.height / 2 - box.top;
    $("b", note).textContent = b._v.name; $("span", note).textContent = b._v.note;
    const z = b.parentNode.getBoundingClientRect(), mid = r.left + r.width / 2, right = mid < z.left + z.width / 2;   // the note stays in its own field of sky
    note.style.maxWidth = `min(24ch, ${Math.round(Math.max(right ? z.right - mid - 22 : mid - z.left - 22, 120))}px)`;
    note.classList.toggle("left", !right);
    note.style.left = x + "px"; note.style.top = clamp(y, 40, box.height - 40) + "px";
    note.classList.add("on");
  };
  boxEl.addEventListener("pointerover", (e) => { const b = e.target.closest(".vs-star"); if (b && e.pointerType !== "touch") show(b); });
  boxEl.addEventListener("focusin", (e) => { const b = e.target.closest(".vs-star"); if (b) show(b); });
  boxEl.addEventListener("click", (e) => { const b = e.target.closest(".vs-star"); if (b) show(b); });

  /* the scroll brings them out in the order they were left, and turns their twinkle */
  let making = false;
  count();
  SM.scrub(() => {
    const r = board.getBoundingClientRect(), vh = innerHeight, q = SM.quiet();
    if (r.bottom < -vh || r.top > vh * 2) return;
    const p = q ? 2 : (vh * 0.9 - r.top) / (vh * 0.8), stars = $$(".vs-star", boxEl), n = stars.length;
    stars.forEach((s, i) => {
      const k = list.indexOf(s._v), o = clamp((p * 1.15 - (k / n) * 0.95) / 0.1);
      const tw = q || o < 1 ? 1 : 0.8 + 0.2 * Math.sin(scrollY / 70 + i * 1.7);
      s.style.setProperty("--o", (o * tw).toFixed(3));
    });
  });

  /* the maker: it is written on the letter, and the star is placed in the sky */
  const shapes = $(".shapes", make), swatches = $(".swatches", make);
  shapes.innerHTML = kinds.map((k, i) => `<label class="opt"><input type="radio" name="kind" value="${k}"${i === 0 ? " checked" : ""}><span class="vh">${KINDS[k]}</span>${sprite(k)}</label>`).join("");
  swatches.innerHTML = cols.map((c, i) => `<label class="opt sw" style="--c:${COLS[c]}"><input type="radio" name="color" value="${c}"${i === 0 ? " checked" : ""}><span class="vh">${NAMES[c]}</span><i></i></label>`).join("");
  const newEl = Object.assign(document.createElement("button"), { type: "button", className: "vs-new", hidden: true });
  zones[0].append(newEl);
  let pos = { x: 0.25, y: 0.5 };
  const pick = () => ({ kind: make.elements.kind.value, color: make.elements.color.value });
  const paint = () => {
    const { kind, color } = pick();
    make.style.setProperty("--pick", COLS[color]);
    newEl.style.setProperty("--c", COLS[color]); newEl.innerHTML = sprite(kind);
    newEl.setAttribute("aria-label", `Your ${KINDS[kind].toLowerCase().replace(/^a /, "")}. Use the arrow keys to move it.`);
  };
  const place = (x, y) => {
    pos = { x: clamp(x, 0.01, 0.99), y: clamp(y, 0.03, 0.97) };
    const z = zones[zoneOf(pos.x)], r = z.getBoundingClientRect(), had = document.activeElement === newEl;
    if (newEl.parentNode !== z) { z.append(newEl); if (had) newEl.focus({ preventScroll: true }); }
    newEl.style.transform = `translate3d(${(local(pos.x) * r.width).toFixed(1)}px, ${(pos.y * r.height).toFixed(1)}px, 0)`;
  };
  make.addEventListener("change", paint);
  const open = () => {
    // on a phone the letter is far above the sky, so the maker opens under the words instead
    if (SM.COLUMN.matches) $(".ls", end).append(make); else { letter.append(make); write.hidden = true; }
    making = true; openedAt = performance.now(); end.classList.add("making"); openBtn.hidden = true; make.hidden = false; newEl.hidden = false;
    line.textContent = SM.COLUMN.matches ? "Tap the sky to place it." : "Click the sky to place it.";
    note.classList.remove("on"); paint();
    let best = null, far = -1;   // start it somewhere free: the emptiest of a few tries
    for (let k = 0; k < 24; k++) {
      const x = 0.04 + rnd() * 0.92, y = 0.12 + rnd() * 0.76, d = Math.min(...list.map((v) => Math.hypot(v.x - x, v.y - y)));
      if (d > far) { far = d; best = { x, y }; }
    }
    place(best.x, best.y);
    $("input", shapes).focus({ preventScroll: true });
  };
  let openedAt = 0;
  const close = (keep) => { making = false; end.classList.remove("making"); openBtn.hidden = false; make.hidden = true; newEl.hidden = true; write.hidden = false; if (!keep) count(); openBtn.focus({ preventScroll: true }); };
  openBtn.addEventListener("click", open);
  $(".vs-cancel", make).addEventListener("click", () => close());
  make.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  zones.forEach((z, k) => z.addEventListener("pointerdown", (e) => {
    if (!making || e.target.closest(".vs-star")) return;
    const r = z.getBoundingClientRect();
    place(k * 0.5 + clamp((e.clientX - r.left) / r.width, 0.02, 0.98) * 0.5, (e.clientY - r.top) / r.height);
  }));
  newEl.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return close();
    const s = e.shiftKey ? 0.06 : 0.02, m = { ArrowLeft: [-s / 2, 0], ArrowRight: [s / 2, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
    if (m) { e.preventDefault(); place(pos.x + m[0], pos.y + m[1]); }
  });
  addEventListener("resize", () => making && place(pos.x, pos.y));
  const nameIn = make.elements.name, noteIn = make.elements.note, more = $("#s-more");
  noteIn.addEventListener("input", () => { more.textContent = `${90 - noteIn.value.length} left`; });
  nameIn.addEventListener("input", () => { if (nameIn.value.trim()) { $("#s-err-name").textContent = ""; nameIn.removeAttribute("aria-invalid"); } });
  make.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameIn.value.trim();
    if (!name) { $("#s-err-name").textContent = "Add your name."; nameIn.setAttribute("aria-invalid", "true"); nameIn.focus(); return; }
    const sub = $("[type=submit]", make);
    if (sub.disabled) return;
    sub.disabled = true; sub.textContent = "Leaving it"; $("#s-err-name").textContent = "";
    const picked = pick(), note = noteIn.value.trim();
    fetch("/api/garden", {
      method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, note, kind: TO_KIND[picked.kind], color: TO_COL[picked.color], website: "", elapsed: Math.round(performance.now() - openedAt) }),
    }).then(async (r) => {
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) {
        $("#s-err-name").textContent = d.error && d.error !== "offline" ? d.error : "The sky couldn't be reached. Try again in a bit.";
        if (d.field === "name") { nameIn.setAttribute("aria-invalid", "true"); nameIn.focus(); }
        return;
      }
      const v = { name, note, ...picked, ...pos, mine: true };
      list.push(v); const b = starEl(v); b.style.setProperty("--o", 1); zones[zoneOf(v.x)].insertBefore(b, null);
      make.reset(); more.textContent = "90 left";
      close(true); count();
      line.textContent = d.status === "pending" ? "Thank you! Yours goes up for everyone once it has been read." : "Yours is up. Thank you!";
      openBtn.firstChild.textContent = "Leave another ";
      show(b);
      document.dispatchEvent(new CustomEvent("sm:burst", { detail: b }));
    }).catch(() => { $("#s-err-name").textContent = "The sky couldn't be reached. Try again in a bit."; })
      .finally(() => { sub.disabled = false; sub.textContent = "Leave it"; });
  });
})();
