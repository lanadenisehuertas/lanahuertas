/* Stops V and VI: about, contact. Each fills its mount in index.html, if the mount is there. */
(() => {
  const { $, $$ } = SM;
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  const two = (n) => String(n).padStart(2, "0");
  const el = (html) => { const t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; };

  /* ================================================================ V About, as a moon calendar.
     1. Who: the portrait on the left; the statement and its kicker set large beside it (Lana's own words from the live
        site); the roles and the city in one plain line.
     2. Year by year, from 2019 to now: the years run down the right, and on the left one big moon stays in the
        window while you read them. It is the year: a thin crescent in 2019, filling as you scroll through the years,
        full in 2026, when it wakes into colour. Under it the year rolls on, and a row of six small moons marks where
        you are; each is a link to its year.
     3. What I work with: a plain index, one skill group a line.
     Text from lib/content.ts (the live About). */
  if ($("#m-about")) {
    const mount = $("#m-about");
    const headline = "I build high-quality visual content and adaptable designs for brands that want to stand out.", kicker = "And I can do it for you, too.";
    /* each entry in keywords: what and where, when, and a few points; the facts from the live About */
    const YEARS = [
      ["2026", [
        { t: "UI/UX design intern, Eden Holdings Philippines", w: "August 2026 to now", p: ["Wireframes, user flows, Figma prototypes", "Design system and UI libraries", "AI-assisted research"] },
        { t: "1st runner-up, ImaGnation: GCash Innovation Challenge", w: "2026", p: [] },
        { t: "PMI Project Management Ready", w: "March 2026", p: [] },
      ]],
      ["2025", [
        { t: "IT Specialist: Python, Certiport", w: "July 2025", p: [] },
        { t: "Android Development with Kotlin, LinkedIn Learning", w: "November 2025", p: [] },
      ]],
      ["2023", [
        { t: "Computer Science, FEU Tech", w: "2023 to 2027", p: ["Software Engineering", "Elite Scholar and DOST scholar"] },
        { t: "Creatives head, Student Coordinating Council and ACM FEU Tech", w: "2023 to 2025", p: ["Campus events and interschool competitions", "Instagram, Facebook and TikTok campaigns"] },
        { t: "Freelance graphic designer and video editor", w: "2023 to 2026", p: ["Brand assets for clients", "Premiere Pro, After Effects, Canva templates"] },
        { t: "Regional Science High School III, high honors", w: "2023", p: [] },
      ]],
      ["2022", [
        { t: "Editing head, CybeRS Robotics Club", w: "2022 to 2023", p: ["Co-founded it and built its identity", "Led a 10-member editing team"] },
      ]],
      ["2020", [
        { t: "Multimedia editor, Lord Jesus Fellowship Church", w: "2020 to 2025", p: ["Weekly video and graphics", "Facebook, Instagram, YouTube"] },
      ]],
      ["2019", [
        { t: "First graphics and video edits", w: "2019 to 2023", p: ["School and community projects", "Where the Adobe habit started"] },
      ]],
    ];
    const SKILLS = [
      ["Design", ["UI/UX principles", "design systems", "typography & visual hierarchy", "Figma", "Photoshop", "Illustrator", "Canva", "brand identity", "print & digital"]],
      ["Programming", ["Python", "JavaScript/TypeScript", "Kotlin (Android)", "Java", "PHP", "Next.js", "Tailwind"]],
      ["Backend & data", ["Supabase", "REST API design", "Hotelling's T²", "EWMA baselines", "multivariate anomaly detection", "Git/GitHub", "Electron", "PyInstaller"]],
      ["Video editing", ["Premiere Pro", "After Effects", "motion graphics", "color grading", "export & compression"]],
      ["Social media", ["Facebook", "Instagram", "TikTok", "X/Twitter", "content calendars", "organic growth & engagement", "copywriting", "brand voice adaptation"]],
      ["Ways of working", ["project management", "cross-functional coordination", "remote team coordination", "scheduling", "digital asset management"]],
      ["AI tools", ["ChatGPT", "Claude, for research, ideation and workflow"]],
    ];
    /* the years run forward, from 2019 to now, so the moon fills as you read: a thin crescent for the first year,
       full for 2026 */
    const Y = YEARS.slice().reverse(), n = Y.length;
    const phase = (k) => 0.14 + (k / (n - 1)) * 0.86;
    mount.innerHTML = `
    <div class="me" id="me">
      <div class="mirror">
        <span class="pic box me-pic" data-kind="photo" data-main><img class="full" src="/work/lana-portrait.webp" width="1136" height="1200" alt="Lana Huertas leaning on a railing at night" loading="lazy"></span>
        <span class="pic m-frame" data-kind="paint"><img class="full" src="art/mirror.webp" width="1000" height="1323" alt="" loading="lazy"></span>
      </div>
      <div class="me-say">
        <p class="display">${headline}</p>
        <p class="display kick">${kicker}</p>
        <p class="me-roles">UI/UX, graphics, video and code. Manila.</p>
      </div>
    </div>

    <section class="cal" aria-labelledby="cal-h">
      <div class="cal-sky">
        <div class="cal-intro">
          <h3 class="cal-h" id="cal-h">Year by year</h3>
          <p class="cal-key">One moon a year, full by now.</p>
        </div>
        <div class="cal-pin">
          <span class="pic cal-moon" data-kind="moon" data-enter="manual" data-phase="${phase(0).toFixed(3)}"><img class="full" src="art/moon-plain.webp" width="640" height="640" alt="" loading="lazy"></span>
          <div class="cal-year" aria-hidden="true"><div class="cal-roll">${Y.map(([y]) => `<span>${y}</span>`).join("")}</div></div>
          <nav class="cal-moons" aria-label="Go to a year">${Y.map(([y], k) => `<a class="mo" href="#yr-${y}" data-k="${k}" aria-label="${y}">
            <span class="pic mo-pic" data-kind="moon" data-phase="${phase(k).toFixed(3)}"><img class="full" src="art/moon-plain.webp" width="640" height="640" alt="" loading="lazy"></span><span class="mo-y">${y}</span></a>`).join("")}</nav>
        </div>
      </div>
      <ol class="yrs">${Y.map(([y, list]) => `<li class="yr" id="yr-${y}">
        <h4 class="yr-n">${y}</h4>
        <ol class="yr-list">${list.map((e) => `<li>
          <p class="e-t">${esc(e.t)}</p>
          <p class="e-w">${esc(e.w)}</p>
          ${e.p.length ? `<ul>${e.p.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        </li>`).join("")}</ol>
      </li>`).join("")}</ol>
    </section>

    <section class="idx" aria-labelledby="idx-h">
      <h3 class="idx-h" id="idx-h">What I work with</h3>
      <div class="idx-text">${SKILLS.map(([g, items]) => `<p><i>${g}.</i> ${esc(items.join(", ").replace(/, ([^,]*)$/, " and $1"))}.</p>`).join("")}</div>
    </section>`;
    SM.pictures(mount);
    SM.corners($("#me"));

    /* the statement and the index come up as they reach the window, as far as the scroll has brought them */
    const rise = [...$$(".me-say > p", mount), $(".idx-h", mount), ...$$(".idx-text p", mount)];
    SM.scrub(() => {
      const vh = innerHeight, quiet = SM.quiet();
      // each line's place in the page is measured once and again only when the page changes size (SM.placedGen),
      // so this does not lay the page out every frame
      rise.forEach((el) => {
        if (el._gen !== SM.placedGen || el._w !== innerWidth) { el._gen = SM.placedGen; el._w = innerWidth; el._top = el.getBoundingClientRect().top + scrollY; }
        const r = { top: el._top - scrollY };
        if (r.top > vh * 1.6 && el._v === "0.000") return;
        const v = quiet ? 1 : SM.smooth(Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.42)))), V = v.toFixed(3);
        if (el._v !== V) { el._v = V; el.style.setProperty("--in", V); }
      });
    });

    /* the scroll drives the calendar: the big moon's phase follows how far you have read through the years, the year
       under it rolls from one to the next, the small moon for the year you are in wakes, and each year's entries
       come up as they reach the window */
    const yrs = $$(".yr", mount), roll = $(".cal-roll", mount), smalls = $$(".mo", mount), moon = SM.bitmap($(".cal-moon", mount));
    const sbm = smalls.map((m) => SM.bitmap(m));
    if (moon) SM.whenNear(mount, () => moon.load().then(() => moon.setShow(1)).catch(() => {}));
    smalls.forEach((m, k) => {
      SM.wakeable(m, { line: `Go to ${Y[k][0]}` });
      m.addEventListener("click", (e) => { e.preventDefault(); SM.glide(yrs[k].getBoundingClientRect().top + scrollY - innerHeight * 0.32); });
    });
    let yi = -1;
    SM.scrub(() => {
      const top = yrs[0].getBoundingClientRect().top;
      if (top > innerHeight * 2 || yrs[n - 1].getBoundingClientRect().bottom < -innerHeight) return;
      // the reading line, a third of the way down the window
      const line = innerHeight * 0.36;
      // the moon and the year hold while a year is read, and turn over to the next across the same stretch of scroll
      // (a fifth of a screen, a little less on phones) as the next year's heading comes up to the reading line, so a
      // short year and a long one roll at the same pace and the roll never rushes or drags
      const W = innerHeight * (SM.COLUMN.matches ? 0.16 : 0.2), lead = innerHeight * 0.06;
      let at = 0;
      for (let j = 1; j < n; j++) at += SM.smooth(Math.min(1, Math.max(0, (line + lead - yrs[j].getBoundingClientRect().top) / W)));
      at = Math.min(n - 1, at);
      moon?.setPhase(phase(0) + (at / (n - 1)) * 0.86);
      moon?.setFloor(SM.smooth(Math.max(0, at - (n - 2))));   // full, it wakes into colour: now
      roll.style.transform = `translate3d(0, ${(-at * 100 / n).toFixed(3)}%, 0)`;
      sbm.forEach((b, j) => b?.setFloor(1 - Math.min(1, Math.abs(at - j))));
      const now = Math.round(at);
      if (now !== yi) { yi = now; smalls.forEach((m, j) => (j === now ? m.setAttribute("aria-current", "true") : m.removeAttribute("aria-current"))); }
      yrs.forEach((el) => {
        const r = el.getBoundingClientRect(), v = SM.quiet() ? 1 : SM.smooth(Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.5))));
        const V = v.toFixed(3);
        if (el._v !== V) { el._v = V; el.style.setProperty("--in", V); }
      });
    });
  }

  /* ================================================================ VI Contact: first light.
     The moon that was asleep over the name at the top of the night now sets behind the ground at dawn.
     Above it: the big "Let's talk", and the address set large across the moon, the way the name
     crosses it on the first screen. On the ground: the links, a way back to the top, and the sign-off. */
  if ($("#m-talk")) {
    const mount = $("#m-talk");
    const ADDR = "lanadenisehuertas@gmail.com";
    const ext = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>`;
    mount.innerHTML = `<div class="dawnboard">
      <span class="pic orn t-moth l" data-kind="line" data-still><img class="full" src="art/e_moth.webp" width="744" height="396" alt=""></span>
      <span class="pic orn t-moth r" data-kind="line" data-still><img class="full" src="art/e_moth.webp" width="744" height="396" alt=""></span>
      <div class="env" id="env">
        <img class="env-back" src="art/env-back.webp" width="815" height="1035" alt="" loading="lazy">
        <div class="letter">
          <h2 class="t-big">Let's talk</h2>
          <p class="t-line">Open for UI/UX, brand and motion work. Replies in two days.</p>
          <a class="t-addr" href="mailto:${ADDR}">${ADDR}</a>
          <button class="go" type="button" id="t-copy">Copy the address</button>
        </div>
        <img class="env-front" src="art/env-front.webp" width="815" height="1035" alt="" loading="lazy">
      </div>
      <div class="t-ground">
        <span class="pic orn t-lily l" data-kind="line" data-still><img class="full" src="art/e_lily.webp" width="457" height="904" alt=""></span>
        <span class="pic orn t-lily r" data-kind="line" data-still><img class="full" src="art/e_lily.webp" width="457" height="904" alt=""></span>
        <nav class="t-links" aria-label="Elsewhere">
          <a class="go" href="https://www.linkedin.com/in/lana-denise-huertas/" target="_blank" rel="noopener">LinkedIn ${ext}<span class="vh"> (opens a new tab)</span></a>
          <a class="go" href="#moon" id="t-top">Back to the moon</a>
          <a class="go" href="https://github.com/lanadenisehuertas/" target="_blank" rel="noopener">GitHub ${ext}<span class="vh"> (opens a new tab)</span></a>
        </nav>
        <p class="t-made">Made in Manila by Lana Huertas, 2026</p>
      </div>
    </div>`;
    /* the letter rises out of the envelope as the dawn comes up the window, and sinks back if you scroll back */
    const env = $("#env"), talk = $("#talk");
    SM.scrub(() => {
      const w = SM.where(talk);
      if (!w.near) return;
      const v = SM.quiet() ? 1 : SM.smooth(Math.min(1, Math.max(0, (w.arrive - 0.35) / 0.55))), V = v.toFixed(3);
      if (env._v !== V) { env._v = V; env.style.setProperty("--up", V); }
    });
    SM.pictures(mount);
    $$(".type", mount).forEach(SM.type);
    const copy = $("#t-copy");
    let t = 0;
    copy.addEventListener("click", async () => {
      let ok = true;
      try { await navigator.clipboard.writeText(ADDR); } catch (e) { ok = false; }
      clearTimeout(t);
      copy.textContent = ok ? "Copied" : "Copy the address";
      if (ok && !SM.quiet()) copy.animate([{ transform: "scale(1)" }, { transform: "scale(0.97)" }, { transform: "scale(1)" }], { duration: 220, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
      SM.say(ok ? "Copied" : `The address is ${ADDR}`);
      t = setTimeout(() => { copy.textContent = "Copy the address"; SM.say(); }, ok ? 2000 : 4000);
    });
    $("#t-top").addEventListener("click", (e) => { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); SM.travel("moon", { x: r.left + r.width / 2, y: r.top + r.height / 2 }); });
  }
})();
