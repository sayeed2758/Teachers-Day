(() => {
  'use strict';
  const app = document.getElementById('app');
  const orientation = document.getElementById('orientation');
  const stage = document.getElementById('stage');
  const sceneShell = document.getElementById('sceneShell');
  const sceneCamera = document.getElementById('sceneCamera');
  const enterButton = document.getElementById('enterButton');
  const doorway = document.getElementById('doorway');
  const entrancePanel = document.getElementById('entrancePanel');
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');
  const guidedCard = document.getElementById('guidedCard');
  const guideTitle = document.getElementById('guideTitle');
  const guideSubtitle = document.getElementById('guideSubtitle');
  const guideAction = document.getElementById('guideAction');
  const hotspots = [...document.querySelectorAll('.hotspot')];
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('modal');
  const modalInner = document.getElementById('modalInner');
  const closeModal = document.getElementById('closeModal');
  const finale = document.getElementById('finale');
  const replayButton = document.getElementById('replayButton');
  const finalTitle = document.getElementById('finalTitle');
  const confetti = document.getElementById('confetti');
  const toast = document.getElementById('toast');
  const portraitName = document.getElementById('portraitName');
  const entranceName = document.getElementById('entranceName');
  const doorName = document.getElementById('doorName');
  const chalkTeacher = document.getElementById('chalkTeacher');
  const chalkSub = document.getElementById('chalkSub');

  const params = new URLSearchParams(location.search);
  const teacherKey = (params.get('teacher') || 'shahid').toLowerCase().replace(/[^a-z-]/g,'');
  const teachers = {
    shahid:{name:'Shahid Sir', role:'Mentor', note:'Thank you for making every lesson clearer, warmer, and worth remembering.', signature:'Your Students'},
    sakti:{name:'Sakti Sir', role:'Teacher', note:'Thank you for your patience, guidance, and the confidence you give us every day.', signature:'With Gratitude'},
    sameer:{name:'Sameer Sir', role:'Teacher', note:'Thank you for turning difficult moments into lessons we can believe in.', signature:'Your Students'},
    naila:{name:"Naila Ma'am", role:'Teacher', note:'Thank you for teaching with kindness and reminding us that we can always do better.', signature:'With Love'},
    mitanjali:{name:"Mitanjali Ma'am", role:'Teacher', note:'Thank you for every encouraging word and every little lesson that stayed with us.', signature:'Your Students'},
    sanjeeda:{name:"Sanjeeda Ma'am", role:'Teacher', note:'Thank you for making the classroom feel like a place where everyone belongs.', signature:'With Gratitude'},
    rupali:{name:"Rupali Ma'am", role:'Teacher', note:'Thank you for inspiring curiosity, patience, and confidence in us.', signature:'Your Students'},
    saraswati:{name:"Saraswati Ma'am", role:'Teacher', note:'Thank you for the wisdom, care, and countless little moments that made learning memorable.', signature:'With Love'},
    sumitra:{name:"Sumitra Ma'am", role:'Teacher', note:'Thank you for believing in us even when we doubted ourselves.', signature:'Your Students'},
    fatima:{name:"Fatima Ma'am", role:'Teacher', note:'Thank you for teaching beyond textbooks and helping us grow as people.', signature:'With Gratitude'}
  };
  const teacher = teachers[teacherKey] || teachers.shahid;
  const safeName = teacher.name;
  document.title = `Teacher's Day — ${safeName}`;
  portraitName.textContent = safeName;
  entranceName.textContent = safeName;
  doorName.textContent = safeName;
  chalkTeacher.textContent = safeName;
  chalkSub.textContent = 'Celebrating your kindness & guidance ❤️';
  finalTitle.textContent = `Thank You, ${safeName}!`;

  let soundOn = true;
  let audioCtx = null;
  let musicTimer = null;
  let currentObject = null;
  let finalePlayed = false;

  function isPortrait(){ return window.matchMedia('(orientation: portrait)').matches; }
  function syncOrientation(){
    if (isPortrait()) app.dataset.stage = 'orientation';
    else if (app.dataset.stage === 'orientation') app.dataset.stage = 'entrance';
  }
  syncOrientation();
  window.addEventListener('resize', syncOrientation, {passive:true});
  window.addEventListener('orientationchange', () => setTimeout(syncOrientation, 250));

  function showToast(text){
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(()=>toast.classList.remove('show'), 1800);
  }

  function ensureAudio(){
    if (!soundOn) return;
    if (!audioCtx){
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      startAmbient();
    } else if (audioCtx.state === 'suspended') audioCtx.resume();
  }

  function tone(freq, when, dur, type='sine', volume=0.035){
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 1800;
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(volume, when + .04);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
    osc.start(when); osc.stop(when + dur + .05);
  }

  function startAmbient(){
    if (musicTimer || !audioCtx) return;
    const beat = 0.0;
    const chordSets = [[261.63,329.63,392],[220,261.63,329.63],[246.94,293.66,369.99],[196,246.94,293.66]];
    let ix=0;
    const schedule = () => {
      if (!audioCtx || !soundOn) return;
      const now = audioCtx.currentTime + 0.06;
      const chord = chordSets[ix % chordSets.length];
      chord.forEach((f,j)=>tone(f, now + j*.07, 3.2, j===0?'triangle':'sine', j===0?.042:.027));
      tone(chord[2]*2, now+1.25, 1.4, 'sine', .014);
      tone(chord[1]*2, now+2.15, 1.3, 'sine', .011);
      ix++;
    };
    schedule();
    musicTimer = setInterval(schedule, 3300);
  }

  function stopAmbient(){ clearInterval(musicTimer); musicTimer=null; if(audioCtx && audioCtx.state !== 'closed') audioCtx.suspend(); }
  function toggleSound(){
    soundOn = !soundOn;
    soundToggle.classList.toggle('muted', !soundOn);
    soundIcon.textContent = soundOn ? '🔊' : '🔇';
    if (soundOn){ ensureAudio(); showToast('Music on'); } else { stopAmbient(); showToast('Music muted'); }
  }
  soundToggle.addEventListener('click', toggleSound);

  const guideMap = {
    report:{title:'We are grading you!',subtitle:'You deserve a perfect score.',action:'Zoom to Report Card ➜'},
    letter:{title:'A Special Note',subtitle:'Something heartfelt is waiting for you.',action:'Open Envelope ➜'},
    diary:{title:'Wisdom & Lessons',subtitle:'The lessons that stay forever.',action:'Open Diary ➜'},
    'memory-left':{title:'Beautiful Memories',subtitle:'Moments worth keeping close.',action:'Open Photo Wall ➜'},
    'memory-right':{title:'Beautiful Memories',subtitle:'Moments worth keeping close.',action:'Open Photo Wall ➜'},
    'memory-bottom':{title:'Beautiful Memories',subtitle:'Moments worth keeping close.',action:'Open Photo Wall ➜'}
  };

  function setObjectActive(name){
    hotspots.forEach(h=>h.classList.toggle('active', h.dataset.object===name));
    currentObject=name;
    const g=guideMap[name] || guideMap.report;
    guideTitle.textContent=g.title;
    guideSubtitle.textContent=g.subtitle;
    guideAction.textContent=g.action;
    guidedCard.classList.add('show');
  }
  function clearZoom(){ sceneCamera.className='scene-camera'; }
  function focusObject(name){
    clearZoom();
    sceneCamera.classList.add(`zoom-${name}`);
    setObjectActive(name);
  }

  function modalFor(kind){
    const title = kind.startsWith('memory') ? '📸 Memories' : kind==='report' ? "🏆 Teacher's Report Card" : kind==='letter' ? '💌 A Letter for You' : '📖 What You Taught Us';
    if(kind==='report'){
      modal.classList.add('paper-modal');
      modalInner.innerHTML = `<h2 id="modalTitle" class="modal-title">${title}</h2><div class="modal-sub">A little certificate of appreciation for ${safeName}</div><div class="report-grid"><div class="paper"><h3 style="font-family:Caveat;font-size:36px;margin:0 0 14px;text-align:center">TEACHER'S REPORT CARD</h3><table class="report-table"><thead><tr><th>Evaluation Category</th><th>Grade</th></tr></thead><tbody><tr><td>Knowledge & Expertise</td><td>A+++</td></tr><tr><td>Clarity of Teaching</td><td>A+++</td></tr><tr><td>Patience & Understanding</td><td>A+++</td></tr><tr><td>Guidance & Mentorship</td><td>A+++</td></tr><tr><td>Dedication</td><td>100/100</td></tr><tr><td>Inspiration</td><td>A+++</td></tr><tr><td>Classroom Impact</td><td>A+++</td></tr></tbody></table><div style="text-align:center;margin-top:16px;font-family:Caveat;font-size:25px">OVERALL GRADE: <b style="color:#de695c">A+++</b> · SCORE: 100/100 ⭐⭐⭐⭐⭐</div></div><div class="paper certificate"><h3>CERTIFICATE OF APPRECIATION</h3><p>This award is proudly presented to</p><div class="grade">${safeName}</div><p><b>For Being an Exceptional Educator</b></p><p>${teacher.note}</p><div style="font-size:42px">🏆 ⭐⭐⭐⭐⭐</div><p><i>Officially declared: One of the best teachers / mentors.</i></p></div></div>`;
    } else if(kind==='letter'){
      modalInner.innerHTML = `<h2 id="modalTitle" class="modal-title">${title}</h2><div class="letter-paper"><div class="modal-sub">Dear ${safeName},</div><p style="text-align:center;line-height:1.5">Thank you for being such an amazing part of our journey.</p><div class="letter-lines"><div class="letter-line"><div class="letter-icon">📚</div><p>Thank you for sharing your knowledge in a way that makes everything easier to understand.</p></div><div class="letter-line"><div class="letter-icon">❤️</div><p>Thank you for your patience, kindness, and support, every single day.</p></div><div class="letter-line"><div class="letter-icon">🌱</div><p>Thank you for motivating us to do our best and believe in ourselves.</p></div><div class="letter-line"><div class="letter-icon">⭐</div><p>Thank you for making our classroom a place where we feel comfortable, heard, and inspired.</p></div><div class="letter-line"><div class="letter-icon">☕</div><p>Thank you for the little things that make a big difference.</p></div></div><p style="text-align:center;margin-top:22px;font-family:Caveat;font-size:30px">${teacher.note}</p><div class="signature">${teacher.signature}<br>♥</div></div>`;
    } else if(kind==='diary'){
      modalInner.innerHTML = `<h2 id="modalTitle" class="modal-title">${title}</h2><div class="diary-card"><h2>LESSONS WE WILL ALWAYS REMEMBER</h2><div class="lesson-list"><div class="lesson"><div class="lesson-badge">💡</div><div><b>Learn With Curiosity</b><br><small>Always ask, explore and keep learning.</small></div><span>★</span></div><div class="lesson"><div class="lesson-badge">⛰️</div><div><b>Never Give Up</b><br><small>Hard things become easier when we keep trying.</small></div><span>♥</span></div><div class="lesson"><div class="lesson-badge">❤️</div><div><b>Be Kind</b><br><small>Kindness can make someone's day better.</small></div><span>★</span></div><div class="lesson"><div class="lesson-badge">🌱</div><div><b>Keep Growing</b><br><small>Every day is a chance to become better.</small></div><span>❧</span></div><div class="lesson"><div class="lesson-badge">⭐</div><div><b>Believe In Yourself</b><br><small>You taught us to trust our abilities.</small></div><span>♥</span></div></div><p style="text-align:center;font-family:Caveat;font-size:30px">Some lessons stay with us forever. ♥</p></div>`;
    } else {
      modal.classList.add('memory-modal');
      modalInner.innerHTML = `<h2 id="modalTitle" class="modal-title" style="color:#ffe1a3">${title}</h2><div class="modal-sub" style="color:#d7c6a1">Little moments, big memories.</div><div class="memory-wall"><div class="photo-frame"><div class="photo-sim"></div><div class="photo-caption">Best Memories</div></div><div class="photo-frame"><div class="photo-sim" style="background:linear-gradient(135deg,#cda995,#8aa7a6 55%,#5f6f72)"></div><div class="photo-caption">Precious Moments</div></div><div class="photo-frame"><div class="photo-sim" style="background:linear-gradient(135deg,#a4b0c5,#dbc0a4 58%,#6e7f8c)"></div><div class="photo-caption">Thank You</div></div></div><p style="text-align:center;font-family:Caveat;font-size:28px;color:#ffe6ba;margin-top:22px">${teacher.note}</p>`;
    }
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden','false');
    setTimeout(()=>closeModal.focus(),50);
  }
  function closeCurrentModal(){
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden','true');
    modal.className='modal';
  }
  closeModal.addEventListener('click', closeCurrentModal);
  modalBackdrop.addEventListener('click',e=>{if(e.target===modalBackdrop) closeCurrentModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modalBackdrop.classList.contains('open')) closeCurrentModal();});

  function openSelected(){
    if(!currentObject) return;
    ensureAudio();
    modalFor(currentObject);
  }
  guideAction.addEventListener('click',openSelected);
  hotspots.forEach(btn=>btn.addEventListener('click',()=>{ ensureAudio(); focusObject(btn.dataset.object); }));

  enterButton.addEventListener('click',async()=>{
    ensureAudio();
    try{
      if(document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen({navigationUI:'hide'});
      if(screen.orientation?.lock) await screen.orientation.lock('landscape').catch(()=>{});
    }catch(_){/* browser may deny fullscreen */}
    doorway.classList.add('open');
    app.dataset.stage='classroom';
    entrancePanel.classList.add('exit');
    clearZoom();
    hotspots.forEach(h=>h.classList.remove('active'));
    currentObject=null;
    setTimeout(()=>guidedCard.classList.add('show'),900);
    guideTitle.textContent='Look around the class!';
    guideSubtitle.textContent='Find something made specially for you.';
    guideAction.textContent='Zoom  ➜';
  });

  function launchFinale(){
    if(finalePlayed) return;
    finalePlayed=true;
    app.dataset.stage='final';
    sceneCamera.classList.add('final-dim');
    createConfetti();
    ensureAudio();
    if(audioCtx){
      const now=audioCtx.currentTime+.05;
      [523.25,659.25,783.99,1046.5].forEach((f,i)=>tone(f,now+i*.12,1.25,'sine',.045));
    }
  }
  function createConfetti(){
    confetti.innerHTML='';
    for(let i=0;i<110;i++){
      const el=document.createElement('i');
      el.style.left=Math.random()*100+'%'; el.style.animationDuration=(2.2+Math.random()*2.8)+'s'; el.style.animationDelay=(Math.random()*.65)+'s';
      el.style.transform=`rotate(${Math.random()*360}deg)`;
      el.style.background=['#f07c5b','#3e7767','#edcc74','#6b91ba','#e7a4c1'][i%5];
      el.style.animationName='fallConfetti';
      confetti.appendChild(el);
    }
  }
  const sheet=document.createElement('style'); sheet.textContent='@keyframes fallConfetti{to{transform:translateY(110vh) rotate(660deg);opacity:.1}}'; document.head.appendChild(sheet);

  replayButton.addEventListener('click',()=>{
    finalePlayed=false;
    app.dataset.stage='entrance';
    entrancePanel.classList.remove('exit');
    doorway.classList.remove('open');
    guidedCard.classList.remove('show');
    clearZoom();
    currentObject=null;
    hotspots.forEach(h=>h.classList.remove('active'));
    modalBackdrop.classList.remove('open');
    showToast('Experience restarted');
  });

  // After all primary interactions have been visited once, offer finale from the final action.
  const visited = new Set();
  hotspots.forEach(h=>h.addEventListener('click',()=>{
    visited.add(h.dataset.object);
    if(visited.size>=4){
      guideAction.onclick=null;
      if(currentObject){
        guideAction.textContent = guideMap[currentObject]?.action || 'Open ➜';
      }
    }
  }));
  closeModal.addEventListener('click',()=>{
    if(visited.size>=4 && !finalePlayed) setTimeout(()=>{ if(!modalBackdrop.classList.contains('open')) { guideTitle.textContent='One last surprise…'; guideSubtitle.textContent='You have found the heart of the classroom.'; guideAction.textContent='Finish the Experience ❤️'; guideAction.onclick=launchFinale; guidedCard.classList.add('show'); }},180);
  });

  // Let tapping the sound button be enough to initialize audio on browsers that need a gesture.
  window.addEventListener('pointerdown',()=>{ if(soundOn) ensureAudio(); },{once:true,passive:true});
})();
