const SOURCE = "https://x.com/viktoroddy/status/2099488750283923775";
const GITHUB = "https://github.com/AlexLisong/motion-study";
const studies = [
  {
    id: "keel",
    number: "01",
    name: "Keel",
    kind: "Digital experience",
    title: "A new perspective.",
    description: "Liquid chrome. Open skies. A different kind of presence.",
    time: "00:25",
    poster: "assets/keel.webp",
    color: "#557fbe",
  },
  {
    id: "next-move",
    number: "02",
    name: "Next Move",
    kind: "Future streetwear",
    title: "Made for the next move.",
    description: "An immersive campaign where motion leads the way.",
    time: "05:45",
    poster: "assets/next-move.webp",
    color: "#0d8c9a",
    video: "assets/next-move.mp4",
    scrub: true,
  },
  {
    id: "orla",
    number: "03",
    name: "Orla.",
    kind: "Independent fashion",
    title: "Room to be yourself.",
    description:
      "Expressive silhouettes, considered type, and room to breathe.",
    time: "08:00",
    poster: "assets/orla.webp",
    color: "#eeeae6",
    video: "assets/orla.mp4",
    scrub: true,
  },
  {
    id: "undr",
    number: "04",
    name: "Undr.",
    kind: "After-hours culture",
    title: "See you after dark.",
    description: "Red type, monochrome motion, and nothing unnecessary.",
    time: "09:55",
    poster: "assets/undr.webp",
    color: "#131313",
    video: "assets/undr.mp4",
  },
];
let currentCleanup = () => {};
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
let motionPaused = motionPreference.matches;
let bag = [];
const app = document.querySelector("#app");
const arrow = '<span aria-hidden="true">↗</span>';
const link = (id) => `?study=${id}`;
const external = (url, text) =>
  `<a href="${url}" target="_blank" rel="noopener noreferrer">${text} ${arrow}</a>`;

function media(s, extra = "") {
  return `<div class="scene ${extra}" aria-hidden="true"><img src="${s.poster}" alt="" fetchpriority="high">${s.video ? `<video muted playsinline preload="metadata" poster="${s.poster}" data-video-src="${s.video}"></video>` : ""}</div>`;
}

function gallery() {
  document.title = "Motion Study — An independent interface collection";
  document.body.className = "gallery-page";
  app.innerHTML = `
    <header class="gallery-header"><a class="wordmark" href="./" aria-label="Motion Study home"><span class="mark">m/s</span> MOTION STUDY</a><span class="header-note">Independent interface explorations</span>${external(GITHUB, "View source")}</header>
    <main id="main">
      <section class="gallery-intro"><div><p class="eyebrow">COLLECTION 001 / SEPTEMBER 2026</p><h1>Good design.<br><span>Great moves.</span></h1></div><div class="intro-aside"><p>Four different worlds.<br>One collection of interfaces<br>you can actually explore.</p><a href="#studies" class="text-link">Explore the studies <span aria-hidden="true">↓</span></a></div></section>
      <div class="collection-bar" id="studies"><span>SELECTED STUDIES</span><span>01 — 04</span></div>
      <section class="study-grid" aria-label="Interface studies">${studies
        .map(
          (s) => `
        <a class="study-card" href="${link(s.id)}" aria-label="Explore ${s.name}: ${s.kind}">
          <div class="study-preview preview-${s.id}" style="--scene-color:${s.color}"><img src="${s.poster}" alt="" loading="${s.number === "01" || s.number === "02" ? "eager" : "lazy"}"><span class="preview-index">${s.number} / INTERACTIVE STUDY</span>${previewType(s)}<span class="preview-open" aria-hidden="true">↗</span></div>
          <div class="study-caption"><div><h2>${s.name}</h2><p>${s.kind}</p></div><span class="study-detail">Explore study ${arrow}</span></div>
        </a>`,
        )
        .join("")}</section>
      <section class="reference-note" id="about"><span class="eyebrow">THE STARTING POINT</span><p>Inspired by Viktor Oddy’s walkthrough.<br>Rebuilt as four independent, interactive studies.</p>${external(SOURCE, "Watch the reference")}</section>
    </main>
    <footer class="gallery-footer"><span>MOTION STUDY © 2026</span><span>Curated & built for Alex Lisong</span><a href="#main">Back to top ↑</a></footer>`;
}

