const COMMON_ART = {
  report: "https://loveones-teacherday.netlify.app/asset_report_card.png",
  letter: "https://loveones-teacherday.netlify.app/asset_envelope.png",
  diary: "https://loveones-teacherday.netlify.app/asset_book.png",
  memory1: "https://loveones-teacherday.netlify.app/polaroid_1.png",
  memory2: "https://loveones-teacherday.netlify.app/polaroid_2.png",
  memory3: "https://loveones-teacherday.netlify.app/polaroid_3.png"
};

const BASE_CONTENT = {
  report: {
    kicker: "Teacher's Report Card",
    title: "A+++ Teacher",
    message: "For patience, guidance, encouragement and the little moments that make learning memorable.",
    bullets: ["Guidance: Outstanding", "Patience: A+++", "Inspiration: 100/100"]
  },
  letter: {
    kicker: "A special letter for you",
    title: "Thank You",
    message: "Your words stay with us long after the lesson ends. Thank you for teaching with heart.",
    bullets: ["For believing in us", "For making every class matter", "For inspiring us to do better"]
  },
  diary: {
    kicker: "Lessons • Memories • Little Things",
    title: "What You Taught Us",
    message: "Some lessons live beyond the classroom: confidence, curiosity, discipline and kindness.",
    bullets: ["Lessons we remember", "Memories we keep", "Little things that mattered"]
  },
  memory1: {
    kicker: "Precious moments",
    title: "A Classroom Full of Smiles",
    message: "A place where ordinary school days became moments worth remembering.", bullets: []
  },
  memory2: {
    kicker: "A note from the heart",
    title: "Thank You ❤️",
    message: "For every explanation, every correction and every encouraging word.", bullets: []
  },
  memory3: {
    kicker: "Best memories",
    title: "Moments We Keep",
    message: "The smallest classroom moments often become the biggest memories.", bullets: []
  }
};

const TEACHERS = {
  shahid: { name: "Shahid Sir", sign: "With heartfelt gratitude" },
  sakti: { name: "Sakti Sir", sign: "With heartfelt gratitude" },
  sameer: { name: "Sameer Sir", sign: "With heartfelt gratitude" },
  naila: { name: "Naila Ma'am", sign: "With heartfelt gratitude" },
  mitanjali: { name: "Mitanjali Ma'am", sign: "With heartfelt gratitude" },
  sanjeeda: { name: "Sanjeeda Ma'am", sign: "With heartfelt gratitude" },
  rupali: { name: "Rupali Ma'am", sign: "With heartfelt gratitude" },
  saraswati: { name: "Saraswati Ma'am", sign: "With heartfelt gratitude" },
  sumitra: { name: "Sumitra Ma'am", sign: "With heartfelt gratitude" },
  fatima: { name: "Fatima Ma'am", sign: "With heartfelt gratitude" }
};

const teacherKey = new URLSearchParams(location.search).get("teacher") || "shahid";
const teacher = TEACHERS[teacherKey] || TEACHERS.shahid;

const els = {
  welcomeScreen: document.getElementById("welcomeScreen"),
  welcomeName: document.getElementById("teacherNameWelcome"),
  blackboardTeacher: document.getElementById("blackboardTeacher"),
  enterBtn: document.getElementById("enterBtn"),
  corridor: document.getElementById("corridorScene"),
  classroom: document.getElementById("classroomScene"),
  stage: document.getElementById("classroomStage"),
  zoomBtn: document.getElementById("zoomBtn"),
  lookAround: document.getElementById("lookAround"),
  focusRing: document.getElementById("focusRing"),
  modalLayer: document.getElementById("modalLayer"),
  modalClose: document.getElementById("modalClose"),
  modalBackdrop: document.getElementById("modalBackdrop"),
  detailArt: document.getElementById("detailArt"),
  artLoading: document.getElementById("artLoading"),
  detailKicker: document.getElementById("detailKicker"),
  detailTitle: document.getElementById("detailTitle"),
  detailMessage: document.getElementById("detailMessage"),
  detailBullets: document.getElementById("detailBullets"),
  footerTeacher: document.getElementById("footerTeacher"),
  copyLinkBtn: document.getElementById("copyLinkBtn"),
  soundBtn: document.getElementById("soundBtn"),
  dots: [...document.querySelectorAll(".progress-dots .dot")]
};

els.welcomeName.textContent = teacher.name;
els.blackboardTeacher.textContent = `Thank You, ${teacher.name}!`;
els.footerTeacher.textContent = teacher.name;

