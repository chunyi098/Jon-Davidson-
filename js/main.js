// JonDavidson Main JavaScript

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// Job search
function searchJobs() {
  const keyword = document.getElementById('jobKeyword')?.value?.trim() || '';
  const location = document.getElementById('jobLocation')?.value?.trim() || '';
  const category = document.getElementById('jobCategory')?.value || '';

  let query = keyword || 'JonDavidson';
  if (location) query += ' ' + location;
  if (category) query += ' ' + category;

  const jobstreetUrl = `https://sg.jobstreet.com/companies/jondavidson-pte-ltd-168555410477312/jobs`;
  const recruitUrl = `https://recruitcrm.io/jobs/JonDavidson_jobs`;

  // Open the recruitment portal
  window.open(recruitUrl, '_blank');
}

// Allow Enter key in search bar
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.search-bar input');
  inputs.forEach(input => {
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') searchJobs();
    });
  });
});

// Intersection Observer for fade-up animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
