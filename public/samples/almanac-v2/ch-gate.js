/* Chapters #gate and #cabinet: the hero gate and the seed cabinet. */
(() => {
  const { $, goTo, RM } = ALM;

  /* ---------- gate ---------- */
  const mg = $("#m-gate");
  if (mg) {
    mg.innerHTML = `
      <div class="g-motes" aria-hidden="true"></div>
      <div class="g-garden" aria-hidden="true"></div>
      <p class="hud g-hud l">Almanac no. 01<br>The night garden issue</p>
      <p class="hud g-hud r">Manila, Philippines<br>Open to work</p>
      <div class="g-text">
        <h1 class="g-name display" id="name"><span class="l1 wear">Lana Denise</span><img class="bud" src="../brand/art/g_bloom.webp" width="520" height="520" alt=""><span class="l2 wear">Huertas</span></h1>
        <p class="lede g-lede">UI/UX and graphic designer in Manila. I design brands, posters, films and real product screens, and I build some of them in code.</p>
        <div class="g-cta">
          <button class="btn glass" type="button" id="openGate"><img class="gem" src="../brand/art/g_bud.webp" width="60" height="60" alt="">Open the gate</button>
          <a class="btn line" href="#talk" id="mailLana">Email Lana</a>
          <button class="g-plant" type="button" id="plant">Plant a flower</button>
        </div>
      </div>
      <img class="lana" src="art/lana.webp" width="520" height="520" alt="Lana's sticker">
      <div class="g-gates" aria-hidden="true">
        <img class="gl" src="art/gate-l.webp" width="706" height="920" alt="">
        <img class="gr" src="art/gate-r.webp" width="707" height="920" alt="">
      </div>
      <div class="g-front" aria-hidden="true">
        <img class="fl" src="art/f_corner.webp" width="900" height="962" alt="">
        <img class="fr" src="art/f_corner.webp" width="900" height="962" alt="">
      </div>`;
    ALM.wearAll(mg);
    $("#openGate").addEventListener("click", () => goTo("cabinet"));
    $("#mailLana").addEventListener("click", (e) => { e.preventDefault(); goTo("talk"); });

    if (!RM) {
      $(".g-motes", mg).innerHTML = Array.from({ length: 14 }, () => `<span style="left:${(Math.random() * 100).toFixed(1)}%;top:${(30 + Math.random() * 65).toFixed(1)}%;--d:${(7 + Math.random() * 7).toFixed(1)}s;--dx:${(Math.random() * 80 - 40).toFixed(0)}px;--dy:${(-20 - Math.random() * 60).toFixed(0)}px;opacity:${(0.35 + Math.random() * 0.5).toFixed(2)}"></span>`).join("");
    }

    const garden = $(".g-garden", mg), stage = $("#gate .stage");
    const SPR = ["p_bloom", "p_bud", "p_fly", "p_bloom", "p_bud"];
    let n = 0;
    const plant = (x, y) => {
      const img = new Image();
      img.src = `../brand/art/${SPR[n++ % SPR.length]}.webp`;
      img.alt = "";
      img.width = 120; img.height = 120;
      img.style.left = x + "px"; img.style.top = y + "px";
      img.style.setProperty("--s", Math.round(70 + Math.random() * 60) + "px");
      garden.append(img);
      if (garden.children.length > 16) garden.firstElementChild.remove();
    };
    stage.addEventListener("click", (e) => {
      if (e.target.closest("a, button, h1, p, .lana")) return;
      const r = stage.getBoundingClientRect();
      plant(e.clientX - r.left, e.clientY - r.top);
    });
    $("#plant").addEventListener("click", () => {
      const r = stage.getBoundingClientRect();
      const side = n % 2 ? 0.06 + Math.random() * 0.2 : 0.74 + Math.random() * 0.2;
      plant(r.width * side, r.height * (0.55 + Math.random() * 0.25));
    });
  }

  /* ---------- cabinet ---------- */
  const mc = $("#m-cabinet");
  if (mc) {
    const D = [
      { id: "brands", t: "Branding", img: "/work/sm/acm-revival.webp", line: "10 brands, each with its pubmats." },
      { id: "posters", t: "Posters", img: "/work/sm/cs-night.webp", line: "12 one-off posters, pinned to the wall." },
      { id: "films", t: "Films", img: "/work/sm/brenia-18.webp", line: "10 edits, from trailers to a documentary." },
      { id: "products", t: "Products", img: "/work/psyclick/app-dashboard-sm.webp", line: "4 apps I designed and built." },
      { id: "about", t: "About", img: "/work/lana-portrait.webp", line: "Manila, they/them, UI/UX intern." },
      { id: "talk", t: "Contact", img: "/work/sm/pride-month.webp", line: "Open to work. I reply within two days." },
    ];
    mc.innerHTML = `
      <div class="scrim left"></div>
      <div class="body cab-body">
        <div class="cab-text">
          <h2 class="display wear" id="cab-h">Six drawers of work</h2>
          <span class="sig">pick one, or keep walking</span>
          <p class="lede">Four years of brands, posters, films and apps, sorted the way a gardener sorts seeds. Every drawer opens a part of the garden ahead.</p>
          <div class="cab-acts"><button class="btn paper" type="button" id="cabTour">Guided tour</button></div>
          <div class="peek paper" aria-live="polite" id="peek"><img src="${D[0].img}" width="720" height="855" alt=""><div><b>${D[0].t}</b><p>${D[0].line}</p></div></div>
        </div>
        <div class="cab-wrap"><div class="cab" id="cab">
          <img src="../almanac/art/o_cabinet.webp" width="821" height="900" alt="An antique seed cabinet with six labelled drawers" loading="lazy">
          <img class="lana" src="art/lana.webp" width="520" height="520" alt="Lana's sticker" loading="lazy">
        </div></div>
      </div>`;
    ALM.wearAll(mc);
    $("#cabTour").addEventListener("click", () => $("#tour")?.click());

    const cols = [{ x: 9.5, w: 39.5 }, { x: 52.5, w: 39.5 }], rows = [11, 36.5, 62.2];
    const SP = ["p_bloom", "p_moon", "p_fly", "p_bud", "p_bloom", "p_moon"];
    const cab = $("#cab"), peek = $("#peek");
    D.forEach((s, i) => {
      const c = cols[i % 2], y = rows[Math.floor(i / 2)];
      const a = document.createElement("a");
      a.className = "dr";
      a.href = "#" + s.id;
      a.setAttribute("aria-label", `${s.t}: ${s.line}`);
      a.style.cssText = `left:${c.x}%;top:${y}%;width:${c.w}%;height:25%`;
      a.innerHTML = `<span class="hole"></span><img class="sprout" src="../brand/art/${SP[i]}.webp" width="120" height="120" alt=""><span class="front"><img src="art/drawer.webp" width="324" height="225" alt=""><span aria-hidden="true">${s.t}</span></span>`;
      const show = () => {
        $("img", peek).src = s.img;
        $("b", peek).textContent = s.t;
        $("p", peek).textContent = s.line;
      };
      a.addEventListener("pointerenter", show);
      a.addEventListener("focus", show);
      a.addEventListener("click", (e) => { e.preventDefault(); goTo(s.id); });
      cab.append(a);
    });
  }
})();
