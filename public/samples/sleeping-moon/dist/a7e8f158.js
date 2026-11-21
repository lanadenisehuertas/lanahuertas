(()=>{const{$:c,$$:o}=SM,n=e=>String(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),k={Jan:"January",Feb:"February",Mar:"March",Apr:"April",May:"May",Jun:"June",Jul:"July",Aug:"August",Sep:"September",Oct:"October",Nov:"November",Dec:"December"},M=e=>String(e).replace(/^([A-Z][a-z]{2})\b/,t=>k[t]||t),S=e=>e.map(n).join(", ").replace(/, ([^,]*)$/," and $1"),x=e=>/^[A-Z][a-z]/.test(e)?e.charAt(0).toLowerCase()+e.slice(1):e,a=BRAND,h=DATA.brands.length,A=DATA.brands[(BRAND_AT+h-1)%h],T=DATA.brands[(BRAND_AT+1)%h],[$,,l,b]=a.imgs[0],r=a.imgs.slice(1),g=a.imgs.map(([,e,t,s],i)=>({src:e,w:t,h:s,alt:`${a.name}, piece ${i+1}`,cap:a.name})),E='<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3h8v8M13 3L3 13"/></svg>',m=e=>[1,3,5].map(t=>parseInt(e.slice(t,t+2),16)),u=(e,t,s)=>"#"+m(e).map((i,p)=>Math.round(i+(m(t)[p]-i)*s).toString(16).padStart(2,"0")).join(""),v={"--ground":a.ground,"--ink":a.ink,"--text":"#ece6ff","--mark":"#fff1c9","--rule":u(a.ground,a.ink,.55)};Object.entries(v).forEach(([e,t])=>document.body.style.setProperty(e,t)),document.querySelector('meta[name="theme-color"]')?.setAttribute("content",a.ground),document.body.insertAdjacentHTML("afterbegin",`<div class="b-world" aria-hidden="true">${a.backdrop?`<span class="backdrop pic box" data-kind="photo" data-enter="manual" data-still data-flat data-cell="3" style="--ink:${u(a.ground,a.ink,.2)};--ground:${a.ground}"><img class="full" src="${a.backdrop}" srcset="${variant(a.backdrop,480)} 1x" width="1536" height="1024" alt="" decoding="async"></span>`:""}</div>`);const w=(e,t)=>{const[s,,i,p]=e.imgs[0];return`<a class="near" href="brand.html?b=${e.slug}" data-line="${n(e.tag)}">
      <span class="pic box" data-kind="photo" data-cell="1.4" style="aspect-ratio:${i} / ${p}"><img class="full" src="${s}" srcset="${srcsetOf(s,i)}" sizes="auto, (max-width: 760px) 46vw, (max-aspect-ratio: 1/1) 46vw, 24vw" width="${i}" height="${p}" alt="" loading="lazy" decoding="async"></span>
      <span class="n-line"><i>${t}.</i> ${n(e.name)}</span></a>`};c("#page").innerHTML=`
  <section class="stop b-stop" id="spec" data-label="I Brands" data-hint="${r.length?`${r.length} more ${r.length===1?"piece":"pieces"} below.`:"Two more brands below, either side of this one."}">
    <div class="b-board${a.name.split(" ").some(e=>e.length>9)?" b-long":""}">
      <div class="b-text">
        <h1 class="pk-name b-name">${n(a.name)}</h1>
        <p class="pk-meta">${n(a.org)}, ${n(M(a.date))}</p>
        <p class="pk-tag">${n(a.tag)}</p>
        <p class="say">${n(a.brief)}</p>
        <p class="say">${n(a.roles.map((e,t)=>t?x(e):e).join(", "))}. In ${S(a.tools)}.</p>
        <div class="swatches">${a.palette.map(e=>`<button class="swatch" type="button" style="--c:${e}" data-hex="${e}" aria-label="Copy ${e}"><i></i>${e.toLowerCase()}</button>`).join("")}</div>
        ${a.href?`<a class="go" href="${a.href}" target="_blank" rel="noopener">See the campaign post ${E}<span class="vh"> (opens a new tab)</span></a>`:""}
      </div>
      <div class="b-work">
        <div class="b-glow" aria-hidden="true" style="--glow:${a.ink}"></div>
        <button class="kv" type="button" id="kv" style="--a:${(l/b).toFixed(4)}" aria-label="Open the ${n(a.name)} key visual large">
          <span class="pic" data-kind="photo" data-main><img class="full" src="${$}" srcset="${srcsetOf($,l)}" sizes="${kvSizes(l/b,48)}" width="${l}" height="${b}" alt="${n(a.name)}, the key visual" fetchpriority="high"></span></button>
      </div>
    </div>
  </section>
  ${r.length?`<section class="stop b-stop" id="sheet" data-label="I Brands" data-hint="Open any piece to see it large." aria-labelledby="sheet-h">
    <h2 class="vh" id="sheet-h">More pieces from ${n(a.name)}</h2>
    <div class="b-board b-sheet">
      <div class="b-wall">${r.map(([e,,t,s],i)=>`<button class="piece" type="button" data-i="${i+1}" style="aspect-ratio:${t} / ${s}" aria-label="Open piece ${i+2} of ${a.imgs.length} large">
        <img src="${e}" srcset="${srcsetOf(e,t)}" sizes="auto, (max-width: 760px) 46vw, (max-aspect-ratio: 1/1) 46vw, 24vw" width="${t}" height="${s}" alt="" loading="lazy" decoding="async"></button>`).join("")}</div>
    </div>
  </section>`:""}
  <section class="stop b-stop b-end" id="onward" data-label="I Brands" data-hint="Two more brands, either side of this one." aria-labelledby="onward-h">
    <h2 class="vh" id="onward-h">The brands either side</h2>
    <div class="b-board b-onward">
      <div class="b-text"><a class="go" href="/#brands">All ten brands</a></div>
      <div class="b-near">${w(A,"Before")}${w(T,"After")}</div>
    </div>
  </section>`,o(".b-stop").forEach(e=>Object.entries(v).forEach(([t,s])=>e.style.setProperty(t,s)));const d=c(".b-world");SM.pictures(d).forEach(e=>e.load().then(()=>{e.show=1,e.draw()}).catch(()=>{}));let y=0,f=-1;SM.scrub(()=>{f!==SM.placedGen&&(f=SM.placedGen,y=document.documentElement.scrollHeight);const e=Math.max(1,y-SM.vh),s=(SM.y/e*2-1).toFixed(3);d._f!==s&&(d._f=s,d.style.setProperty("--f",s))}),SM.pictures(c("#page")),o(".b-board:not(.b-onward)").forEach(e=>SM.corners(e)),c("#kv").addEventListener("click",()=>SM.view(g,0)),o(".piece").forEach(e=>e.addEventListener("click",()=>SM.view(g,+e.dataset.i))),o(".near").forEach(e=>SM.wakeable(e,{line:e.dataset.line})),o(".swatch").forEach(e=>e.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(e.dataset.hex),SM.say(`Copied ${e.dataset.hex}`)}catch{SM.say(e.dataset.hex)}setTimeout(()=>SM.say(),1800)})),SM.start()})();
