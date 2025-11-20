// Utility: throttle
function throttle(fn, wait=80){
  let last=0, timer;
  return (...args)=>{
    const now=Date.now();
    if(now-last>=wait){ last=now; fn(...args); }
    else{ clearTimeout(timer); timer=setTimeout(()=>{ last=Date.now(); fn(...args); }, wait-(now-last)); }
  };
}

// Year in footer
document.querySelectorAll('#year').forEach(el => el.textContent = new Date().getFullYear());

// Mobile nav toggle
const burger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-links');
if (burger && navList){
  burger.addEventListener('click', ()=>{
    const open = navList.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  navList.addEventListener('click', e=>{
    if(e.target.matches('a')) navList.classList.remove('open');
  });
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal, .card, .gallery-card, .form');
if ('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries, obs)=>{
    entries.forEach(en=>{
      if (en.isIntersecting){
        en.target.classList.add('revealed');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add('revealed'));
}

// Lightbox
const galleries = {
  kitchen: ["images/Kitchen/IMG_2281.png"],
  bathroom: ["images/Bathroom/Bathroom.png","images/Bathroom/IMG_1855.png","images/Bathroom/IMG_2614.png","images/Bathroom/IMG_2615.png","images/Bathroom/IMG_2618.png","images/Bathroom/IMG_4015.png","images/Bathroom/IMG_4021.png"],
  painting: ["images/Painting/Painting.png","images/Painting/IMG_0589.png"],
  flooring: ["images/Flooring/Flooring.png","images/Flooring/IMG_3410.png","images/Flooring/IMG_3414.png","images/Flooring/IMG_1139.png","images/Flooring/IMG_1140.png","images/Flooring/IMG_1141.png","images/Flooring/IMG_4602.PNG","images/Flooring/IMG_4408.png","images/Flooring/IMG_1697.png"],
  tiling: ["images/tiling/Tiling.png","images/tiling/tiling1.png","images/tiling/tiling2.png","images/tiling/tiling3.png","images/tiling/tiling4.png","images/tiling/tiling5.png","images/tiling/tiling6.png"],
  extensions: ["images/Conversions & Extensions/Conversion.png","images/Conversions & Extensions/conversion1.png","images/Conversions & Extensions/conversion2.png","images/Conversions & Extensions/conversion3.png","images/Conversions & Extensions/conversion4.png","images/Conversions & Extensions/conversion5.png","images/Conversions & Extensions/shed.png","images/Conversions & Extensions/shed1.png","images/Conversions & Extensions/shed2.png","images/Conversions & Extensions/shed3.png","images/Conversions & Extensions/shed4.png"]
};

let current = [];
let idx = 0;

const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCap = document.getElementById('lightbox-cap');
const lbPrev = document.getElementById('lb-prev');
const lbNext = document.getElementById('lb-next');
const lbClose = document.getElementById('lb-close');

function openGallery(key){
  current = galleries[key] || [];
  if (!current.length || !lb || !lbImg) return;
  idx = 0;
  lbImg.src = current[idx];
  lbCap.textContent = `${idx+1} / ${current.length}`;
  lb.classList.add('open');
  document.documentElement.style.overflow = 'hidden';
}

function nextImg(){
  idx = (idx + 1) % current.length;
  lbImg.src = current[idx];
  lbCap.textContent = `${idx+1} / ${current.length}`;
}

function prevImg(){
  idx = (idx - 1 + current.length) % current.length;
  lbImg.src = current[idx];
  lbCap.textContent = `${idx+1} / ${current.length}`;
}

function closeLB(){
  lb.classList.remove('open');
  document.documentElement.style.overflow = '';
}

document.querySelectorAll('.gallery-card').forEach(btn=>{
  btn.addEventListener('click', ()=> openGallery(btn.dataset.gallery));
});
lbNext?.addEventListener('click', nextImg);
lbPrev?.addEventListener('click', prevImg);
lbClose?.addEventListener('click', closeLB);

lb?.addEventListener('click', e => {
  if(e.target === lb) closeLB();
});

window.addEventListener('keydown', e=>{
  if(!lb.classList.contains('open')) return;
  if(e.key === 'Escape') closeLB();
  if(e.key === 'ArrowRight') nextImg();
  if(e.key === 'ArrowLeft') prevImg();
});
