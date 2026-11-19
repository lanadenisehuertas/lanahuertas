/* Prototype: the words for each piece of work, and the Brands room's way into the page of all ten brands.
   Each poster and film carries a short description, as written for the live site (lib/content.ts); each app carries
   its fuller paragraph from DATA in place of its one-line summary. The caption code in rooms.js names the piece; this
   layer follows the name and sets the description under it. */
(() => {
  const { $, $$ } = SM;
  const DESC = {
 "acm-ignition": "Officer engagement series poster. A lone silhouette stands at the end of a perspective corridor blowing open into a white burst — the vanishing point doing the work of pointing at the headline.",
 "women-in-cs": "Women's History Month feature honouring seven computing pioneers — Grace Hopper, Ada Lovelace, Annie Easley, Margaret Hamilton, Gladys West, Dorothy Vaughan, and Sister Mary Keller. Archival portraits were cut out and unified under a single violet grade, so a century of source photography reads as one piece.",
 "techibig": "Valentine's event key art built around a Las Vegas-style marquee standing in a dusk landscape, with heart-shaped bulbs and arrow signage. The chrome-and-blush palette carries the season-of-love line so the copy never has to say it twice.",
 "cs-night": "Performer lineup for CS Night 2026, the chapter’s 19th anniversary, staged as a masquerade ball.",
 "spooktechular": "Halloween event graphic — a candy-filled jack-o-lantern lit from below by a wedge of orange, framed by skeleton and monster hands reaching in from the edges.",
 "back-to-school": "Semester-opening post built as an annotated flat-lay. Each item gets a hand-drawn callout with a joke attached — headphones that cancel noise, not responsibilities — which turned a routine announcement into something students actually shared.",
 "pride-month": "Pride Month post. A desaturated classroom photo has its students painted back in as flat rainbow silhouettes, with a ribbon sweeping through the frame — colour used as the entire argument.",
 "project-horizon": "Vector illustration of hikers cresting a ridge at sunrise, layered into depth planes with a radiating sky behind the title. Flat-colour work throughout — no photography.",
 "acm-kickoff": "Academic-year opener. Chrome and script lettering over a soft violet gradient, with a full contact footer kept quiet at the base so it never competes with the date.",
 "junior-officer-perks": "Recruitment infographic breaking four benefits into translucent glass panels over a violet event photo. Body copy is evenly ragged so the four blocks read as a set rather than a list.",
 "never-again": "Martial Law commemoration. Archival protest photography and headline clippings collaged under a hard red wash, with the title reversed out of a black block at centre — restrained on purpose, given the subject.",
 "startup-qc-winners": "Congratulations post for a chapter team placing third at a startup competition. The awarding photo is graded into the chapter palette and framed with sparkle accents, so a phone-shot documentation image sits comfortably beside polished key art.",
 "solar-system-song": "Educational music video with original music production alongside the edit. Animated planets perform the lyrics against a nebula field, with karaoke-style highlighting timed to the vocal. Scoring and cutting happened together rather than one after the other.",
 "horror-trailer": "Trailer for a narrative horror short, opening on a production title card in rolling fog. Cold interior grade, held wides on a corridor of framed portraits, and cuts timed to the sound design rather than the dialogue.",
 "basick-math": "Branded instructional series — identity, animated logo sting, and lesson edit. The presenter is keyed onto a blackboard field of live equations, and the mark itself is built from a puzzle piece to carry the math-made-easy line.",
 "nobody-mitski": "Visual interpretation of a Mitski track, built as a letterboxed sequence of wide landscape shots with a single figure held small in frame. Typography enters slowly and off-centre, letting the isolation in the composition do the reading.",
 "brenia-18": "Debut retrospective spanning childhood photographs to the present, opening on a hand-lettered title card. Stills are threaded through a scrolling film-strip treatment and set inside rounded vintage-television frames with chromatic fringing and year stamps, so the montage carries its own timeline without narration.",
 "arduino-trailer": "Short explainer trailer opening on an animated circuit-trace field. Copy is built as kinetic type with key terms colour-lifted out of the sentence — twenty-two seconds, structured as a question and its answer.",
 "self-portrait": "Short video essay on how women are talked about, and how that language gets internalised. Collected posts and comments are stacked as layered cards until the frame is almost unreadable — then the pile clears for a single italic line, and the piece closes on a montage of real women in the maker's own life.",
 "workout-series": "Instructional fitness series shot in a spin studio. Each exercise gets a named lower-third listing its benefits, and the script title uses a soft glow so it stays readable over a moving frame.",
 "vb-hand-signals": "Officiating reference video styled as a sports-game parody — rounded frame, clean white staging, and bubble callouts on each correct signal. A dry rulebook exercise given a format people would actually finish.",
 "breaking-barriers": "Documentary video essay on Geraldine Roman, the first transgender woman elected to the Philippine Congress. Cuts between interview footage, mapped geography, and Pride march coverage, with torn-paper title cards holding the chapter breaks. The longest-form edit here and the one with the most archival sourcing behind it."
};

  /** put a description under a caption's name, and keep it in step whenever the name changes */
  const follow = (name, cls, find) => {
    const at = () => {
      const t = $(name);
      if (!t) return false;
      const text = () => {
        const d = find(t.textContent.trim());
        let p = t.parentElement.querySelector("." + cls);
        if (!p) { p = document.createElement("p"); p.className = "say w-desc " + cls; t.parentElement.querySelector(".pk-meta").after(p); }
        if (p.textContent !== d) p.textContent = d;
        p.hidden = !d;
        if (cls === "fr-d") fitFilm(p);
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
    for (let n = 9; n >= 1; n--) { p.style.webkitLineClamp = String(n); if (room() >= 0) return; }
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
