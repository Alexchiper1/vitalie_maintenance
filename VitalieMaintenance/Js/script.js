// ----------------------
// Contact Form Handling
// ----------------------
const form = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  if (form.checkValidity()) {
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

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show'); // animate in
    } else {
      entry.target.classList.remove('show'); // animate out when out of view
    }
  });
}, { threshold: 0.2 });

hiddenElements.forEach(el => observer.observe(el));

// ----------------------
// Smooth Scroll Navigation
// ----------------------
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if(target){
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