function previewType(s) {
  if (s.id === "keel")
    return '<span class="mini-keel-brand">keel<span>®</span></span><span class="mini-keel-title">A little beyond<br>the ordinary.</span><span class="mini-keel-bottom">A NEW PERSPECTIVE — EST. 2026</span>';
  if (s.id === "next-move")
    return '<span class="mini-next-title">YOUR NEXT<br>MOVE.</span><span class="mini-next-tag">DROP 001 / IN MOTION</span><span class="mini-next-bottom">BUILT FOR WHATEVER’S NEXT. ↗</span>';
  if (s.id === "orla")
    return '<span class="mini-orla-brand">Orla.</span><span class="mini-orla-copy">Clothes for the way<br>you want to feel.</span><span class="mini-orla-bottom">COLLECTION 01 — EVERYDAY, DIFFERENT.</span>';
  return '<span class="mini-undr-brand">Undr.</span><span class="mini-undr-cross">+</span><span class="mini-undr-bottom">Drift.</span><span class="mini-undr-date">23.04 &nbsp; / &nbsp; 00:30</span>';
}

function toolbar(selected) {
  return `<header class="study-toolbar"><a href="./" class="back-link">← <span>All studies</span></a><nav aria-label="Choose a study">${studies.map((s) => `<a href="${link(s.id)}" ${s.id === selected.id ? 'aria-current="page"' : ""}><span>${s.number}</span> ${s.name}</a>`).join("")}</nav><button class="motion-toggle" aria-pressed="${motionPaused}"><span aria-hidden="true">${motionPaused ? "▶" : "Ⅱ"}</span><span class="motion-label">${motionPaused ? "Play motion" : "Pause motion"}</span></button></header>`;
}

function keel(s) {
  return `<main id="main" class="keel-demo"><section class="keel-hero">${media(s)}<div class="keel-grid" aria-hidden="true"></div><nav class="keel-nav" aria-label="Keel navigation"><a href="#main" class="keel-logo">keel<sup>®</sup></a><span>INDEPENDENT MINDS.<br>EXTRAORDINARY POSSIBILITIES.</span><a class="pill pill-dark" href="#perspective">A new perspective ${arrow}</a></nav><div class="keel-hero-copy"><p class="eyebrow">FOR WHAT COMES NEXT</p><h1>A little beyond<br><em>the ordinary.</em></h1><p>New ideas need room to become.<br>We make space for yours.</p><a class="keel-explore" href="#perspective">Discover a new perspective <span>↗</span></a></div><div class="keel-coordinate"><span>51°30′26.4″N</span><span>00°07′39.6″W</span></div><div class="keel-bottom"><span>A PLACE FOR POSSIBILITIES</span><a href="#perspective">Keep looking ↓</a><span>01 — 02</span></div></section><section class="keel-perspective" id="perspective"><p class="eyebrow">A DIFFERENT POINT OF VIEW</p><h2>Progress rarely<br>moves in a straight line.</h2><div class="keel-columns"><p>Somewhere between the familiar and the unexpected, a new idea takes shape. Give it a little space.</p><p>Keel is a study in contrast: fluid imagery, precise structure, and typography with room to breathe.</p></div><a class="pill pill-light" href="${link("next-move")}">Next study: Next Move ${arrow}</a></section></main>`;
}

function nextMove(s) {
  return `<main id="main" class="next-demo"><div class="next-world">${media(s)}<section class="next-hero"><nav class="next-nav" aria-label="Next Move navigation"><a class="next-logo" href="#main">N/M<span>®</span></a><a href="#the-drop">THE DROP ↗</a><button class="bag-button">BAG <span data-bag-count>00</span></button></nav><div class="next-headline"><p class="eyebrow">COLLECTION 001 — NO STANDING STILL</p><h1>YOUR<br>NEXT MOVE.</h1></div><div class="next-side">MOVE DIFFERENT.<br>STAY YOURSELF.<br><span>35.6762° N / 139.6503° E</span></div><a href="#the-drop" class="next-scroll">SCROLL TO MOVE <span>↓</span></a><span class="next-edition">FUTURE UNIFORM / 2026</span></section><section class="next-products" id="the-drop"><div class="next-section-heading"><h2>THE EVERYDAY.<br>REIMAGINED.</h2><span>THREE PIECES. ENDLESS POSSIBILITIES.</span></div><div class="product-grid">${[
    {
      name: "Aero Shell",
      type: "01 / OUTERWEAR",
      price: 180,
      desc: "Lightweight layers. Heavy on attitude.",
    },
    {
      name: "Drift Cargo",
      type: "02 / BOTTOMS",
      price: 120,
      desc: "Room to move. Built to go anywhere.",
    },
    {
      name: "Flux Runner",
      type: "03 / FOOTWEAR",
      price: 160,
      desc: "A new perspective from the ground up.",
    },
  ]
    .map(
      (p, i) =>
        `<article class="product"><div class="product-number">${p.type}</div><h3>${p.name}</h3><p>${p.desc}</p><button class="product-button" data-product="${i}"><span>Explore — $${p.price}</span><span>↗</span></button></article>`,
    )
    .join(
      "",
    )}</div><div class="next-footer"><span>THIS IS A CONCEPT STORE. ALL BAG ACTIONS ARE LOCAL DEMOS.</span><a href="${link("orla")}">Next study: Orla ↗</a></div></section></div></main>`;
}

