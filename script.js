/* ===== STARS ===== */
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let W, H, stars = [];

function setSize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', setSize);
setSize();

// make stars proportional
const COUNT = Math.max(120, Math.round((W*H)/9000));
for(let i=0;i<COUNT;i++){
  stars.push({
    x: (Math.random()-0.5)*W*1.6,
    y: (Math.random()-0.5)*H*1.6,
    z: Math.random()*W,
    speed: 0.6 + Math.random()*1.6
  });
}

function draw(){
  // trailing effect
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.fillRect(0,0,W,H);

  for(let i=0;i<stars.length;i++){
    const s = stars[i];
    s.z -= s.speed;
    if(s.z <= 1){
      s.z = W;
      s.x = (Math.random()-0.5)*W*1.6;
      s.y = (Math.random()-0.5)*H*1.6;
    }
    const k = 128.0 / s.z;
    const px = s.x*k + W/2;
    const py = s.y*k + H/2;
    if(px<0 || px>W || py<0 || py>H) continue;
    const size = Math.max(0.2, (1 - s.z/W) * 3.6);
    const alpha = Math.max(0.12, (1 - s.z/W));
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#ffd700";
    ctx.arc(px,py,size,0,Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  requestAnimationFrame(draw);
}
draw();

/* ===== PLANET + MESSAGES ===== */
const planet = document.getElementById('planet');
const message = document.getElementById('message');

const phrases = [
  "Eres mi sol en días nublados ☀️",
  "Mi razón de sonreír 💕",
  "Mi pedacito de cielo 🌤️",
  "Mi amor eterno 💖",
  "Mi tesoro más valioso 🌹",
  "Mi estrellita brillante 🌟",
  "Mi dulce amor 🍯",
  "Mi personita favorita 💫",
  "Mi corazón late por ti ❤️",
  "Mi abrazo favorito 🤗",
  "Mi alegría diaria 🌸",
  "Mi mundo entero 🌎",
  "Mi sonrisa tiene tu nombre 😊",
  "Mi vida eres tú 💞"
  
];

const colors = ["#ffd700","#ff6fa3","#9b5cf6","#60a5fa","#f472b6","#ffb86b","#22d3ee","#facc15"];

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* show animated floating phrase */
function showPhrase(text){
  // set visible bubble text quickly
  message.innerText = text;

  // color + glow
  const color = rand(colors);
  message.style.background = 'linear-gradient(90deg, rgba(255,255,255,0.98), rgba(255,255,255,0.92))';
  message.style.color = '#0b0b0b';
  message.style.textShadow = `0 0 12px rgba(0,0,0,0.45)`;

  // animate bubble (pop)
  message.animate([
    { transform: 'translateY(0) scale(0.9)', opacity: 0.6 },
    { transform: 'translateY(-18px) scale(1.05)', opacity: 1 },
    { transform: 'translateY(0) scale(1)', opacity: 0.95 }
  ], { duration: 900, easing: 'cubic-bezier(.2,.9,.3,1)' });

  // create colorful floaters (small transient text that orbits outward)
  const floater = document.createElement('div');
  floater.textContent = text;
  floater.style.position = 'fixed';
  floater.style.left = (window.innerWidth/2) + 'px';
  floater.style.top = (window.innerHeight/2) + 'px';
  floater.style.transform = 'translate(-50%,-50%)';
  floater.style.pointerEvents = 'none';
  floater.style.fontWeight = '700';
  floater.style.fontSize = (14 + Math.random()*8) + 'px';
  const grad = rand(colors);
  floater.style.background = 'linear-gradient(90deg,'+grad+', '+rand(colors)+')';
  floater.style.webkitBackgroundClip = 'text';
  floater.style.backgroundClip = 'text';
  floater.style.color = 'transparent';
  floater.style.textShadow = '0 6px 18px rgba(0,0,0,0.5), 0 0 12px rgba(255,215,0,0.06)';
  document.body.appendChild(floater);

  // animate floater outward
  const angle = (Math.random()*120 - 60) * Math.PI/180;
  const dist = 140 + Math.random()*140;
  const dx = Math.cos(angle)*dist;
  const dy = -Math.abs(Math.sin(angle))*dist; // bias upward
  const anim = floater.animate([
    { transform: 'translate(-50%,-50%) scale(0.9)', opacity: 1 },
    { transform: `translate(${dx}px, ${dy}px) scale(1.08)`, opacity: 1 },
    { transform: `translate(${dx*1.2}px, ${dy*1.5}px) scale(0.9)`, opacity: 0 }
  ], { duration: 2200 + Math.random()*900, easing: 'cubic-bezier(.2,.9,.3,1)' });
  anim.onfinish = () => floater.remove();
}

/* interaction */
function activatePlanet(){
  // planet pop
  planet.animate([
    { transform: 'scale(1) rotate(0deg)' },
    { transform: 'scale(1.14) rotate(6deg)' },
    { transform: 'scale(1) rotate(0deg)' }
  ], { duration: 420, easing: 'cubic-bezier(.2,.9,.3,1)' });

  // brief highlight
  planet.style.boxShadow = '0 40px 90px rgba(255,215,0,0.12), inset 0 6px 24px rgba(255,255,255,0.06)';
  setTimeout(()=> planet.style.boxShadow = '', 520);

  // show phrases
  const n = 1 + Math.floor(Math.random()*2);
  for(let i=0;i<n;i++){
    setTimeout(()=> showPhrase(rand(phrases)), i*260);
  }
}

/* events */
planet.addEventListener('click', activatePlanet);
planet.addEventListener('touchstart', (e)=>{ e.preventDefault(); activatePlanet(); });
planet.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); activatePlanet(); } });
planet.setAttribute('tabindex','0');

/* subtle idle pulse */
setInterval(()=> {
  planet.animate([
    { transform: 'scale(1) rotate(0deg)' },
    { transform: 'scale(1.03) rotate(2deg)' },
    { transform: 'scale(1) rotate(0deg)' }
  ], { duration: 4200, easing:'ease-in-out' });
}, 5200);
