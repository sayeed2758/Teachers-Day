const TEACHERS={
 shahid:{name:'Shahid Sir'},sakti:{name:'Sakti Sir'},sameer:{name:'Sameer Sir'},naila:{name:'Naila Ma’am'},mitanjali:{name:'Mitanjali Ma’am'},sanjeeda:{name:'Sanjeeda Ma’am'},rupali:{name:'Rupali Ma’am'},saraswati:{name:'Saraswati Ma’am'},sumitra:{name:'Sumitra Ma’am'},fatima:{name:'Fatima Ma’am'}
};
const params=new URLSearchParams(location.search); const teacherKey=(params.get('teacher')||'shahid').toLowerCase(); const teacher=TEACHERS[teacherKey]||TEACHERS.shahid;
const $=id=>document.getElementById(id);
const scenes={entrance:$('sceneEntrance'),classroom:$('sceneClassroom'),focus:$('sceneFocus'),final:$('sceneFinal')};
$('portraitName').textContent=teacher.name; $('entranceTeacher').textContent=teacher.name; $('boardName').textContent=teacher.name; $('finalTeacher').textContent=teacher.name;
document.title=`Happy Teacher's Day — ${teacher.name} ✨`;

// Small starfield outside the centered reference frame.
const stars=$('stars'); for(let i=0;i<34;i++){const s=document.createElement('span');s.className='star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.width=s.style.height=(2+Math.random()*4)+'px';s.style.animationDelay=(-Math.random()*3.6)+'s';stars.appendChild(s)}

const content={
 report:{hint:'We are grading you!',open:'Open Report Card',focus:'assets/images/report-focus.jpg',modal:'assets/images/report-modal.jpg',kicker:"Teacher's Report Card",title:'A+++ Teacher',message:'For patience, guidance, encouragement and the little moments that make learning memorable.',bullets:['Knowledge & Expertise — A+++','Patience & Understanding — A+++','Dedication — 100/100']},
 letter:{hint:'A Special Note',open:'Open Envelope',focus:'assets/images/letter-focus.jpg',modal:'assets/images/letter-modal.jpg',kicker:'A special letter for you',title:`Thank You, ${teacher.name}`,message:'For making our classroom a place where we feel comfortable, heard and inspired.',bullets:['For believing in us','For every encouraging word','For teaching more than lessons']},
 diary:{hint:'Wisdom & Lessons',open:'Open Diary',focus:'assets/images/diary-focus.jpg',modal:'assets/images/diary-modal.jpg',kicker:'Lessons • Memories • Little Things',title:'What You Taught Us',message:'Some lessons stay with us forever — curiosity, kindness, courage, patience and the confidence to keep growing.',bullets:['Learn with curiosity','Never give up','Be kind','Keep growing','Believe in yourself']},
 memory1:{hint:'Beautiful Memories',open:'Open Photo Wall',focus:'assets/images/memory-focus.jpg',modal:'assets/images/memories-modal.jpg',kicker:'Memories',title:'Beautiful Memories',message:'A classroom full of little moments that became memories we will always carry.',bullets:['Best Memories','Precious Moments','Thank You']},
 memory2:{hint:'Beautiful Memories',open:'Open Photo Wall',focus:'assets/images/memory-focus.jpg',modal:'assets/images/memories-modal.jpg',kicker:'Memories',title:'Precious Moments',message:'Every smile, question and shared moment made the classroom feel special.',bullets:['Best Memories','Precious Moments','Thank You']},
 memory3:{hint:'Beautiful Memories',open:'Open Photo Wall',focus:'assets/images/memory-focus.jpg',modal:'assets/images/memories-modal.jpg',kicker:'Memories',title:'Thank You',message:'For the ordinary school days that somehow became our favourite memories.',bullets:['Best Memories','Precious Moments','Thank You']}
};

let audioCtx=null,master=null,soundOn=true,musicTimer=null,musicStep=0,currentKey=null,modalOpen=false;
const chords=[[261.63,329.63,392],[220,277.18,329.63],[246.94,293.66,369.99],[196,246.94,293.66],[261.63,329.63,392],[233.08,293.66,349.23],[220,277.18,329.63],[196,246.94,329.63]];
function audioInit(){if(audioCtx)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;audioCtx=new C();master=audioCtx.createGain();master.gain.value=soundOn?.16:0;master.connect(audioCtx.destination)}
function resumeAudio(){audioInit();if(audioCtx?.state==='suspended')audioCtx.resume()}
function note(freq,dur=.7,gain=.018,type='sine',when=null){if(!soundOn)return;resumeAudio();if(!audioCtx||!master)return;const t=when??audioCtx.currentTime;const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.08);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(master);o.start(t);o.stop(t+dur+.04)}
function tick(){if(!audioCtx||!soundOn)return;const c=chords[musicStep%chords.length],now=audioCtx.currentTime;c.forEach((n,i)=>note(n,1.8,.0045,i? 'sine':'triangle',now));note(c[2]*2,0.45,.0035,'sine',now+.85);musicStep++}
function startMusic(){resumeAudio();if(musicTimer)return;tick();musicTimer=setInterval(tick,1900)}
function chime(){note(523.25,.28,.025);setTimeout(()=>note(659.25,.34,.02),85);setTimeout(()=>note(783.99,.42,.016),170)}