function orla(s) {
  return `<main id="main" class="orla-demo"><section class="orla-hero">${media(s)}<nav class="orla-nav" aria-label="Orla navigation"><h1 class="orla-logo"><a href="#main">Orla.</a></h1><div><a href="#collection">Collection</a><a href="#our-note">Our note</a><a href="#collection">Explore ↗</a></div></nav><div class="orla-copy"><p>Considered pieces made<br>to move through life.</p><p>Wear them your way.<br>Feel a little more yourself.</p></div><div class="orla-subtitle"><span>LESS EXPECTATION.<br>MORE EXPRESSION.</span></div><div class="orla-hero-footer"><a href="#collection" class="pill pill-light">See the collection ${arrow}</a><span>EVERYDAY, DIFFERENT.</span><a href="#our-note">A note from Orla ↓</a></div></section><section class="orla-collection" id="collection"><div class="orla-collection-top"><p class="eyebrow">COLLECTION 01</p><h2>Nothing to prove.<br><em>Everything to feel.</em></h2></div><div class="orla-tabs" role="tablist" aria-label="Collection looks"><button role="tab" id="look-tab-0" aria-selected="true" aria-controls="look-panel" data-look="0">01 / Soft structure</button><button role="tab" id="look-tab-1" aria-selected="false" aria-controls="look-panel" tabindex="-1" data-look="1">02 / In between</button><button role="tab" id="look-tab-2" aria-selected="false" aria-controls="look-panel" tabindex="-1" data-look="2">03 / Off duty</button></div><div class="orla-look" id="look-panel" role="tabpanel" aria-labelledby="look-tab-0"><span class="look-number">01</span><div><h3>Soft structure</h3><p>Relaxed shapes. A little texture. Pieces that find their own rhythm.</p></div><span class="look-material">COTTON / LINEN<br>WORN YOUR WAY</span></div></section><section class="orla-note" id="our-note"><p class="eyebrow">A NOTE FROM ORLA</p><p>Getting dressed should feel like coming back to yourself.</p><a class="text-link" href="${link("undr")}">Next study: Undr ${arrow}</a></section></main>`;
}

function undr(s) {
  return `<main id="main" class="undr-demo"><section class="undr-hero">${media(s)}<div class="undr-noise" aria-hidden="true"></div><nav class="undr-nav" aria-label="Undr navigation"><a href="#main" class="undr-logo">Undr.</a><a href="#nights">AFTER HOURS.<br>OUT OF SIGHT. ↗</a></nav><div class="undr-line"><span>Late night</span><span>Closed lot</span><span>Sideways</span></div><div class="undr-date"><span>23.04</span><span class="undr-cross" aria-hidden="true">+</span><span>00:30</span></div><div class="undr-bottom"><a href="#nights">FIND YOUR NIGHT ↓</a><h1>Drift.</h1></div></section><section class="undr-statement"><p>One closed lot, no lights but the city’s. Cars that have no business being this sideways, and a crowd that knows not to post.</p><div><span>NO LIST. NO STATUS.</span><p>You hear about it, you pull up.<br>The lot stays two hours before.</p></div></section><section class="undr-nights" id="nights"><details><summary>Rules<span>+</span></summary><div class="undr-details"><p>Respect the space. Respect each other. Keep it off the feed.</p><p>This is a fictional design study. No real-world event is being organised.</p></div></details><details open><summary>Nights<span>+</span></summary><div class="night-row"><span>01 / CLOSED LOT</span><span>23 APRIL</span><span>00:30 — LATE</span><span>FICTIONAL EVENT</span></div><div class="night-row"><span>02 / UNDERPASS</span><span>07 MAY</span><span>01:00 — LATE</span><span>FICTIONAL EVENT</span></div></details><details><summary>Pull up<span>+</span></summary><div class="undr-details"><p>Some things only happen after dark.</p><a class="pill pill-light" href="./">Back to the collection ${arrow}</a></div></details></section><footer class="undr-footer"><span>UNDR. © 2026</span><span>LEAVE NOTHING BEHIND.</span><a href="./">All studies ↗</a></footer></main>`;
}

