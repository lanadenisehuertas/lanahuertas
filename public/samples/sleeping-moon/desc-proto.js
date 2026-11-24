/* Prototype: the words for each piece of work, and the Brands room's way into the page of all ten brands.
   Each poster and film carries a short description, as written for the live site (lib/content.ts); each app carries
   its fuller paragraph from DATA in place of its one-line summary. The caption code in rooms.js names the piece; this
   layer follows the name and sets the description under it. */
(() => {
  const { $, $$ } = SM;
  const DESC = {
 "acm-ignition": "Poster for an officer engagement series. A lone silhouette stands at the end of a corridor that opens into a white burst, and the vanishing point leads the eye to the headline.",
 "women-in-cs": "Women's History Month feature on seven computing pioneers: Grace Hopper, Ada Lovelace, Annie Easley, Margaret Hamilton, Gladys West, Dorothy Vaughan and Sister Mary Keller. I cut out archival portraits from a century of sources and gave them one violet grade.",
 "techibig": "Valentine's key art: a Las Vegas marquee in a dusk landscape, with heart-shaped bulbs and arrow signs. The palette is chrome and blush.",
 "cs-night": "Performer lineup for CS Night 2026, the chapter's 19th anniversary, staged as a masquerade ball.",
 "spooktechular": "Halloween event graphic. A candy-filled jack-o'-lantern, lit from below by a wedge of orange, with skeleton and monster hands reaching in from the edges.",
 "back-to-school": "Semester opener drawn as an annotated flat-lay. Each item has a hand-drawn callout and a joke, like headphones that cancel noise but not responsibilities. Students shared it far more than the usual announcement.",
 "pride-month": "Pride Month post. The students in a desaturated classroom photo are painted back in as flat rainbow silhouettes, with a ribbon sweeping through the frame.",
 "project-horizon": "Vector illustration of hikers cresting a ridge at sunrise, built in depth planes with a radiating sky behind the title. All flat colour, no photographs.",
 "acm-kickoff": "Opener for the school year. Chrome and script lettering on a soft violet gradient, with the contact details set small at the base, below the date.",
 "junior-officer-perks": "Recruitment post that splits four benefits into glass panels over a violet event photo. The four text blocks are set to the same ragged shape, so they read as a set.",
 "never-again": "Martial Law commemoration. Archival protest photographs and newspaper headlines collaged under a hard red wash, with the title reversed out of a black block at the centre. Kept plain, for the subject.",
 "startup-qc-winners": "Congratulations post for a chapter team that placed third at a startup competition. The phone photo from the awarding is graded into the chapter palette and framed with sparkles.",
 "solar-system-song": "Educational music video. I produced the music and cut the edit at the same time. Animated planets sing the lyrics against a nebula, with karaoke highlighting timed to the vocal.",
 "horror-trailer": "Trailer for a horror short. It opens on a title card in rolling fog, then holds wide on a corridor of framed portraits in a cold grade, cut to the sound design.",
 "basick-math": "An instructional series with its own identity, animated logo sting and lesson edits. The presenter is keyed onto a blackboard of moving equations, and the logo is a puzzle piece.",
 "nobody-mitski": "A visual interpretation of a Mitski song. Letterboxed wide landscapes hold one small figure in the frame, and the words come in slowly, off-centre.",
 "brenia-18": "An 18th-birthday retrospective, from childhood photos to the present, opening on a hand-lettered title. The stills run through a scrolling film strip and sit in rounded old-TV frames with colour fringing and year stamps.",
 "arduino-trailer": "A 22-second explainer trailer that opens on animated circuit traces. The words move as kinetic type, with the key terms in colour, and it is built as a question and its answer.",
 "self-portrait": "A short video essay about how women are talked about and how that language sinks in. Posts and comments stack up as cards until the frame is almost unreadable, then clear for one italic line, and it ends on women from my own life.",
 "workout-series": "Fitness series shot in a spin studio. Each exercise has a named lower third listing its benefits, and the script title has a soft glow so it reads over the moving picture.",
 "vb-hand-signals": "A referee's hand-signal guide styled like a sports-game broadcast: a rounded frame, clean white staging and a bubble callout for each correct signal.",
 "siyensikula": "Our class's entry to Siyensikula, a science film contest, on genetic engineering. I co-wrote the script and edited it with two classmates: a DNA strand builds the title, then two hosts walk through its kinds and uses with kinetic labels set into each shot.",
 "breaking-barriers": "Documentary essay on Geraldine Roman, the first transgender woman elected to the Philippine Congress. It cuts between interviews, maps and Pride march footage, with torn-paper title cards between chapters. My longest edit, with the most archival research."
};

  /** put a description under a caption's name, and keep it in step whenever the name changes */
  const follow = (name, cls, find) => {
    const at = () => {
      const t = $(name);
      if (!t) return false;
      const text = () => {
        // once the name is spelled out letter by letter (SM.letters) it holds its words twice, once whole for screen
        // readers and once as letters, so the whole copy is the one looked up: the doubled text matched no piece, and
        // the description went blank
        const d = find((t.querySelector(".vh")?.textContent ?? t.textContent).trim());
        let p = t.parentElement.querySelector("." + cls);
        if (!p) { p = document.createElement("p"); p.className = "say w-desc " + cls; t.parentElement.querySelector(".pk-meta").after(p); }
        // the title is rewritten for its letters' handover far more often than it changes: the description, and the
        // layouts its fitting takes, are touched only when the words themselves change
        if (p.textContent === d && p._fit) return;
        if (p.textContent !== d) p.textContent = d;
        p.hidden = !d;
        if (cls === "fr-d") { p._fit = true; fitFilm(p); } else p._fit = true;
      };
      text();
      new MutationObserver(text).observe(t, { childList: true, characterData: true, subtree: true });
      return true;
    };
    if (!at()) { const mo = new MutationObserver(() => { if (at()) mo.disconnect(); }); mo.observe(document.body, { childList: true, subtree: true }); }
  };
  /* the films' words sit above the timeline: a long description is cut to as many lines as fit over it (it is all
     still there for screen readers, and the film itself is one link away), so it never runs into the ruler */
  const fitFilm = (p) => {
    const box = p.closest(".fr-text"), tl = box?.parentElement.querySelector(".fr-tl");
    if (!box || !tl) return;
    p.style.display = "-webkit-box"; p.style.webkitBoxOrient = "vertical"; p.style.overflow = "hidden";
    const room = () => tl.offsetTop - 20 - (box.offsetTop + box.offsetHeight);
    /* each try lays the whole page out, so the count is worked out from one line first: the room left under one line,
       over the height of a line, says how many more fit (rounded up a little, then checked, stepping back if it was
       one too many), which takes two layouts where trying 9, 8, 7 and so on could take nine */
    p.style.webkitLineClamp = "1";
    const r1 = room(), lh = p.getBoundingClientRect().height;
    if (r1 < 0) { p.style.display = "none"; return; }
    for (let n = Math.min(9, 1 + Math.floor((r1 + 1) / Math.max(1, lh))); n >= 1; n--) { p.style.webkitLineClamp = String(n); if (n === 1 || room() >= 0) return; }
    // on a very short screen not even one line fits: the description gives way, keeping its place for the name
    p.style.display = "none";
  };
  addEventListener("resize", () => { const p = $(".fr-d"); if (p) fitFilm(p); });
  const byTitle = (list) => (t) => { const it = list.find((x) => x.t === t); return (it && DESC[it.id]) || ""; };
  follow(".po-t", "po-d", byTitle(DATA.posters));
  follow(".fr-t", "fr-d", byTitle(DATA.films));

  /* the apps: the fuller paragraph in place of the one-line summary, set as each board is built */
  const apps = () => $$("#products .r-board.app").forEach((b) => {
    if (b._desc) return;
    const p = DATA.products.find((x) => b.id === "app-" + x.id), say = $(".say", b);
    if (!p || !say) return;
    b._desc = true; say.textContent = p.p; say.classList.add("w-desc");
  });
  /* the Brands room: each brand opens the page of all ten, at that brand */
  const brands = () => $$('#brands a[href^="brand.html?b="]').forEach((a) => {
    a.href = "brands-proto.html#" + new URL(a.href).searchParams.get("b");
    a.textContent = "See the full branding";
  });
  const watch = (sel, fn) => { const el = $(sel); if (!el) return; fn(); new MutationObserver(fn).observe(el, { childList: true, subtree: true }); };
  watch("#products", apps);
  watch("#brands", brands);
})();
