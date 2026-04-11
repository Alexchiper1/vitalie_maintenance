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
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("open");
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
  kitchen: ["images/Kitchen/IMG_2281.jpg", "images/Kitchen/IMG_5342.jpg", "images/Kitchen/IMG_5341.jpg"],
  bathroom: ["images/Bathroom/Bathroom.jpg","images/Bathroom/IMG_1855.jpg","images/Bathroom/IMG_2614.jpg","images/Bathroom/IMG_2615.jpg","images/Bathroom/IMG_2618.jpg","images/Bathroom/IMG_4015.jpg","images/Bathroom/IMG_4021.jpg", "images/Bathroom/IMG_5340.jpg"],
  painting: ["images/Painting/Painting.jpg","images/Painting/IMG_0589.jpg"],
  flooring: ["images/Flooring/Flooring.jpg","images/Flooring/IMG_3410.jpg","images/Flooring/IMG_3414.jpg","images/Flooring/IMG_1139.jpg","images/Flooring/IMG_1140.jpg","images/Flooring/IMG_1141.jpg","images/Flooring/IMG_4602.jpg","images/Flooring/IMG_4408.jpg","images/Flooring/IMG_1697.jpg"],
  tiling: ["images/tiling/Tiling.jpg","images/tiling/tiling1.jpg","images/tiling/tiling2.jpg","images/tiling/tiling3.jpg","images/tiling/tiling4.jpg","images/tiling/tiling5.jpg","images/tiling/tiling6.jpg"],
  extensions: ["images/Conversions & Extensions/Conversion.jpg","images/Conversions & Extensions/conversion1.jpg","images/Conversions & Extensions/conversion2.jpg","images/Conversions & Extensions/conversion3.jpg","images/Conversions & Extensions/conversion4.jpg","images/Conversions & Extensions/conversion5.jpg","images/Conversions & Extensions/shed.jpg","images/Conversions & Extensions/shed1.jpg","images/Conversions & Extensions/shed2.jpg","images/Conversions & Extensions/shed3.jpg","images/Conversions & Extensions/shed4.jpg"]
};

const preloadedFullSize = new Set();

/** Warm browser cache for full gallery so arrow navigation is instant (thumbs are separate requests). */
function preloadGalleryImages(urls) {
  urls.forEach((url) => {
    if (preloadedFullSize.has(url)) return;
    preloadedFullSize.add(url);
    const img = new Image();
    img.src = url;
  });
}

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
  preloadGalleryImages(current);
  idx = 0;
  lbImg.src = current[idx];
  lbImg.alt = `Project photo ${idx + 1} of ${current.length}`;
  lbCap.textContent = `${idx+1} / ${current.length}`;
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  document.documentElement.style.overflow = 'hidden';
}

function nextImg(){
  idx = (idx + 1) % current.length;
  lbImg.src = current[idx];
  lbImg.alt = `Project photo ${idx + 1} of ${current.length}`;
  lbCap.textContent = `${idx+1} / ${current.length}`;
}

function prevImg(){
  idx = (idx - 1 + current.length) % current.length;
  lbImg.src = current[idx];
  lbImg.alt = `Project photo ${idx + 1} of ${current.length}`;
  lbCap.textContent = `${idx+1} / ${current.length}`;
}

function closeLB(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.documentElement.style.overflow = '';
}

document.querySelectorAll('.gallery-card').forEach(btn=>{
  btn.addEventListener('click', ()=> openGallery(btn.dataset.gallery));
  const prewarm = () => {
    const urls = galleries[btn.dataset.gallery];
    if (urls) preloadGalleryImages(urls);
  };
  btn.addEventListener('mouseenter', prewarm);
  btn.addEventListener('touchstart', prewarm, { passive: true });
});
lbNext?.addEventListener('click', nextImg);
lbPrev?.addEventListener('click', prevImg);
lbClose?.addEventListener('click', closeLB);

lb?.addEventListener('click', e => {
  if(e.target === lb) closeLB();
});

window.addEventListener('keydown', e=>{
  if(!lb?.classList.contains('open')) return;
  if(e.key === 'Escape') closeLB();
  if(e.key === 'ArrowRight') nextImg();
  if(e.key === 'ArrowLeft') prevImg();
});

window.addEventListener("load", () => {
  document.body.classList.add("page-loaded");
});

// Disable past dates in Contact Form date picker
const dateInput = document.getElementById("start");
if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
}
