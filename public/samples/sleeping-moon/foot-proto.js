/* Prototype: the dawn ending as one board (see foot-proto.css). Sample visitors only; nothing is sent anywhere. */
(() => {
  const { $, $$ } = SM, end = $("#talk"), board = $("#talk .dawnboard");
  if (!board) return;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const arrow = `<svg viewBox="0 0 26 14" aria-hidden="true"><path d="M1 7h23M18.5 1.5L24 7l-5.5 5.5"/></svg>`;
  const ext = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>`;
  const KINDS = { star: "A star", crescent: "A crescent moon", half: "A half moon", full: "A full moon" };
  // each colour a visitor picks, as it shows in the morning sky: deep enough to read on the dawn (3:1 and up), never red
  const COLS = { lilac: "#5b3fc4", gold: "#8a5d00", pink: "#a3367f", sky: "#1f5c9e", peach: "#96541a", mint: "#1d7651" };
  const NAMES = { lilac: "Lilac", gold: "Gold", pink: "Pink", sky: "Sky blue", peach: "Peach", mint: "Mint" };

  const ground = $(".t-ground", board);
  ground.insertAdjacentHTML("beforebegin", `
    <div class="ls">
      <h2 class="end-h" id="vs-h">The last stars</h2>
      <p class="end-line vs-line" aria-live="polite"><span class="vs-count">0</span> left by visitors</p>
      <button class="btn vs-open" type="button">Leave yours ${arrow}</button>
      <div class="vs-skybox">
        <div class="vs-sky" role="group" aria-labelledby="vs-h"></div>
        <p class="vs-note" aria-hidden="true"><b></b><span></span></p>
      </div>
    </div>
    <div class="rs">
      <form class="write" novalidate aria-labelledby="w-h">
        <h2 class="end-h" id="w-h">Write to me</h2>
        <label class="fld"><span class="l">Name</span><input name="name" autocomplete="name" maxlength="80" required aria-describedby="w-err-name"><span class="err" id="w-err-name"></span></label>
        <label class="fld"><span class="l">Email</span><input name="email" type="email" autocomplete="email" maxlength="120" required aria-describedby="w-err-email"><span class="err" id="w-err-email"></span></label>
        <label class="fld"><span class="l">Message</span><textarea name="message" rows="3" maxlength="2000" required aria-describedby="w-err-message"></textarea><span class="err" id="w-err-message"></span></label>
        <input class="hp" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">
        <div class="row"><button class="btn" type="submit">Send ${arrow}</button></div>
        <p class="w-done" role="status"></p>
      </form>
      <form class="vs-make" hidden novalidate aria-label="Leave a star or a moon">
        <fieldset><legend>Star or moon</legend><div class="opts shapes"></div></fieldset>
        <fieldset><legend>Colour</legend><div class="opts swatches"></div></fieldset>
        <label class="fld"><span class="l">Name</span><input name="name" maxlength="24" autocomplete="given-name" required aria-describedby="s-err-name"><span class="err" id="s-err-name"></span></label>
        <label class="fld"><span class="l">Note, for everyone (optional)</span><input name="note" maxlength="90" aria-describedby="s-more"><span class="more" id="s-more">90 left</span></label>
        <p class="hint">Click the sky to place it.</p>
        <div class="row"><button class="btn" type="submit">Leave it</button><button class="btn quiet vs-cancel" type="button">Not now</button></div>
      </form>
    </div>`);

  /* ---------- Write to me: a private message (the live site sends these through formsubmit.co) ---------- */
  const write = $(".write", end), done = $(".w-done", end);
  const field = (name) => write.elements[name];
  const RULES = {
    name: (v) => (v ? "" : "Add your name."),
    email: (v) => (!v ? "Add your email." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Check the email: it needs an @ and a dot."),
    message: (v) => (v ? "" : "Add a message."),
  };
  const checkOne = (name) => {
    const el = field(name), msg = RULES[name](el.value.trim());
    $(`#w-err-${name}`).textContent = msg;
    msg ? el.setAttribute("aria-invalid", "true") : el.removeAttribute("aria-invalid");
    return !msg;
  };
  // checked when sent, then again as a flagged field is corrected; never on blur, where a new error line would push
  // the Send button away from under the pointer before the click lands
  Object.keys(RULES).forEach((n) => field(n).addEventListener("input", () => field(n).hasAttribute("aria-invalid") && checkOne(n)));
  write.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = Object.keys(RULES).filter((n) => !checkOne(n));
    if (bad.length) { field(bad[0]).focus(); return; }
    const b = $("[type=submit]", write); b.disabled = true; b.firstChild.textContent = "Sending ";
    setTimeout(() => {   // the prototype stands in for the POST
      b.disabled = false; b.firstChild.textContent = "Send ";
      done.textContent = `Sent. Thank you, ${field("name").value.trim().split(" ")[0]}. I reply in two days.`;
      write.reset();
    }, 500);
  });

  /* ---------- the last stars ---------- */
  const sky = $(".vs-sky", end), note = $(".vs-note", end), make = $(".vs-make", end), line = $(".vs-line", end), openBtn = $(".vs-open", end), boxEl = $(".vs-skybox", end);
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
  const who = ["Mika", "Jo", "Ren", "Bea", "Carlo", "Dani", "Elle", "Gab", "Hana", "Iya", "Jules", "Kat", "Lio", "Mae", "Nico", "Pia", "Ria", "Sam", "Tala", "Vee",
    "Wen", "Yuri", "Zia", "Ash", "Bo", "Dev", "Em", "Faye", "Gio", "Ivy", "Jas", "Kit", "Lou", "Noor", "Pat", "Rae"];
  const says = ["the moon page is so pretty", "hi from Cebu!", "loved the posters", "", "the brand worlds are so fun", "hello from a fellow designer", "keep making things",
    "the hover magic got me", "", "came for the moon, stayed for the films", "this is the most fun portfolio", "rooting for you!", "", "pixel moons forever", "hi Lana and Peanut"];
  const kinds = Object.keys(KINDS), cols = Object.keys(COLS);
  const list = [
    { name: "Lana", note: "Thank you for staying until morning.", kind: "full", color: "lilac", x: 0.5, y: 0.3, seed: true },
    { name: "Peanut", note: "meow (she says hi)", kind: "crescent", color: "peach", x: 0.58, y: 0.42, seed: true },
  ];
  who.forEach((name, i) => {
    let x, y, k = 0;
    do { x = 0.02 + rnd() * 0.96; y = 0.04 + rnd() * 0.92; } while (k++ < 40 && list.some((v) => Math.hypot(v.x - x, (v.y - y) * 0.55) < 0.06));
    list.push({ name, note: says[i % says.length], kind: kinds[Math.floor(rnd() * 4)], color: cols[Math.floor(rnd() * 6)], x, y });
  });
  const starEl = (v) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "vs-star" + (v.seed ? " seed" : "") + (v.mine ? " mine" : "");
    b.setAttribute("aria-label", `${KINDS[v.kind]} from ${v.name}${v.note ? ": " + v.note : ""}`);
    b.style.cssText = `--x:${v.x};--y:${v.y};--c:${COLS[v.color]}`;
    b.innerHTML = sprite(v.kind); b._v = v;
    return b;
  };
  list.forEach((v) => sky.append(starEl(v)));

  let lit = null;
  const show = (b) => {
    if (lit) lit.classList.remove("on");
    lit = b; b.classList.add("on");
    const box = boxEl.getBoundingClientRect(), r = b.getBoundingClientRect();
    const x = r.left + r.width / 2 - box.left, y = r.top + r.height / 2 - box.top;
    $("b", note).textContent = b._v.name; $("span", note).textContent = b._v.note;
    note.style.maxWidth = "";
    const nw = Math.min(note.offsetWidth, box.width * 0.6), right = x + 18 + nw < box.width - 8;
    note.style.maxWidth = `min(26ch, ${Math.round(Math.max(right ? box.width - x - 26 : x - 26, 120))}px)`;
    note.classList.toggle("left", !right);
    note.style.left = x + "px"; note.style.top = clamp(y, 40, box.height - 40) + "px";
    note.classList.add("on");
  };
  sky.addEventListener("pointerover", (e) => { const b = e.target.closest(".vs-star"); if (b && e.pointerType !== "touch") show(b); });
  sky.addEventListener("focusin", (e) => { const b = e.target.closest(".vs-star"); if (b) show(b); });
  sky.addEventListener("click", (e) => { const b = e.target.closest(".vs-star"); if (b) show(b); });

  /* the scroll brings them out in the order they were left, and turns their twinkle */
  let making = false, left = false;
  $(".vs-count", end).textContent = list.length;
  SM.scrub(() => {
    const r = boxEl.getBoundingClientRect(), vh = innerHeight, q = SM.quiet();
    if (r.bottom < -vh || r.top > vh * 2) return;
    const p = q ? 2 : (vh * 0.98 - r.top) / (vh * 0.75), stars = $$(".vs-star", sky), n = stars.length;
    stars.forEach((s, i) => {
      const o = clamp((p * 1.15 - (i / n) * 0.95) / 0.1);
      const tw = q || o < 1 ? 1 : 0.8 + 0.2 * Math.sin(scrollY / 70 + i * 1.7);
      s.style.setProperty("--o", (o * tw).toFixed(3));
    });
  });

  /* the maker */
  const shapes = $(".shapes", make), swatches = $(".swatches", make);
  shapes.innerHTML = kinds.map((k, i) => `<label class="opt"><input type="radio" name="kind" value="${k}"${i === 0 ? " checked" : ""}><span class="vh">${KINDS[k]}</span>${sprite(k)}</label>`).join("");
  swatches.innerHTML = cols.map((c, i) => `<label class="opt sw" style="--c:${COLS[c]}"><input type="radio" name="color" value="${c}"${i === 0 ? " checked" : ""}><span class="vh">${NAMES[c]}</span><i></i></label>`).join("");
  const newEl = Object.assign(document.createElement("button"), { type: "button", className: "vs-new", hidden: true });
  sky.append(newEl);
  let pos = { x: 0.5, y: 0.5 };
  const pick = () => ({ kind: make.elements.kind.value, color: make.elements.color.value });
  const paint = () => {
    const { kind, color } = pick();
    make.style.setProperty("--pick", COLS[color]);
    newEl.style.setProperty("--c", COLS[color]); newEl.innerHTML = sprite(kind);
    newEl.setAttribute("aria-label", `Your ${KINDS[kind].toLowerCase().replace(/^a /, "")}. Use the arrow keys to move it.`);
  };
  const place = (x, y) => {
    pos = { x: clamp(x, 0.02, 0.98), y: clamp(y, 0.03, 0.97) };
    const r = sky.getBoundingClientRect();
    newEl.style.transform = `translate3d(${(pos.x * r.width).toFixed(1)}px, ${(pos.y * r.height).toFixed(1)}px, 0)`;
  };
  make.addEventListener("change", paint);
  const open = () => {
    // the maker takes the form's place on the right; on a phone it goes under the sky, which stays pinned above it
    (SM.COLUMN.matches ? $(".ls", end) : $(".rs", end)).append(make);
    making = true; end.classList.add("making"); openBtn.hidden = true; make.hidden = false; newEl.hidden = false; if (!SM.COLUMN.matches) write.hidden = true;
    note.classList.remove("on"); paint();
    let best = null, far = -1;   // start it somewhere free: the emptiest of a few tries
    for (let k = 0; k < 24; k++) {
      const x = 0.08 + rnd() * 0.84, y = 0.12 + rnd() * 0.76, d = Math.min(...list.map((v) => Math.hypot(v.x - x, v.y - y)));
      if (d > far) { far = d; best = { x, y }; }
    }
    place(best.x, best.y);
    $("input", shapes).focus({ preventScroll: true });
  };
  const close = () => { making = false; end.classList.remove("making"); openBtn.hidden = false; make.hidden = true; newEl.hidden = true; write.hidden = false; openBtn.focus({ preventScroll: true }); };
  openBtn.addEventListener("click", open);
  $(".vs-cancel", make).addEventListener("click", close);
  make.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  boxEl.addEventListener("pointerdown", (e) => {
    if (!making || e.target.closest(".vs-star")) return;
    const r = sky.getBoundingClientRect();
    place((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
  });
  newEl.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return close();
    const s = e.shiftKey ? 0.06 : 0.02, m = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
    if (m) { e.preventDefault(); place(pos.x + m[0], pos.y + m[1]); }
  });
  addEventListener("resize", () => making && place(pos.x, pos.y));
  const nameIn = make.elements.name, noteIn = make.elements.note, more = $("#s-more");
  noteIn.addEventListener("input", () => { const n = 90 - noteIn.value.length; more.textContent = `${n} left`; });
  nameIn.addEventListener("input", () => { if (nameIn.value.trim()) { $("#s-err-name").textContent = ""; nameIn.removeAttribute("aria-invalid"); } });
  make.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameIn.value.trim();
    if (!name) { $("#s-err-name").textContent = "Add your name."; nameIn.setAttribute("aria-invalid", "true"); nameIn.focus(); return; }
    const sub = $("[type=submit]", make); sub.disabled = true; sub.textContent = "Leaving it";
    setTimeout(() => {   // the prototype stands in for the POST to /api/garden
      const v = { name, note: noteIn.value.trim(), ...pick(), ...pos, mine: true };
      list.push(v); const b = starEl(v); b.style.setProperty("--o", 1); sky.insertBefore(b, newEl);
      sub.disabled = false; sub.textContent = "Leave it";
      make.reset(); more.textContent = "90 left";
      close(); left = true;
      line.textContent = "Yours is up. Thank you!";
      openBtn.firstChild.textContent = "Leave another ";
      show(b);
    }, 450);
  });
})();