function render() {
  currentCleanup();
  const id = new URL(location.href).searchParams.get("study");
  const s = studies.find((study) => study.id === id);
  if (!s) {
    gallery();
    return;
  }
  document.title = `${s.name} — Motion Study`;
  document.body.className = `case-page case-${s.id}${motionPaused ? " motion-paused" : ""}`;
  const templates = { keel, "next-move": nextMove, orla, undr };
  app.innerHTML =
    toolbar(s) +
    templates[s.id](s) +
    '<div class="demo-status" role="status" aria-live="polite"></div>';
  setupMotion(s);
  setupInteractions(s);
}

function setupMotion(s) {
  const video = app.querySelector("video");
  const scene = app.querySelector(".scene");
  const toggle = app.querySelector(".motion-toggle");
  let frame = 0;
  function update() {
    frame = 0;
    if (motionPaused) return;
    const heroHeight = Math.max(
      1,
      innerHeight - app.querySelector(".study-toolbar").offsetHeight,
    );
    const progress = Math.min(1, Math.max(0, scrollY / heroHeight));
    if (
      video &&
      s.scrub &&
      Number.isFinite(video.duration) &&
      video.readyState >= 2
    ) {
      const time = Math.min(video.duration - 0.05, progress * video.duration);
      if (Math.abs(video.currentTime - time) > 0.045 && !video.seeking)
        video.currentTime = time;
    }
    if (!video && scene) scene.style.setProperty("--drift", `${progress * 4}%`);
  }
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  function loadVideo() {
    if (video && !video.getAttribute("src")) {
      video.muted = true;
      video.src = video.dataset.videoSrc;
      video.addEventListener(
        "loadeddata",
        () => {
          if (motionPaused) return;
          video.classList.add("is-ready");
          if (!s.scrub) {
            video.loop = true;
            video.play().catch(() => video.classList.remove("is-ready"));
          }
          update();
        },
        { once: true },
      );
      video.addEventListener(
        "error",
        () => {
          video.classList.remove("is-ready");
        },
        { once: true },
      );
    }
  }
  if (!motionPaused) loadVideo();
  function setMotionPaused(paused) {
    motionPaused = paused;
    document.body.classList.toggle("motion-paused", motionPaused);
    toggle.setAttribute("aria-pressed", String(motionPaused));
    toggle.innerHTML = `<span aria-hidden="true">${motionPaused ? "▶" : "Ⅱ"}</span><span class="motion-label">${motionPaused ? "Play motion" : "Pause motion"}</span>`;
    if (motionPaused) {
      video?.pause();
    } else {
      loadVideo();
      if (video?.readyState >= 2) {
        video.classList.add("is-ready");
        if (!s.scrub)
          video.play().catch(() => video.classList.remove("is-ready"));
      }
      update();
    }
  }
  toggle.addEventListener("click", () => setMotionPaused(!motionPaused));
  const onPreferenceChange = (event) => setMotionPaused(event.matches);
  motionPreference.addEventListener("change", onPreferenceChange);
  if (video && s.scrub) video.addEventListener("seeked", onScroll);
  addEventListener("scroll", onScroll, { passive: true });
  currentCleanup = () => {
    removeEventListener("scroll", onScroll);
    motionPreference.removeEventListener("change", onPreferenceChange);
    cancelAnimationFrame(frame);
    if (video) {
      video.removeEventListener("seeked", onScroll);
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  };
  update();
}

const products = [
  {
    name: "Aero Shell",
    price: 180,
    description:
      "A lightweight outer layer with a relaxed fit and weather-ready finish.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    name: "Drift Cargo",
    price: 120,
    description:
      "A wide-leg silhouette with generous pockets and room to move.",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    name: "Flux Runner",
    price: 160,
    description:
      "An everyday runner with an exaggerated sole and a light-on-your-feet feel.",
    sizes: ["US 6", "US 7", "US 8", "US 9", "US 10", "US 11"],
  },
];
function openDialog(content, trigger) {
  const dialog = document.createElement("dialog");
  dialog.className = "product-dialog";
  dialog.setAttribute("aria-labelledby", "dialog-title");
  dialog.innerHTML = `<button class="dialog-close" aria-label="Close dialog">×</button>${content}`;
  document.body.append(dialog);
  const close = () => dialog.close();
  dialog.querySelector(".dialog-close").addEventListener("click", close);
  dialog.addEventListener("click", (e) => {
    if (
      e.target === dialog &&
      (e.clientX < dialog.getBoundingClientRect().left ||
        e.clientX > dialog.getBoundingClientRect().right ||
        e.clientY < dialog.getBoundingClientRect().top ||
        e.clientY > dialog.getBoundingClientRect().bottom)
    )
      close();
  });
  dialog.addEventListener("close", () => {
    dialog.remove();
    trigger?.focus();
  });
  dialog.showModal();
  return dialog;
}
function setupInteractions(s) {
  if (s.id === "next-move") {
    const updateBag = () =>
      (app.querySelector("[data-bag-count]").textContent = String(
        bag.length,
      ).padStart(2, "0"));
    updateBag();
    app.querySelectorAll("[data-product]").forEach((button) =>
      button.addEventListener("click", () => {
        const p = products[Number(button.dataset.product)];
        const dialog = openDialog(
          `<p class="eyebrow">NEXT MOVE / DROP 001</p><h2 id="dialog-title">${p.name}</h2><p>${p.description}</p><form><fieldset><legend>Select your size</legend><div class="size-options">${p.sizes.map((size, i) => `<label><input type="radio" name="size" value="${size}" required ${i === 2 ? "checked" : ""}><span>${size}</span></label>`).join("")}</div></fieldset><button class="add-to-bag" type="submit">Add to demo bag — $${p.price} ↗</button></form><small>Interactive concept. No payment or order is placed.</small>`,
          button,
        );
        dialog.querySelector("form").addEventListener("submit", (e) => {
          e.preventDefault();
          bag.push({ ...p, size: new FormData(e.currentTarget).get("size") });
          updateBag();
          dialog.close();
          const status = app.querySelector(".demo-status");
          status.textContent = `${p.name} added to your demo bag.`;
          setTimeout(() => {
            if (status.isConnected) status.textContent = "";
          }, 4000);
        });
      }),
    );
    app.querySelector(".bag-button").addEventListener("click", (e) => {
      const showBag = () =>
        `<p class="eyebrow">NEXT MOVE / LOCAL DEMO</p><h2 id="dialog-title">Your bag (${bag.length})</h2>${bag.length ? `<ul class="bag-items">${bag.map((p, i) => `<li><div><strong>${p.name}</strong><span>${p.size} / $${p.price}</span></div><button data-remove="${i}" aria-label="Remove ${p.name}, ${p.size}">Remove</button></li>`).join("")}</ul><div class="bag-total"><span>Total</span><strong>$${bag.reduce((sum, p) => sum + p.price, 0)}</strong></div>` : "<p>Your next move starts with the first piece.</p>"}<small>This is a local demo bag. There is no checkout.</small>`;
      const dialog = openDialog(showBag(), e.currentTarget);
      dialog.addEventListener("click", (event) => {
        const button = event.target.closest("[data-remove]");
        if (!button) return;
        const index = Number(button.dataset.remove);
        bag.splice(index, 1);
        updateBag();
        dialog
          .querySelectorAll(":scope > :not(.dialog-close)")
          .forEach((el) => el.remove());
        dialog.insertAdjacentHTML("beforeend", showBag());
        (
          dialog.querySelector("[data-remove]") ||
          dialog.querySelector(".dialog-close")
        ).focus();
      });
    });
  }
  if (s.id === "orla") {
    const looks = [
      [
        "Soft structure",
        "Relaxed shapes. A little texture. Pieces that find their own rhythm.",
        "COTTON / LINEN",
      ],
      [
        "In between",
        "Layers for the unplanned hours. Soft colour, easy movement, your own combinations.",
        "KNIT / ORGANIC COTTON",
      ],
      [
        "Off duty",
        "A slower pace. Familiar favourites with just enough of the unexpected.",
        "DENIM / SOFT JERSEY",
      ],
    ];
    const tabs = [...app.querySelectorAll("[data-look]")];
    function selectLook(index) {
      tabs.forEach((tab, i) => {
        tab.setAttribute("aria-selected", String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      const panel = app.querySelector("#look-panel");
      panel.setAttribute("aria-labelledby", `look-tab-${index}`);
      panel.innerHTML = `<span class="look-number">0${index + 1}</span><div><h3>${looks[index][0]}</h3><p>${looks[index][1]}</p></div><span class="look-material">${looks[index][2]}<br>WORN YOUR WAY</span>`;
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => selectLook(index));
      tab.addEventListener("keydown", (e) => {
        let next;
        if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (e.key === "ArrowLeft")
          next = (index + tabs.length - 1) % tabs.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = tabs.length - 1;
        if (next !== undefined) {
          e.preventDefault();
          selectLook(next);
          tabs[next].focus();
        }
      });
    });
  }
}
render();
