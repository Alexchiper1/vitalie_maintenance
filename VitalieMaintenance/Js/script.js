// ----------------------
// Mobile Nav Toggle
// ----------------------
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// ----------------------
// Contact Form Handling
// ----------------------
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', function(e){
    e.preventDefault();
    if(form.checkValidity()){
        formMsg.textContent = "Thank you for contacting us! We'll get back to you soon.";
        formMsg.style.color = "green";
        form.reset();
    } else {
        formMsg.textContent = "Please fill out all fields correctly.";
        formMsg.style.color = "red";
    }
});

// ----------------------
// Scroll Animations
// ----------------------
const hiddenElements = document.querySelectorAll('.hidden');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show'); // optional: animate out when leaving
        }
    });
}, { threshold: 0.2 });

hiddenElements.forEach(el => {
    observer.observe(el);
});

// ----------------------
// Smooth Scroll Navigation
// ----------------------
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e){
        // only prevent default for internal anchors
        if(this.getAttribute('href').startsWith('#')){
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target){
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// ----------------------
// Pop up logo And Nav
// ----------------------

document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".slide-up");

  elements.forEach((el, i) => {
    el.style.animationDelay = `${i * 0.3}s`; // stagger each element
  });
});

// ----------------------
// Staggered animation for cards
// ----------------------
const cards = document.querySelectorAll('#ourwork .card');
cards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.2}s`;
});

// ----------------------
// Our work 
// ----------------------
const projects = {
  kitchen: ["images/Kitchen/IMG_2281.png"],
  bathroom: ["images/Bathroom/Bathroom.png","images/Bathroom/IMG_1855.png","images/Bathroom/IMG_2614.png","images/Bathroom/IMG_2615.png", "images/Bathroom/IMG_2618.png", "images/Bathroom/IMG_4015.png", "images/Bathroom/IMG_4021.png"],
  painting: ["images/Painting/Painting.png","images/Painting/IMG_0589.png"],
  flooring: ["images/Flooring/Flooring.png","images/Flooring/IMG_3410.png","images/Flooring/IMG_3414.png","images/Flooring/IMG_1139.png","images/Flooring/IMG_1140.png","images/Flooring/IMG_1141.png","images/Flooring/IMG_4602.PNG","images/Flooring/IMG_4408.png","images/Flooring/IMG_1697.png",],
  tiling: ["images/tiling/Tiling.png","images/tiling/tiling1.png","images/tiling/tiling2.png","images/tiling/tiling3.png","images/tiling/tiling4.png","images/tiling/tiling5.png","images/tiling/tiling6.png"],
  extensions: ["images/Conversions & Extensions/Conversion.png","images/Conversions & Extensions/conversion1.png","images/Conversions & Extensions/conversion2.png","images/Conversions & Extensions/conversion3.png","images/Conversions & Extensions/conversion4.png","images/Conversions & Extensions/conversion5.png","images/Conversions & Extensions/shed.png","images/Conversions & Extensions/shed1.png","images/Conversions & Extensions/shed2.png","images/Conversions & Extensions/shed3.png","images/Conversions & Extensions/shed4.png"] 
};

let currentGallery = [];
let currentIndex = 0;

function openLightbox(section){
  currentGallery = projects[section];
  currentIndex = 0;
  document.getElementById("lightbox").style.display = "flex";
  document.getElementById("lightbox-img").src = currentGallery[currentIndex];
  document.querySelector(".caption").innerText = `Scroll to see more (${currentIndex+1}/${currentGallery.length})`;
}

function closeLightbox(){
  document.getElementById("lightbox").style.display = "none";
}

function nextImage(){
  currentIndex = (currentIndex + 1) % currentGallery.length;
  document.getElementById("lightbox-img").src = currentGallery[currentIndex];
  document.querySelector(".caption").innerText = `Scroll to see more (${currentIndex+1}/${currentGallery.length})`;
}

function prevImage(){
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  document.getElementById("lightbox-img").src = currentGallery[currentIndex];
  document.querySelector(".caption").innerText = `Scroll to see more (${currentIndex+1}/${currentGallery.length})`;
}

// Scroll through gallery with mouse wheel
document.getElementById("lightbox").addEventListener("wheel", function(e){
  e.preventDefault();
  if(e.deltaY > 0) nextImage();
  else prevImage();
},{passive:false});