document.title = `Happy Teacher's Day — ${teacher.name} ✨`;

let soundOn = true;
let audioCtx = null;
let masterGain = null;
let stageZoomed = false;
let openedModal = false;

// V3: use the first tap/click as the user gesture for fullscreen.
// Browsers intentionally block unsolicited fullscreen requests, so we do this
// from the Enter button rather than attempting it on orientationchange alone.
async function enterImmersiveMode() {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen({ navigationUI: "hide" });
    }
  } catch (_) {
    // Fullscreen may be unavailable (notably on some iOS browsers).
  }
  try {
    if (screen.orientation?.lock) await screen.orientation.lock("landscape");
  } catch (_) {
    // Orientation lock is optional; the CSS portrait gate remains as fallback.
  }
  syncViewport();
}

function syncViewport() {
  // Recalculate camera transform after rotation/fullscreen to prevent the old
  // portrait viewport from leaving letterboxing or misaligned hotspots.
  requestAnimationFrame(() => {
    if (!stageZoomed && !openedModal) els.stage.style.transform = "";
  });
}

function initAudio() {
  if (audioCtx) return;
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return;
  audioCtx = new C();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = soundOn ? 0.8 : 0;
  masterGain.connect(audioCtx.destination);
}
function unlockAudio() {
  initAudio();
  if (audioCtx?.state === "suspended") audioCtx.resume();
}
function tone(freq = 660, duration = 0.3, volume = 0.055) {
  if (!soundOn) return;
  unlockAudio();
  if (!audioCtx || !masterGain) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  const t = audioCtx.currentTime;
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.28, t + duration);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(volume, t + 0.025);
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(g).connect(masterGain);
  osc.start(t);
  osc.stop(t + duration + 0.02);
}
function successChime() {
  tone(620, .28, .05);
  window.setTimeout(() => tone(820, .35, .04), 75);
}

function activateScene(fromEl, toEl, activeDotIndex) {
  fromEl.classList.remove("is-active");
  toEl.classList.add("is-active");
  fromEl.setAttribute("aria-hidden", "true");
  toEl.setAttribute("aria-hidden", "false");
  els.dots.forEach((dot, i) => dot.classList.toggle("is-active", i === activeDotIndex));
}

function focusOnPoint(button) {
  const rect = button.getBoundingClientRect();
  els.focusRing.style.left = `${rect.left + rect.width / 2}px`;
  els.focusRing.style.top = `${rect.top + rect.height / 2}px`;
  els.focusRing.classList.add("is-visible");
}
function clearFocus() {
  els.focusRing.classList.remove("is-visible");
}

function setZoomed(value) {
  stageZoomed = Boolean(value);
  els.stage.classList.toggle("zoomed", stageZoomed);
  els.zoomBtn.setAttribute("aria-pressed", String(stageZoomed));
  els.zoomBtn.innerHTML = stageZoomed ? "Reset <b>↺</b>" : "<span>Zoom</span><b>➜</b>";
  els.lookAround.classList.toggle("is-hidden", stageZoomed);
  if (!stageZoomed) els.stage.style.transform = "";
  tone(stageZoomed ? 540 : 460, .22, .035);
}

els.enterBtn.addEventListener("click", async () => {
  unlockAudio();
  // Request fullscreen while the click is still an active user gesture.
  await enterImmersiveMode();
  successChime();
  els.welcomeScreen.classList.add("leaving");
  window.setTimeout(() => activateScene(els.corridor, els.classroom, 1), 320);
  window.setTimeout(() => {
    els.welcomeScreen.classList.remove("leaving");
    syncViewport();
  }, 1050);
});

els.zoomBtn.addEventListener("click", () => setZoomed(!stageZoomed));

document.querySelectorAll(".hotspot").forEach((hotspot) => {
  hotspot.addEventListener("mouseenter", () => focusOnPoint(hotspot));
  hotspot.addEventListener("mouseleave", clearFocus);
  hotspot.addEventListener("focus", () => focusOnPoint(hotspot));
  hotspot.addEventListener("blur", clearFocus);
  hotspot.addEventListener("click", () => openModal(hotspot.dataset.modal, hotspot));
});

function createContent(key) {
  const base = BASE_CONTENT[key];
  if (!base) return null;
  return {
    ...base,
    art: COMMON_ART[key],
    title: key === "letter" ? `Thank You, ${teacher.name}` : base.title,
    message: base.message.replaceAll("Teacher", teacher.name),
    bullets: key === "report"
      ? [`Guidance: Outstanding`, `Patience with us: A+++`, `Inspiration: 100/100`]
      : base.bullets
  };
}

