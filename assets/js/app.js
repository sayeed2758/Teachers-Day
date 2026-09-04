const TEACHERS = {
  shahid: {
    name: "Shahid Sir",
    intro: "YOU",
    report: {
      kicker: "Teacher's Report Card",
      title: "A+++ Teacher",
      message: "For patience, guidance, encouragement and the little moments that make learning memorable.",
      art: "https://loveones-teacherday.netlify.app/asset_report_card.png",
      bullets: ["Guidance: Outstanding", "Patience: A+++", "Inspiration: 100/100"]
    },
    letter: {
      kicker: "A special letter for you",
      title: "Thank You, Shahid Sir",
      message: "Your words stay with us long after the lesson ends. Thank you for teaching with heart.",
      art: "https://loveones-teacherday.netlify.app/asset_envelope.png",
      bullets: ["For believing in us", "For making every class matter", "For inspiring us to do better"]
    },
    diary: {
      kicker: "Lessons • Memories • Little Things",
      title: "What You Taught Us",
      message: "Some lessons live beyond the classroom: confidence, curiosity, discipline and kindness.",
      art: "https://loveones-teacherday.netlify.app/asset_book.png",
      bullets: ["Lessons we remember", "Memories we keep", "Little things that mattered"]
    },
    memory1: { kicker: "Precious moments", title: "A Classroom Full of Smiles", message: "A place where ordinary school days became moments worth remembering.", art: "https://loveones-teacherday.netlify.app/polaroid_1.png", bullets: [] },
    memory2: { kicker: "A note from the heart", title: "Thank You ❤️", message: "For every explanation, every correction and every encouraging word.", art: "https://loveones-teacherday.netlify.app/polaroid_2.png", bullets: [] },
    memory3: { kicker: "Best memories", title: "Moments We Keep", message: "The smallest classroom moments often become the biggest memories.", art: "https://loveones-teacherday.netlify.app/polaroid_3.png", bullets: [] }
  },
  sakti: { name:"Sakti Sir" },
  sameer: { name:"Sameer Sir" },
  naila: { name:"Naila Ma'am" },
  mitanjali: { name:"Mitanjali Ma'am" },
  sanjeeda: { name:"Sanjeeda Ma'am" },
  rupali: { name:"Rupali Ma'am" },
  saraswati: { name:"Saraswati Ma'am" },
  sumitra: { name:"Sumitra Ma'am" },
  fatima: { name:"Fatima Ma'am" }
};

const DEFAULT_TONE = 0.06;
const teacherKey = new URLSearchParams(location.search).get('teacher') || 'shahid';
const teacher = TEACHERS[teacherKey] || TEACHERS.shahid;

const els = {
  welcomeName: document.getElementById('teacherNameWelcome'),
  blackboardTeacher: document.getElementById('blackboardTeacher'),
  enterBtn: document.getElementById('enterBtn'),
  corridor: document.getElementById('corridorScene'),
  classroom: document.getElementById('classroomScene'),
  stage: document.getElementById('classroomStage'),
  zoomBtn: document.getElementById('zoomBtn'),
  modalLayer: document.getElementById('modalLayer'),
  modalClose: document.getElementById('modalClose'),
  modalBackdrop: document.getElementById('modalBackdrop'),
  detailArt: document.getElementById('detailArt'),
  detailKicker: document.getElementById('detailKicker'),
  detailTitle: document.getElementById('detailTitle'),
  detailMessage: document.getElementById('detailMessage'),
  detailBullets: document.getElementById('detailBullets'),
  soundBtn: document.getElementById('soundBtn')
};

els.welcomeName.textContent = teacher.name;
els.blackboardTeacher.textContent = `Thank You, ${teacher.name}!`;

function makeAudio() {
  const C = window.AudioContext || window.webkitAudioContext;
  if (!C) return null;
  const ctx = new C();
  const gain = ctx.createGain(); gain.gain.value = 0;
  gain.connect(ctx.destination);
  return { ctx, gain };
}
let audio = null;
function unlockAudio(){ if(!audio) audio = makeAudio(); if(audio?.ctx?.state==='suspended') audio.ctx.resume(); }
function chime(){
  if(!audio) return;
  const osc=audio.ctx.createOscillator();
  const g=audio.ctx.createGain();
  osc.type='sine'; osc.frequency.setValueAtTime(620,audio.ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(900,audio.ctx.currentTime+.32);
  g.gain.setValueAtTime(0.0001,audio.ctx.currentTime); g.gain.exponentialRampToValueAtTime(DEFAULT_TONE,audio.ctx.currentTime+.02); g.gain.exponentialRampToValueAtTime(.0001,audio.ctx.currentTime+.45);
  osc.connect(g); g.connect(audio.ctx.destination); osc.start(); osc.stop(audio.ctx.currentTime+.48);
}

els.enterBtn.addEventListener('click', () => {
  unlockAudio(); chime();
  document.querySelector('.welcome-screen').classList.add('leaving');
  setTimeout(() => {
    els.corridor.classList.remove('is-active');
    els.classroom.classList.add('is-active');
    els.corridor.setAttribute('aria-hidden','true');
    els.classroom.setAttribute('aria-hidden','false');
  }, 300);
});

els.zoomBtn.addEventListener('click', () => {
  els.stage.classList.toggle('zoomed');
  els.zoomBtn.textContent = els.stage.classList.contains('zoomed') ? 'Reset ↺' : 'Zoom ➔';
});

function openModal(key){
  const item = teacher[key] || TEACHERS.shahid[key];
  if(!item) return;
  els.detailArt.src = item.art;
  els.detailArt.alt = item.title;
  els.detailKicker.textContent = item.kicker;
  els.detailTitle.textContent = item.title;
  els.detailMessage.textContent = item.message;
  els.detailBullets.innerHTML = (item.bullets||[]).map(x=>`<div>✦ ${x}</div>`).join('');
  els.modalLayer.classList.add('is-open');
  els.modalLayer.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  unlockAudio(); chime();
  els.modalClose.focus({preventScroll:true});
}
function closeModal(){
  els.modalLayer.classList.remove('is-open');
  els.modalLayer.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

document.querySelectorAll('.hotspot').forEach(h => h.addEventListener('click', () => openModal(h.dataset.modal)));
els.modalClose.addEventListener('click', closeModal);
els.modalBackdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if(e.key==='Escape') closeModal();
  if(e.key==='Enter' && document.activeElement?.classList.contains('hotspot')) document.activeElement.click();
});

let soundOn = true;
els.soundBtn.addEventListener('click', () => {
  unlockAudio();
  soundOn = !soundOn;
  if(audio) audio.gain.gain.value = soundOn ? 1 : 0;
  els.soundBtn.textContent = soundOn ? '🔊' : '🔇';
});

// Gentle parallax that is intentionally disabled on coarse pointers to keep touch interactions stable.
if (window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', e => {
    if(!els.classroom.classList.contains('is-active')) return;
    const x=(e.clientX/window.innerWidth-.5)*2;
    const y=(e.clientY/window.innerHeight-.5)*2;
    if(!els.stage.classList.contains('zoomed')) els.stage.style.transform=`translate3d(${x*-4}px,${y*-3}px,0)`;
  }, {passive:true});
  els.zoomBtn.addEventListener('click', () => {
    if(els.stage.classList.contains('zoomed')) els.stage.style.transform='scale(1.23)';
    else els.stage.style.transform='';
  });
}
