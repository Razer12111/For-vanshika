// script.js
const words = [
  "I messed up. I'm sorry — I never meant to upset you.",
  "You mean the world to me, Vanshika. Please forgive me.",
  "I'll listen more, care more, and try harder every day.",
  "If you open your heart again, I'll cherish it forever. 💖"
];

const typeEl = document.getElementById('typewriter');
const playBtn = document.getElementById('playBtn');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');
const reveal = document.getElementById('reveal');
const revealText = document.getElementById('revealText');
const customMsg = document.getElementById('customMsg');
const heart = document.getElementById('heart');

// Simple typewriter that cycles phrases
let wordIndex = 0;
let charIndex = 0;
let typingInterval = null;

function startTypewriter(){
  clearInterval(typingInterval);
  typeEl.textContent = '';
  charIndex = 0;
  const current = words[wordIndex];
  typingInterval = setInterval(()=>{
    if(charIndex <= current.length){
      typeEl.textContent = current.slice(0,charIndex) + (charIndex % 2 ? '|' : ' ');
      charIndex++;
    } else {
      clearInterval(typingInterval);
      setTimeout(()=> {
        wordIndex = (wordIndex + 1) % words.length;
        startTypewriter();
      }, 2200);
    }
  }, 45);
}
startTypewriter();

// Small musical chime using WebAudio
function playChime(){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(440, ctx.currentTime);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    o.connect(g); g.connect(ctx.destination);
    o.start();
    o.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
    o.stop(ctx.currentTime + 1.1);
  }catch(e){
    console.warn('Audio not supported', e);
  }
}

// Confetti canvas
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let confettiPieces = [];
function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function createConfetti(){
  confettiPieces = [];
  const count = 120;
  for(let i=0;i<count;i++){
    confettiPieces.push({
      x: Math.random()*canvas.width,
      y: -Math.random()*canvas.height,
      w: 6 + Math.random()*10,
      h: 8 + Math.random()*12,
      rot: Math.random()*360,
      speed: 1 + Math.random()*4,
      spin: (Math.random()-0.5)*8,
      color: `hsl(${Math.random()*60+330},70%,60%)`
    });
  }
}
let confettiAnim = null;
function renderConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confettiPieces.forEach(p=>{
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI/180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
    ctx.restore();

    p.y += p.speed + Math.abs(Math.sin(p.rot*Math.PI/180))*2;
    p.rot += p.spin;
    if(p.y > canvas.height + 40) p.y = -20;
  });
  confettiAnim = requestAnimationFrame(renderConfetti);
}

function startConfetti(){
  createConfetti();
  cancelAnimationFrame(confettiAnim);
  renderConfetti();
  setTimeout(()=> {
    cancelAnimationFrame(confettiAnim);
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }, 4000);
}

// Buttons
playBtn.addEventListener('click', ()=> {
  playChime();
  startConfetti();
  pulseHeart();
});
sendBtn.addEventListener('click', ()=>{
  const text = customMsg.value.trim();
  revealText.textContent = text || "I love you and I'm really sorry. Can we please talk? 💖";
  reveal.classList.remove('hidden');
  burstHearts();
});

resetBtn.addEventListener('click', ()=>{
  customMsg.value = '';
  reveal.classList.add('hidden');
  typeEl.textContent = '';
  wordIndex = 0;
  startTypewriter();
});

heart.addEventListener('click', () => {
  playChime();
  pulseHeart();
  startConfetti();
  revealText.textContent = "I clicked the heart for you. Please forgive me, Vanshika.";
  reveal.classList.remove('hidden');
});

function pulseHeart(){
  heart.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.25)' },
    { transform: 'scale(1)' }
  ], { duration: 550, easing: 'cubic-bezier(.17,.67,.32,1.28)' });
}

function burstHearts(){
  for(let i=0;i<20;i++){
    const el = document.createElement('div');
    el.textContent = '💖';
    Object.assign(el.style, {
      position:'fixed',
      left: (50 + (Math.random()-0.5)*30) + '%',
      top: (40 + (Math.random()-0.5)*20) + '%',
      pointerEvents: 'none',
      fontSize: `${12 + Math.random()*26}px`,
      opacity: '1',
      transform: `translateY(0) scale(0.8) rotate(${Math.random()*60-30}deg)`
    });
    document.body.appendChild(el);
    const dur = 1200 + Math.random()*800;
    el.animate([
      { transform: el.style.transform, opacity: 1 },
      { transform: `translateY(-120px) scale(1.2)`, opacity: 0 }
    ], { duration: dur, easing:'cubic-bezier(.2,.7,.2,1)'});
    setTimeout(()=> el.remove(), dur+60);
  }
}