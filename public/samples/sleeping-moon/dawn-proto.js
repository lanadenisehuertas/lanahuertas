/* The dawn ending (see dawn-proto.css). The letter is sent through formsubmit.co, as on the live site; the stars are
   the site's guestbook (/api/garden), drawn as stars and moons. The sun that comes up behind the envelope and the
   hills the six stand on are drawn here too, in square cells, and both follow the scroll. */
(() => {
  const { $, $$ } = SM, end = $("#talk"), board = $("#talk .dawnboard"), letter = $("#talk .letter");
  if (!board || !letter) return;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const arrow = `<svg viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h23M18.5 1.5L24 7l-5.5 5.5"/></svg>`;
  const KINDS = { star: "A star", crescent: "A crescent moon", half: "A half moon", full: "A full moon" };
  // each colour a visitor picks, as it shows in the morning sky: deep enough to read on the dawn (3:1 and up), never red
  const COLS = { lilac: "#5b3fc4", gold: "#8a5d00", pink: "#a3367f", sky: "#1f5c9e", peach: "#96541a", mint: "#1d7651" };
  const NAMES = { lilac: "Lilac", gold: "Gold", pink: "Pink", sky: "Sky blue", peach: "Peach", mint: "Mint" };

  // the ending says nothing in the foot: the scene speaks for itself, and the foot line stays empty
  end.dataset.hint = "";

  /* The letter is the form. It opens the way a letter does, to the one it is written to, and its fields are the
     letter's lines. */
  letter.innerHTML = `
    <form class="write" novalidate aria-label="A letter to Lana">
      <p class="t-dear">Dear Lana,</p>
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
      <label class="fld"><span class="lr"><span class="l">Name</span><span class="err" id="s-err-name" aria-live="polite"></span></span><input name="name" maxlength="24" autocomplete="given-name" required aria-describedby="s-err-name"></label>
      <label class="fld"><span class="lr"><span class="l">Note (optional)</span><span class="err" id="s-err-note" aria-live="polite"></span><span class="more" id="s-more">90 left</span></span><input name="note" maxlength="90" aria-describedby="s-err-note s-more"></label>
      <div class="row"><button class="btn" type="submit">Leave it</button><button class="btn quiet vs-cancel" type="button">Not now</button></div>
    </form>`;
  /* The stars come after the letter in the reading order: first the words and the address, then the letter, then the
     sky the visitors left, then the horizon with the six and the way back. On wide screens the sky is the upper right
     of the scene with its words under it; in the phone's single column the words come first and the sky under them. */
  $(".env", board).insertAdjacentHTML("afterend", `
    <div class="ls">
      <h2 class="end-h" id="vs-h">The last stars</h2>
      <p class="end-line vs-line" aria-live="polite">Only Lana's and Peanut's so far.</p>
      <button class="btn vs-open" type="button">Leave yours ${arrow}</button>
    </div>
    <div class="vs-skybox" role="group" aria-labelledby="vs-h">
      <div class="vs-sky l"></div><div class="vs-sky r"></div>
      <p class="vs-note" aria-hidden="true"><b></b><span></span></p>
    </div>`);

  /* ---------- the letter: a private message (the live site sends these through formsubmit.co) ---------- */
  const write = $(".write", end), done = $(".w-done", end);
  // the answer to a letter is written on the envelope's front, under its flap: anything under Send on the letter
  // itself would sit inside the pocket, out of sight
  $(".env-front", board).after(done);
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

  /* The message grows with what is written, from its height at rest (three lines, two on the smallest envelopes,
     dawn-proto.css) as far as the letter has room, and then it scrolls. On wide screens the letter stands in the
     envelope, so its room is first what is left above the front edge of the pocket, and then what the letter can
     still rise out of the envelope before it meets the masthead (--lift, stops.css). In the phone's column the letter
     is as tall as what is on it, so the message grows to eight lines. Its height is worked out only as the visitor
     writes, at a resize, and when the letter is sent, never in a scrub. */
  const msg = field("message"), sendB = $("[type=submit]", write), envEl = $(".env", board), mast = $(".mast");
  let room = null, liftAt = 0;
  const roomOf = () => {
    msg.style.height = "";
    const cs = getComputedStyle(msg), L = parseFloat(cs.lineHeight) || 24, rest = msg.offsetHeight, frame = rest - msg.clientHeight;
    const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const r = { gen: SM.placedGen, vw: SM.vw, rest, frame, flat: Infinity, max: Math.max(rest, Math.round(8 * L + pad + frame)) };
    if (SM.COLUMN.matches) return r;
    // in the envelope's own measure: the risen letter's top, and how far the message's line and Send can each come
    // down before the pocket's front edge covers them (the edge falls from three quarters of the envelope's width at
    // its middle, about 0.633 of a pixel for every pixel out to the side, so the line is covered first at its ends)
    const w = envEl.clientWidth, top = letter.offsetTop - 0.7 * w, edge = (half) => 0.75 * w - 0.633 * half;
    const send = edge(sendB.offsetWidth / 2) - 6 - (top + sendB.offsetTop + sendB.offsetHeight / 2 + 14);
    const line = edge(w / 2 - letter.offsetLeft - msg.offsetLeft) - 4 - (top + msg.offsetTop + rest);
    const rise = Math.max(0, envEl.offsetTop + top - (mast ? mast.getBoundingClientRect().bottom : 48) - 10);
    r.flat = rest + Math.max(0, Math.min(send, line));
    r.max = Math.max(rest, Math.min(r.max, Math.round(r.flat + rise)));
    return r;
  };
  const fit = () => {
    // the field's line holds its place while the field is measured, so the page under it never jumps
    const fl = msg.parentElement; fl.style.minHeight = fl.offsetHeight + "px";
    if (!room || room.gen !== SM.placedGen || room.vw !== SM.vw) room = roomOf();
    let h = room.rest, need = 0;
    if (msg.value) { msg.style.height = "0px"; need = msg.scrollHeight + room.frame; h = Math.min(room.max, Math.max(room.rest, need)); }
    msg.style.height = msg.value ? `${h}px` : "";
    msg.classList.toggle("over", need > h + 1 && msg.scrollTop > 2);
    fl.style.minHeight = "";
    const lift = Math.max(0, Math.round(h - room.flat));
    if (lift !== liftAt) { liftAt = lift; letter.style.setProperty("--lift", `${lift}px`); }
  };
  msg.addEventListener("input", fit);
  // the top edge fades only while lines are scrolled away above it
  msg.addEventListener("scroll", () => msg.classList.toggle("over", msg.scrollTop > 2), { passive: true });
  write.addEventListener("reset", () => requestAnimationFrame(fit));
  let fitFrame = 0;
  addEventListener("resize", () => { room = null; if ((msg.value || liftAt) && !fitFrame) fitFrame = requestAnimationFrame(() => { fitFrame = 0; fit(); }); });

  /* ---------- the last stars: two fields of sky, side by side. A star's x runs 0 to 1 across both ---------- */
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
  // the moths fly over corners of the sky (see the moths below), so no star is put there: on wide screens the top
  // left corner, in the phone's column the two lower corners
  const mothOver = (x, y) => (SM.COLUMN.matches ? (x < 0.22 || x > 0.78) && y > 0.75 : x < 0.12 && y < 0.34);
  const spot = (id) => {
    let h = 2166136261; for (const ch of String(id)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const a = (h >>> 0) / 4294967296, b = (Math.imul(h, 2654435761) >>> 0) / 4294967296;
    let x = 0.02 + a * 0.96, y = 0.04 + b * 0.92;
    for (let k = 0; k < 12 && (mothOver(x, y) || list.some((v) => Math.hypot(v.x - x, (v.y - y) * 0.55) < 0.06)); k++) { x = 0.02 + ((x + 0.37) % 0.96); y = 0.04 + ((y + 0.53) % 0.92); }
    return { x, y };
  };
  const starEl = (v) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "vs-star" + (v.seed ? " seed" : "") + (v.mine ? " mine" : "");
    b.setAttribute("aria-label", `${KINDS[v.kind]} from ${v.name}${v.note ? ": " + v.note : ""}`);
    b.style.cssText = `--x:${local(v.x).toFixed(4)};--y:${v.y};--c:${COLS[v.color]}`;
    // the star drifts on a plain box around its picture: the browser hands a box's drift to the compositor, but not
    // an svg's, which would otherwise be restyled every frame
    b.innerHTML = `<span class="sp-w">${sprite(v.kind)}</span>`; b._v = v;
    return b;
  };
  // how many visitors have left one. Lana's and Peanut's are always in the sky, so the line never says the sky is empty;
  // while no visitor has left one it says whose the two are (the button under it already asks for yours)
  const count = () => {
    const n = list.filter((v) => !v.seed).length, ln = $(".vs-line", end);
    if (ln && !end.classList.contains("making")) ln.innerHTML = !n ? "Only Lana's and Peanut's so far."
      : `<span class="vs-count">${n}</span> left by ${n === 1 ? "a visitor" : "visitors"}, with Lana's and Peanut's.`;
  };
  list.forEach((v) => zones[zoneOf(v.x)].append(starEl(v)));
  // the night's own stars, small and pale, are still out among them, and fade as the sun comes up (the scrub below
  // turns --night down); they are only sky, so a click passes through them to the field
  zones.forEach((z, k) => {
    let h = 7 + k * 31;
    const r = () => ((h = Math.imul(h ^ (h >>> 15), 2246822519) + 0x9e3779b9 | 0) >>> 0) / 4294967296;
    for (let n = 0; n < 9; n++) z.insertAdjacentHTML("afterbegin", `<i class="vs-dust${n % 3 ? "" : " big"}" style="left:${(4 + r() * 92).toFixed(1)}%;top:${(4 + r() * 92).toFixed(1)}%"></i>`);
  });
  // the visitors' stars, from the guestbook; while it cannot be reached only Lana's and Peanut's are shown
  fetch("/api/garden", { headers: { Accept: "application/json" } }).then((r) => r.json()).then((d) => {
    if (!d || !d.live || !Array.isArray(d.flowers)) return;
    d.flowers.slice().reverse().forEach((f) => {
      // the guestbook sends Lana's and Peanut's along with the visitors' (their ids start "seed-"); they are already
      // in the sky above, so they are left out here and never counted as a visitor's
      if (!f || !f.name || String(f.id || "").startsWith("seed-")) return;
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
    // the note stays in the sky: it opens towards whichever side of the two fields has more room
    const z0 = zones[0].getBoundingClientRect(), z1 = zones[1].getBoundingClientRect();
    const zl = Math.min(z0.left, z1.left), zr = Math.max(z0.right, z1.right), mid = r.left + r.width / 2, right = mid < (zl + zr) / 2;
    note.style.maxWidth = `min(24ch, ${Math.round(Math.max(right ? zr - mid - 22 : mid - zl - 22, 120))}px)`;
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
  // the sky's place in the page is measured once and again only when the page changes size (SM.placedGen), so the
  // scrub reads no layout each frame
  const skyAt = () => {
    if (boxEl._gen !== SM.placedGen || boxEl._w !== SM.vw) {
      const b = zones[0].getBoundingClientRect();
      boxEl._gen = SM.placedGen; boxEl._w = SM.vw; boxEl._top = b.top + SM.y;
    }
    return boxEl._top - SM.y;
  };
  SM.scrub(() => {
    const top = skyAt(), vh = SM.vh, q = SM.quiet();
    if (top > vh * 2 || top < -vh * 2) return;
    // they come out as their field of sky rises from the foot of the window to its upper half
    const p = q ? 2 : (vh * 0.95 - top) / (vh * 0.6), stars = $$(".vs-star", boxEl), n = stars.length;
    stars.forEach((s, i) => {
      const k = list.indexOf(s._v), o = clamp((p * 1.15 - (k / n) * 0.95) / 0.1);
      const tw = q || o < 1 ? 1 : 0.8 + 0.2 * Math.sin(SM.y / 70 + i * 1.7);
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
    // on a phone the letter is far from the sky, so the maker opens under the words instead
    if (SM.COLUMN.matches) $(".ls", end).append(make); else { letter.append(make); write.hidden = true; }
    making = true; openedAt = performance.now(); end.classList.add("making"); openBtn.hidden = true; make.hidden = false; newEl.hidden = false;
    line.textContent = SM.COLUMN.matches ? "Tap the sky to place it." : "Click the sky to place it.";
    note.classList.remove("on"); paint();
    let best = null, far = -1;   // start it somewhere free: the emptiest of a few tries
    for (let k = 0; k < 24; k++) {
      const x = 0.04 + rnd() * 0.92, y = 0.12 + rnd() * 0.76, d = Math.min(...list.map((v) => Math.hypot(v.x - x, v.y - y)));
      if (d > far && !mothOver(x, y)) { far = d; best = { x, y }; }
    }
    place(best.x, best.y);
    $("input", shapes).focus({ preventScroll: true });
  };
  let openedAt = 0;
  const close = (keep) => { making = false; end.classList.remove("making"); fixed(nameIn, errName); fixed(noteIn, errNote); openBtn.hidden = false; make.hidden = true; newEl.hidden = true; write.hidden = false; if (!keep) count(); openBtn.focus({ preventScroll: true }); };
  openBtn.addEventListener("click", open);
  $(".vs-cancel", make).addEventListener("click", () => close());
  // Escape puts the maker away wherever the focus is: a click on the sky leaves it on the page itself, outside the
  // maker, and it must still close then
  addEventListener("keydown", (e) => { if (e.key === "Escape" && making && !e.defaultPrevented) { e.preventDefault(); close(); } });
  zones.forEach((z, k) => z.addEventListener("pointerdown", (e) => {
    if (!making || e.target.closest(".vs-star")) return;
    const r = z.getBoundingClientRect();
    place(k * 0.5 + clamp((e.clientX - r.left) / r.width, 0.02, 0.98) * 0.5, (e.clientY - r.top) / r.height);
    // the focus goes to the star just placed, so the arrow keys can still nudge it and Tab goes on to the maker
    requestAnimationFrame(() => newEl.focus({ preventScroll: true }));
  }));
  newEl.addEventListener("keydown", (e) => {
    const s = e.shiftKey ? 0.06 : 0.02, m = { ArrowLeft: [-s / 2, 0], ArrowRight: [s / 2, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
    if (m) { e.preventDefault(); place(pos.x + m[0], pos.y + m[1]); }
  });
  addEventListener("resize", () => making && place(pos.x, pos.y));
  const nameIn = make.elements.name, noteIn = make.elements.note, more = $("#s-more");
  noteIn.addEventListener("input", () => { more.textContent = `${90 - noteIn.value.length} left`; });
  const errName = $("#s-err-name"), errNote = $("#s-err-note");
  const fixed = (inp, err) => { if (err.textContent) { err.textContent = ""; inp.removeAttribute("aria-invalid"); } };
  nameIn.addEventListener("input", () => nameIn.value.trim() && fixed(nameIn, errName));
  noteIn.addEventListener("input", () => fixed(noteIn, errNote));
  // the guestbook is shared with the garden, so its answers speak of flowers and planting; here they are said in
  // the sky's words
  const FAIL = "The sky couldn't be reached. Try again in a bit.";
  const skyWords = (m) => (/couldn't be reached|^offline$/.test(m) ? FAIL : m.replace(/can't be planted/g, "can't go in the sky")
    .replace(/\bplanted\b/g, "left").replace(/\bplant\b/g, "leave").replace(/\bflowers\b/g, "stars").replace(/\bflower\b/g, "star").replace(/\bgarden\b/g, "sky"));
  make.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameIn.value.trim();
    if (!name) { errName.textContent = "Add your name."; nameIn.setAttribute("aria-invalid", "true"); nameIn.focus(); return; }
    const sub = $("[type=submit]", make);
    if (sub.disabled) return;
    sub.disabled = true; sub.textContent = "Leaving it"; errName.textContent = ""; errNote.textContent = "";
    const picked = pick(), note = noteIn.value.trim();
    // a request that hangs is given up after fifteen seconds, so the button never stays on "Leaving it"
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 15000);
    fetch("/api/garden", {
      method: "POST", signal: ctrl.signal, headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ name, note, kind: TO_KIND[picked.kind], color: TO_COL[picked.color], website: "", elapsed: Math.round(performance.now() - openedAt) }),
    }).then(async (r) => {
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) {
        // the answer is said beside the field it is about (the name when it is about neither), and read out
        const onNote = d.field === "note", inp = onNote ? noteIn : nameIn;
        (onNote ? errNote : errName).textContent = d.error ? skyWords(String(d.error)) : FAIL;
        if (d.field) { inp.setAttribute("aria-invalid", "true"); inp.focus(); }
        return;
      }
      const v = { name, note, ...picked, ...pos, mine: true };
      list.push(v); const b = starEl(v); b.style.setProperty("--o", 1); zones[zoneOf(v.x)].insertBefore(b, null);
      make.reset(); more.textContent = "90 left";
      close(true); count();
      line.textContent = d.status === "pending" ? "Thank you. Yours shows for everyone once Lana has read it." : "Yours is up. Thank you.";
      openBtn.firstChild.textContent = "Leave another ";
      show(b);
      document.dispatchEvent(new CustomEvent("sm:burst", { detail: b }));
    }).catch(() => { errName.textContent = FAIL; })
      .finally(() => { clearTimeout(timer); sub.disabled = false; sub.textContent = "Leave it"; });
  });

  /* ---------- first light: the sun comes up behind the envelope, over a horizon of square cells ----------
     Both are tiny pictures, one pixel a cell, that CSS scales up unsmoothed (dawn-proto.css), so every edge stays a
     hard square. The hills are a valley: low in the middle, where the sun comes up behind the envelope, and rising
     to each side, and each of the six stands on its own step of them, a little higher the further out it is, so the
     six make a shallow arc around the sun. The scroll raises the sun a cell at a time, and brings the six down onto
     their steps, the inner ones first; scrolling back sets the sun again. */
  const dawn = $(".t-dawn", board), env = $(".env", board);
  if (!dawn) return;
  const sunC = $(".t-sun", dawn), hillC = $(".t-hills", dawn), sixAs = $$(".t-six a", dawn);
  /* the moths and the lilies of the night come back at dawn, line drawings asleep in 1-bit like the night's corners:
     a moth over each of the sun's shoulders, drawn up towards it as it rises, and a lily standing on each side of the
     scene, in the near field on wide screens and on the hills either side of the sun in the column. They are only
     ornament: nothing reads them out, and a click passes through them */
  const orn = (k, src, w, h) => `<span class="pic orn t-${k}" data-kind="line" data-still aria-hidden="true"><img class="full" src="art/${src}" width="${w}" height="${h}" alt="" loading="lazy"></span>`;
  dawn.insertAdjacentHTML("beforeend", [["moth l", "e_moth.webp", 744, 396], ["moth r", "e_moth.webp", 744, 396], ["lily l", "e_lily.webp", 457, 904], ["lily r", "e_lily.webp", 457, 904]].map((a) => orn(...a)).join(""));
  SM.pictures(dawn);
  const moths = $$(".t-moth", dawn), lilies = $$(".t-lily", dawn);
  const SUN = "#ffcf73", SUN_PALE = "#ffe3a6", HILL = "#bfa3da", HILL_FAR = "#d3bde8", FIELD = "#b99dd7", FIELD_NEAR = "#b398d3";
  // what the layout needs, read in the page's own read pass (SM.measure) and only when the page has changed size;
  // the scrub then draws and places from it, so it never reads layout itself
  let geo = null, drawn = null;
  const read = () => {
    const col = SM.COLUMN.matches, u = SM.u(), W = dawn.clientWidth, H = dawn.clientHeight;
    if (!W || !H) return null;
    const cell = col ? 4 : Math.max(6, Math.round(u * 0.6));
    const six = sixAs.map((a) => ({ w: a.offsetWidth, h: a.offsetHeight })), sixH = Math.max(...six.map((d) => d.h));
    // the horizon: on wide screens a little above the foot of the envelope's body, which stands in front of it (the
    // lavender in the last eighth of the picture lies on the ground); in the column high enough above the foot of the
    // horizon's box for the six to stand on the ground in front of it. A whole number of cells down, so the hills and
    // the sun share one grid
    const floor = Math.round((col ? H - sixH - 12 * cell : env.offsetTop + env.offsetHeight * 0.84 - dawn.offsetTop) / cell) * cell;
    const envW = env.offsetWidth, envTop = env.offsetTop - dawn.offsetTop;
    const size = (el) => ({ w: el.offsetWidth, h: el.offsetHeight }), mothS = size(moths[0]), lilyS = size(lilies[0]);
    const r = dawn.getBoundingClientRect();
    // where the horizon's box stands in the window once the page is scrolled to its end
    const last = r.top + SM.y - Math.max(0, document.documentElement.scrollHeight - innerHeight);
    return { col, u, W, H, cell, floor, envW, envTop, mothS, lilyS, six, top: r.top + SM.y, last, gen: SM.placedGen, vw: SM.vw };
  };
  SM.measure(() => { if (!geo || geo.gen !== SM.placedGen || geo.vw !== SM.vw) geo = read() || geo; });

  // lays the scene out from what was read: the sun, the hills, and the six on them
  const lay = (g) => {
    const { col, u, W, H, cell, floor } = g;
    /* the sun. On wide screens its disc is much wider than the envelope, so it shows as two bright shoulders either
       side of it, ringed by a paler band; in the column it is small and whole, and has rays */
    const R = Math.max(10, Math.round((col ? Math.min(W * 0.2, 104) : g.envW * 0.86) / cell)), r0 = R + 2, r1 = col ? R + 3 + Math.round(R * 0.3) : R + 3;
    const sw = 2 * r1 + 1, sh = r1 + 1, s = sunC.getContext("2d");
    sunC.width = sw; sunC.height = sh;
    for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
      const dx = x - r1, dy = r1 - y, d2 = dx * dx + dy * dy;
      if (d2 <= R * R) { s.fillStyle = SUN; s.fillRect(x, y, 1, 1); }
      else if (!col && d2 > (r0 - 0.5) ** 2 && d2 <= (r1 + 0.5) ** 2) { s.fillStyle = SUN_PALE; s.fillRect(x, y, 1, 1); }
    }
    // in the column, thirteen rays, every fifteen degrees across the upper half; the ones between are a little shorter
    if (col) {
      s.fillStyle = SUN;
      for (let k = 0; k <= 12; k++) {
        const a = (k / 12) * Math.PI, end = k % 2 ? r1 - Math.round(R * 0.12) : r1;
        for (let t = r0 + 1; t <= end; t++) s.fillRect(r1 + Math.round(t * Math.cos(a)), r1 - Math.round(t * Math.sin(a)), 1, 1);
      }
    }
    Object.assign(sunC.style, { width: `${sw * cell}px`, height: `${sh * cell}px`, left: `${Math.round(W / 2 - (sw * cell) / 2)}px`, top: `${floor - (sh - 1) * cell}px` });

    /* the six. On wide screens, three each side of the sun, from the middle outwards; in the column, one row spread
       evenly along the ground in front of the hills, under the sun */
    const ws = g.six.map((d) => d.w), xs = [];
    if (col) {
      const edge = 12, room = W - 2 * edge, sum = ws.reduce((a, b) => a + b, 0), gap = Math.max(2, Math.min(32, (room - sum) / 5));
      let x = edge + Math.max(0, (room - sum - 5 * gap) / 2);
      ws.forEach((w, i) => { xs[i] = x; x += w + gap; });
    } else {
      const gap = 2.2 * u, inner = g.envW / 2 + 2.6 * u;
      let x = W / 2 - inner;
      for (const i of [2, 1, 0]) { x -= ws[i]; xs[i] = x; x -= gap; }
      x = W / 2 + inner;
      for (const i of [3, 4, 5]) { xs[i] = x; x += ws[i] + gap; }
    }
    // the hills: how high (in cells) the ground stands at a distance from the middle. Flat across the valley, then
    // rising to each side with a slow swell in it. On wide screens the valley is only as wide as the envelope: the
    // hills start just behind its sides, three cells up, and hide the sun's lower edge there; in the column the
    // valley is as wide as the sun, so the whole of it shows
    const cols = Math.ceil(W / cell) + 6, rows = Math.ceil(H / cell) + 1, left = Math.round(W / 2 - (cols * cell) / 2);
    const flat = col ? (R + 1) * cell : g.envW / 2 - 3 * cell, base = col ? 1 : 3, top = col ? 6 : 8;
    const rise = (px) => {
      const d = Math.abs(px - W / 2), t = clamp((d - flat) / Math.max(1, W / 2 - flat));
      return t <= 0 ? 0 : Math.max(1, Math.round(base + (top - base) * (1 - Math.pow(1 - t, 1.6)) + 0.7 * Math.sin(px / (cell * 5.3))));
    };
    // on wide screens each of the six stands on a step of its own, as high as the ground under its middle (never lower
    // than its inner neighbour), a cell wider than itself each side; in the column they all stand on the near ground
    const steps = col ? [] : xs.map((x0, i) => ({ a: x0 - cell, b: x0 + ws[i] + cell, h: rise(x0 + ws[i] / 2) }));
    if (!col) [[2, 1, 0], [3, 4, 5]].forEach((side) => side.reduce((low, i) => { steps[i].h = Math.max(steps[i].h, low + 1); return steps[i].h; }, 0));
    const hc = hillC.getContext("2d");
    hillC.width = cols; hillC.height = rows;
    const floorRow = Math.round(floor / cell);
    const loose = (k, r) => { let h = (k * 374761393 + r * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };
    for (let k = 0; k < cols; k++) {
      const px = left + (k + 0.5) * cell, st = steps.find((p) => px >= p.a && px < p.b);
      const h = st ? st.h : rise(px);
      // a far ridge behind, in a paler lilac, a few cells over the near ground where the hills rise
      const far = h > 0 ? h + 2 + Math.round(1.2 + Math.sin(px / (cell * 9.1) + 1.3)) : 0;
      if (far > h) { hc.fillStyle = HILL_FAR; hc.fillRect(k, floorRow - far, 1, far - h); }
      hc.fillStyle = HILL;
      hc.fillRect(k, floorRow - h, 1, rows - floorRow + h);
      if (!st && h > 1 && loose(k, 3) < 0.14) hc.fillRect(k, floorRow - h - 1, 1, 1);
      // on wide screens the ground in front lies in two broad fields, each a shade deeper than the one behind it,
      // their edges stepped a cell up and down
      if (!col) [[7, FIELD], [17, FIELD_NEAR]].forEach(([d, c], j) => {
        const e = floorRow + d + Math.round(Math.sin(k / (6 + j * 4) + j * 2.1));
        if (e < rows) { hc.fillStyle = c; hc.fillRect(k, e, 1, rows - e); }
      });
    }
    Object.assign(hillC.style, { width: `${cols * cell}px`, height: `${rows * cell}px`, left: `${left}px`, top: "0px" });
    sixAs.forEach((a, i) => {
      a.style.left = `${Math.round(xs[i])}px`;
      a.style.top = `${col ? H - 4 * cell - g.six[i].h : floorRow * cell - steps[i].h * cell - g.six[i].h}px`;
    });
    /* the lilies: on wide screens in the near field, under the outer two of each three, their stems a few cells into
       the ground; in the column on the hills beyond the tips of the sun's rays, rooted a cell into the slope */
    const { mothS, lilyS } = g, put = (el, x, y) => { el.style.left = `${Math.round(x)}px`; el.style.top = `${Math.round(y)}px`; };
    lilies.forEach((el, k) => {
      const s = k ? 1 : -1;
      if (col) {
        const cx = W / 2 + s * Math.max(r1 * cell + lilyS.w * 0.75, W / 2 - 12 - lilyS.w / 2);
        put(el, cx - lilyS.w / 2, (floorRow - rise(cx) + 1) * cell - lilyS.h);
      } else {
        const cx = W / 2 + s * (g.envW / 2 + 9.5 * u);
        put(el, cx - lilyS.w / 2, Math.min(H - 2 * cell, (floorRow + 21) * cell) - lilyS.h);
      }
    });
    /* the moths: on wide screens one in the gap between the words and the letter, over the sun's left shoulder, and
       one high beside the letter's right edge, at the corner of the sky (where no visitor's star is put); in the column
       one over each lily. Where each one settles once the sun is up; the scrub brings them there */
    const mothAt = moths.map((el, k) => {
      const s = k ? 1 : -1;
      if (col) {
        const cx = W / 2 + s * (W / 2 - 12 - mothS.w / 2 - 10);
        return { x: cx - mothS.w / 2, y: (floorRow - rise(cx)) * cell - lilyS.h - mothS.h - 14 };
      }
      return k ? { x: W / 2 + g.envW / 2 + 1.2 * u, y: g.envTop - 0.22 * g.envW } : { x: W / 2 - g.envW / 2 - 2.4 * u - mothS.w, y: g.envTop - 0.02 * g.envW };
    });
    moths.forEach((el, k) => put(el, mothAt[k].x, mothAt[k].y));
    return { sh, cell, order: col ? [0, 1, 2, 3, 4, 5] : [2, 3, 1, 4, 0, 5] };
  };
  let sunAt = -1, sixAt = [], mothsAt = "";
  SM.scrub(() => {
    if (!geo) return;
    if (drawn?.g !== geo) { drawn = { g: geo, ...lay(geo) }; sunAt = -1; sixAt = []; }
    const top = geo.top - SM.y, vh = SM.vh, q = SM.quiet();
    if (top > vh * 1.5 || top + geo.H < -vh) return;
    // how far up the sun is, 0 to 1: as the scene arrives on wide screens (its horizon is near the window's foot), and
    // as the horizon itself comes up the window in the column
    const w = SM.where(end);
    // (over about seven tenths of a screen of scroll on wide screens; in the column from the horizon's box a third of a
    // screen under the window to the page's end, at least six tenths of a screen, so the sun is whole at the end)
    const v = q ? 1 : SM.smooth(geo.col ? clamp((vh * 1.35 - top) / Math.max(vh * 0.6, vh * 1.35 - geo.last)) : clamp((w.arrive - 0.3) / 0.7));
    const off = Math.round((1 - v) * (drawn.sh - 1)) * drawn.cell;
    if (off !== sunAt) { sunAt = off; sunC.style.transform = `translate3d(0, ${off}px, 0)`; boxEl.style.setProperty("--night", (1 - 0.7 * v).toFixed(2)); }
    // the six come down onto their steps one after another, a cell at a time, the two nearest the sun first
    drawn.order.forEach((i, n) => {
      const o = q ? 1 : SM.smooth(clamp(v * 1.7 - n * 0.12)), d = -Math.round((1 - o) * 4) * drawn.cell;
      if (sixAt[i] !== d) { sixAt[i] = d; sixAs[i].style.transform = d ? `translate3d(0, ${d}px, 0)` : ""; }
    });
    // the moths fly up to the light as it rises, from a few cells lower and further out, a cell at a time
    const m = Math.round((1 - v) * 6), key = `${m}`;
    if (key !== mothsAt) {
      mothsAt = key;
      moths.forEach((el, k) => { el.style.transform = m ? `translate3d(${(k ? 1 : -1) * m * 0.5 * drawn.cell}px, ${m * drawn.cell}px, 0)` : ""; });
    }
  });
})();
