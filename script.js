// Spin logic
let currentRotation = 0;
let isSpinning = false;

const bottle  = document.getElementById('bottle');
const spinBtn = document.getElementById('spinBtn');

spinBtn.addEventListener('click', () => {
  if (isSpinning) return;
  animateSpin();
});

function animateSpin(){
  isSpinning = true;
  spinBtn.disabled = true;
  spinBtn.textContent = 'SPINNING...';

  const startRotation = currentRotation;
  const spinAmount   = (Math.floor(Math.random()*5) + 5) * 360; // 5–9 full spins
  const finalAngle   = Math.floor(Math.random()*360);
  const targetRotation = startRotation + spinAmount + finalAngle;

  const duration = 4000; // ms
  let startTime = null;
  const easeOutQuint = t => 1 - Math.pow(1 - t, 5);

  function step(ts){
    if(!startTime) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    const eased = easeOutQuint(p);

    currentRotation = startRotation + (targetRotation - startRotation) * eased;
    bottle.style.transform = `rotate(${currentRotation}deg)`;

    if(p < 1){
      requestAnimationFrame(step);
    }else{
      currentRotation = targetRotation;
      isSpinning = false;
      spinBtn.disabled = false;
      spinBtn.textContent = 'SPIN AGAIN';
    }
  }
  requestAnimationFrame(step);
}

/* Particle background (unchanged) */
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
const mouse = { x:null, y:null, radius:150 };

window.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y; });

class Particle{
  constructor(x,y,dx,dy,size,color){ this.x=x; this.y=y; this.dx=dx; this.dy=dy; this.size=size; this.color=color; }
  draw(){ ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,Math.PI*2,false); ctx.fillStyle=this.color; ctx.fill(); }
  update(){
    if(this.x>canvas.width || this.x<0) this.dx = -this.dx;
    if(this.y>canvas.height || this.y<0) this.dy = -this.dy;

    const dx = mouse.x - this.x, dy = mouse.y - this.y;
    const dist = Math.hypot(dx,dy);
    if(dist < mouse.radius + this.size){
      if(mouse.x < this.x && this.x < canvas.width - this.size*10) this.x += 5;
      if(mouse.x > this.x && this.x > this.size*10)                  this.x -= 5;
      if(mouse.y < this.y && this.y < canvas.height - this.size*10)  this.y += 5;
      if(mouse.y > this.y && this.y > this.size*10)                  this.y -= 5;
    }
    this.x += this.dx; this.y += this.dy; this.draw();
  }
}

function init(){
  canvas.width = innerWidth; canvas.height = innerHeight;
  particlesArray = [];
  const n = (canvas.width < 768) ? 30 : 100;
  for(let i=0;i<n;i++){
    const size = Math.random()*2 + 1;
    const x = Math.random() * (innerWidth  - size*4) + size*2;
    const y = Math.random() * (innerHeight - size*4) + size*2;
    const dx = Math.random()*0.4 - 0.2;
    const dy = Math.random()*0.4 - 0.2;
    particlesArray.push(new Particle(x,y,dx,dy,size,'rgba(162,89,255,0.6)'));
  }
}
function animate(){
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of particlesArray) p.update();
}
window.addEventListener('resize', init);
init(); animate();
