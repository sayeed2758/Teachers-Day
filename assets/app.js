const teacherKey = new URLSearchParams(window.location.search).get('teacher')?.toLowerCase();
const teacher = TEACHERS[teacherKey] || DEFAULT_TEACHER;

const screens = [...document.querySelectorAll('.screen')];
const progressBar = document.getElementById('progressBar');
const toast = document.getElementById('toast');
let current = 0;

function applyTeacher(){
  document.title = `Happy Teacher's Day, ${teacher.name} ❤️`;
  document.querySelectorAll('.teacher-name').forEach(el => el.textContent = teacher.name);
  document.querySelectorAll('[data-teacher-name]').forEach(el => el.textContent = teacher.name);
  const invalid = teacherKey && !TEACHERS[teacherKey];
  if(invalid) showToast('Teacher link not found — showing the default greeting.');
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
sound.addEventListener('click', async()=>{
  if(!music.querySelector('source')){
    showToast('Add your music file at assets/music.mp3');
    return;
  }
  try{
    if(music.paused){ await music.play(); sound.textContent='♫'; sound.classList.add('playing'); }
    else { music.pause(); sound.textContent='♪'; sound.classList.remove('playing'); }
  }catch{ showToast('Tap again to start the music.'); }
});

function showToast(message){
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>toast.classList.remove('show'),2600);
}

applyTeacher();
progressBar.style.width='20%';

document.addEventListener('keydown', e=>{
  if(e.key==='ArrowRight') goTo('classroom');
  if(e.key==='Escape') document.querySelectorAll('dialog[open]').forEach(d=>d.close());
});