function openModal(key, sourceButton) {
  const item = createContent(key);
  if (!item) return;
  openedModal = true;
  if (sourceButton) sourceButton.classList.add("is-active");
  els.detailArt.classList.remove("is-loaded");
  els.artLoading.style.opacity = "1";
  els.detailArt.onload = () => els.detailArt.classList.add("is-loaded");
  els.detailArt.onerror = () => { els.artLoading.textContent = "🖼️"; };
  els.detailArt.src = item.art;
  els.detailArt.alt = item.title;
  els.detailKicker.textContent = item.kicker;
  els.detailTitle.textContent = item.title;
  els.detailMessage.textContent = item.message;
  els.detailBullets.innerHTML = (item.bullets || []).map((x) => `<div>✦ ${x}</div>`).join("");
  els.modalLayer.classList.add("is-open");
  els.modalLayer.setAttribute("aria-hidden", "false");
  document.body.dataset.modalOpen = "true";
  successChime();
  window.setTimeout(() => els.modalClose.focus({ preventScroll: true }), 50);
}

function closeModal() {
  openedModal = false;
  els.modalLayer.classList.remove("is-open");
  els.modalLayer.setAttribute("aria-hidden", "true");
  document.body.dataset.modalOpen = "false";
  document.querySelectorAll(".hotspot.is-active").forEach((el) => el.classList.remove("is-active"));
  window.setTimeout(clearFocus, 180);
}

els.modalClose.addEventListener("click", closeModal);
els.modalBackdrop.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && openedModal) closeModal();
  if (e.key === "Enter" && document.activeElement?.classList.contains("hotspot")) document.activeElement.click();
});

els.soundBtn.addEventListener("click", () => {
  unlockAudio();
  soundOn = !soundOn;
  if (masterGain) masterGain.gain.value = soundOn ? 0.8 : 0;
  els.soundBtn.textContent = soundOn ? "🔊" : "🔇";
  els.soundBtn.setAttribute("aria-pressed", String(soundOn));
  els.soundBtn.setAttribute("aria-label", soundOn ? "Turn sound off" : "Turn sound on");
  if (soundOn) tone(720, .18, .035);
});

els.copyLinkBtn.addEventListener("click", async () => {
  const url = `${location.origin}${location.pathname}?teacher=${encodeURIComponent(teacherKey)}`;
  try {
    await navigator.clipboard.writeText(url);
    els.copyLinkBtn.textContent = "Copied ✓";
  } catch {
    window.prompt("Copy this Teacher's Day link:", url);
  }
  window.setTimeout(() => { els.copyLinkBtn.textContent = "Copy Link"; }, 1700);
});

// Desktop-only camera parallax; disabled during focus/zoom to keep object alignment stable.
if (window.matchMedia("(pointer:fine)").matches) {
  window.addEventListener("pointermove", (e) => {
    if (!els.classroom.classList.contains("is-active") || stageZoomed || openedModal) return;
    const x = (e.clientX / window.innerWidth - .5) * 2;
    const y = (e.clientY / window.innerHeight - .5) * 2;
    els.stage.style.transform = `translate3d(${x * -4}px, ${y * -3}px, 0)`;
  }, { passive: true });
}

// Light touch drag gives the classroom a subtle camera feel without moving hotspots independently.
let touchStart = null;
els.stage.addEventListener("touchstart", (e) => {
  if (e.touches.length !== 1 || stageZoomed) return;
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}, { passive: true });
els.stage.addEventListener("touchend", (e) => {
  if (!touchStart || stageZoomed) return;
  const dx = e.changedTouches[0].clientX - touchStart.x;
  if (Math.abs(dx) > 70) els.stage.style.transform = `translate3d(${Math.sign(dx) * 7}px,0,0)`;
  window.setTimeout(() => { if (!stageZoomed) els.stage.style.transform = ""; }, 380);
  touchStart = null;
}, { passive: true });

// Keep the greeting valid if the URL contains an unknown teacher key.
if (!TEACHERS[teacherKey]) history.replaceState({}, "", `${location.pathname}?teacher=shahid`);


// V3 viewport synchronization: rotation and browser chrome changes can alter
// the visual viewport even when the document remains the same size.
window.addEventListener("orientationchange", () => window.setTimeout(syncViewport, 120));
window.addEventListener("resize", syncViewport, { passive: true });
document.addEventListener("fullscreenchange", syncViewport);
