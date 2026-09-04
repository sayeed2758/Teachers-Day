const config = {
  teacherName: "Teacher",
  studentSignature: "Your Students"
};

const screens = [...document.querySelectorAll('.screen')];
const progressBar = document.getElementById('progressBar');
const toast = document.getElementById('toast');
let current = 0;

function applyConfig(){
  document.querySelectorAll('.teacher-name').forEach(el => el.textContent = config.teacherName);
}

function goTo(name){
  const next = screens.findIndex(s => s.dataset.screen === name);
  if(next < 0) return;
  screens.forEach((screen,i)=>screen.classList.toggle('is-active', i===next));
  current = next;
  progressBar.style.width = `${Math.max(20,(next/(screens.length-1))*100)}%`;
  window.scrollTo({top:0,behavior:'smooth'});
}

document.querySelectorAll('[data-next]').forEach(btn=>btn.addEventListener('click',()=>goTo(btn.dataset.next)));
document.getElementById('openExperienceCard').addEventListener('click',()=>goTo('classroom'));

document.querySelectorAll('[data-open]').forEach(btn=>btn.addEventListener('click',()=>{
  const dialog = document.getElementById(btn.dataset.open + 'Modal');
  if(dialog?.showModal) dialog.showModal();
}));

document.querySelectorAll('[data-close]').forEach(btn=>btn.addEventListener('click',()=>btn.closest('dialog')?.close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{
  if(e.target === d) d.close();
}));

const music = document.getElementById('bgMusic');
const sound = document.getElementById('soundToggle');
let musicOn = false;
sound.addEventListener('click', async()=>{
  // Add assets/music.mp3 and a source in index.html to enable this.
  if(!music.querySelector('source')){
    showToast('Add your music file at assets/music.mp3');
    return;
  }
  try{
    if(music.paused){ await music.play(); musicOn=true; sound.textContent='♫'; }
    else { music.pause(); musicOn=false; sound.textContent='♪'; }
  }catch{ showToast('Tap again to start the music.'); }
});

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>toast.classList.remove('show'),2200);
}

applyConfig();
progressBar.style.width='20%';

// Optional keyboard navigation for desktop testing.
document.addEventListener('keydown', e=>{
  if(e.key==='ArrowRight') goTo('classroom');
  if(e.key==='Escape') document.querySelectorAll('dialog[open]').forEach(d=>d.close());
});
