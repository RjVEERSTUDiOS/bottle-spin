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
  const spinAmount   = (Math.floor(Math.random()*5) + 5) * 360;
  const finalAngle   = Math.floor(Math.random()*360);
  const targetRotation = startRotation + spinAmount + finalAngle;

  const duration = 4000;
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

// Universe dotted background
const starCanvas = document.getElementById('starfield');
const sctx = starCanvas.getContext('2d');

function drawStars(){
  starCanvas.width = window.innerWidth;
  starCanvas.height = window.innerHeight;

  const g = sctx.createLinearGradient(0,0,0,starCanvas.height);
  g.addColorStop(0, '#0a0f17');
  g.addColorStop(1, '#0a1120');
  sctx.fillStyle = g;
  sctx.fillRect(0,0,starCanvas.width,starCanvas.height);

  const count = Math.floor((starCanvas.width * starCanvas.height) / 18000);
  for(let i=0;i<count;i++){
    const x = Math.random()*starCanvas.width;
    const y = Math.random()*starCanvas.height;
    const r = Math.random()*1.6 + 0.3;
    const a = Math.random()*0.5 + 0.4;
    sctx.beginPath();
    sctx.arc(x,y,r,0,Math.PI*2);
    sctx.fillStyle = `rgba(255,255,255,${a})`;
    sctx.fill();

    if(Math.random() < 0.08){
      sctx.beginPath();
      sctx.arc(x,y,r*1.6,0,Math.PI*2);
      sctx.fillStyle = Math.random() < 0.5 ? 'rgba(160,200,255,0.18)' : 'rgba(255,170,220,0.18)';
      sctx.fill();
    }
  }
}

window.addEventListener('resize', drawStars);
drawStars();