function showScene(name){Object.entries(scenes).forEach(([k,el])=>{const on=k===name;el.classList.toggle('is-active',on);el.setAttribute('aria-hidden',String(!on))})}
function enterFullscreen(){try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)document.documentElement.requestFullscreen({navigationUI:'hide'})}catch{} try{screen.orientation?.lock?.('landscape')}catch{}}
$('enterBtn').addEventListener('click',async()=>{resumeAudio();startMusic();chime();enterFullscreen();showScene('classroom');setTimeout(()=>{$('sceneClassroom').classList.add('guided-ready')},300);setTimeout(()=>{ document.querySelectorAll('.hotspot').forEach(h=>h.classList.add('is-live')); },700)});

document.querySelectorAll('.hotspot').forEach(btn=>{btn.addEventListener('click',()=>selectKey(btn.dataset.key))});
function selectKey(key){currentKey=key;const c=content[key]; if(!c)return; document.querySelectorAll('.hotspot').forEach(h=>h.classList.remove('is-selected')); const btn=document.querySelector(`[data-key="${key}"]`);btn?.classList.add('is-selected');
  $('focusImage').src=c.focus;$('focusHint').textContent=c.hint;$('openFocusText').textContent=c.open;showScene('focus');chime();
}
$('guidedAction').addEventListener('click',()=>{if(!currentKey){selectKey('report')}else{openModal(currentKey)}});
$('openFocusBtn').addEventListener('click',()=>{if(currentKey)openModal(currentKey)});
function openModal(key){const c=content[key];if(!c)return;modalOpen=true;$('modalImage').src=c.modal;$('modalImage').alt=c.title;$('modalKicker').textContent=c.kicker;$('modalTitle').textContent=c.title;$('modalMessage').textContent=c.message;$('modalBullets').innerHTML=c.bullets.map(x=>`<span>${x}</span>`).join('');$('modalLayer').classList.add('is-open');$('modalLayer').setAttribute('aria-hidden','false');chime();}
function closeModal(){modalOpen=false;$('modalLayer').classList.remove('is-open');$('modalLayer').setAttribute('aria-hidden','true')}
$('modalClose').addEventListener('click',closeModal);$('modalLayer').querySelector('.modal-backdrop').addEventListener('click',closeModal);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalOpen)closeModal()});

$('copyLink').addEventListener('click',async()=>{const url=`${location.origin}${location.pathname}?teacher=${encodeURIComponent(teacherKey)}`;try{await navigator.clipboard.writeText(url);toast('Personal teacher link copied ✓')}catch{toast(url)}});
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

$('soundBtn').addEventListener('click',()=>{soundOn=!soundOn;resumeAudio();if(master)master.gain.setTargetAtTime(soundOn?.16:0,audioCtx.currentTime,.08);$('soundBtn').textContent=soundOn?'🔊':'🔇';$('soundBtn').setAttribute('aria-label',soundOn?'Mute music':'Turn music on');if(soundOn)startMusic()});

function finalScene(){showScene('final');closeModal();spawnConfetti();chime()}
function spawnConfetti(){const box=$('finalParticles');box.innerHTML='';for(let i=0;i<80;i++){const c=document.createElement('span');c.className='confetti';c.style.left=Math.random()*100+'%';c.style.animationDuration=(3.2+Math.random()*3)+'s';c.style.animationDelay=(Math.random()*1.5)+'s';c.style.setProperty('--drift',(Math.random()*220-110)+'px');c.style.background=['#ffd66b','#f08a7d','#86b8a4','#f7f0de','#79a0c0'][i%5];box.appendChild(c)}}

// Natural reference-like sequence: after visiting a few keepsakes, gently finish.
let visited=new Set();
const originalSelect=selectKey; selectKey=function(key){visited.add(key);originalSelect(key)};
$('replayBtn').addEventListener('click',()=>{currentKey=null;visited.clear();document.querySelectorAll('.hotspot').forEach(h=>h.classList.remove('is-selected'));showScene('entrance');});

// Progressive guided behavior.
function updateGuide(){if(currentKey){const c=content[currentKey];$('guidedText').textContent=c.hint;$('guidedActionText').textContent='Open'}else{$('guidedText').textContent='Look around the class!';$('guidedActionText').textContent='Zoom'}}
setInterval(updateGuide,350);

// Click the sound control to unlock music if the browser suspended it.
window.addEventListener('pointerdown',()=>{if(soundOn)resumeAudio()},{once:true});
