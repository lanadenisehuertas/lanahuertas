/* Phones: one stop at a time.
   An iPhone keeps every picture and every layer a page has drawn until the page lets it go, and closes the tab without a
   word once they come to more than it will hold. Scrolled from the room at the top down through all the stops and back
   up again, this page had drawn far more than that. So on a phone each stop below the moon's is drawn only while it is
   near the screen: further away the browser skips it altogether (content-visibility, lean-proto.css), lets its layers
   and pictures go, and keeps only its place on the page. The room at the top takes itself down the same way
   (room-proto.js). Wide screens keep everything drawn, as before.
   The height a stop keeps while it is skipped is its real one, read here once the page has laid itself out, and the
   browser takes it afresh each time the stop is drawn again, so the page never changes length under the reader. */
(() => {
  const root = document.documentElement;
  const apply = () => {
    const on = SM.COLUMN.matches;
    root.classList.remove("lean");
    if (on) {
      const stops = [...document.querySelectorAll("main > section.stop:not(.hero)")];
      // read every height first, then write them all, so the page is laid out once
      const hs = stops.map((s) => s.offsetHeight);
      stops.forEach((s, k) => s.style.setProperty("contain-intrinsic-block-size", `auto ${hs[k]}px`));
    }
    root.classList.toggle("lean", on);
  };
  // once the page and its room are standing, so each stop has the height its own script gives it
  const loaded = new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r, { once: true })));
  Promise.all([loaded, SM.roomReady].filter(Boolean)).then(() => requestAnimationFrame(apply), () => requestAnimationFrame(apply));
  // a phone turned on its side lays its stops out afresh, so their heights are read again
  SM.COLUMN.addEventListener("change", () => requestAnimationFrame(apply));
})();
