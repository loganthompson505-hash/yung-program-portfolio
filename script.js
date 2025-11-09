// MATURED 3D HERO: Glass Orb + Physics + Dynamic Light
if (document.getElementById('hero-canvas')) {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, mouse = { x: 0, y: 0 }, orb = {}, particles = [];

  function init() {
    resize();
    orb = {
      x: width * 0.3,
      y: height * 0.5,
      targetX: width * 0.3,
      targetY: height * 0.5,
      radius: 120,
      ease: 0.05
    };

    particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: width * 0.3 + (Math.random() - 0.5) * 200,
        y: height * 0.5 + (Math.random() - 0.5) * 200,
        size: Math.random() * 2 + 1,
        opacity: 0,
        targetOpacity: Math.random() * 0.4 + 0.2,
        speed: 0.02
      });
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    animate();
  }

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function animate() {
    ctx.fillStyle = 'rgba(15, 15, 30, 0.05)';
    ctx.fillRect(0, 0, width, height);

    const dx = mouse.x - orb.x;
    const dy = mouse.y - orb.y;
    orb.targetX += dx * 0.001;
    orb.targetY += dy * 0.001;

    orb.x += (orb.targetX - orb.x) * orb.ease;
    orb.y += (orb.targetY - orb.y) * orb.ease;

    const time = Date.now() * 0.001;
    const lightX = orb.x + Math.cos(time) * 50;
    const lightY = orb.y + Math.sin(time * 0.7) * 50;

    const gradient = ctx.createRadialGradient(lightX, lightY, 0, orb.x, orb.y, orb.radius);
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.8)');
    gradient.addColorStop(0.3, 'rgba(0, 212, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(10, 10, 30, 0.1)');

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 80;
    ctx.shadowColor = '#00ff88';
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    particles.forEach(p => {
      p.opacity += (p.targetOpacity - p.opacity) * p.speed;
      const dist = Math.hypot(p.x - orb.x, p.y - orb.y);
      if (dist < 200) p.opacity = Math.max(p.opacity, 0.4);

      ctx.fillStyle = `rgba(0, 255, 136, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.x += (orb.x - p.x) * 0.001;
      p.y += (orb.y - p.y) * 0.001;
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
}

// Theme Toggle
const toggle = document.getElementById('theme-toggle');
const saved = localStorage.getItem('theme');
if (saved === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
  toggle.textContent = '☀️';
}
toggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  toggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Voice Assistance
const voiceBtn = document.getElementById('voice-btn');
let recognition;
let synth = window.speechSynthesis;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}

voiceBtn.addEventListener('click', () => {
  if (synth.speaking) {
    synth.cancel();
    return;
  }
  if (recognition) {
    recognition.start();
    voiceBtn.textContent = '🔴';
  } else {
    speak('Voice recognition not supported. Use text navigation.');
  }
});

recognition?.addEventListener('result', (e) => {
  const command = e.results[0][0].transcript.toLowerCase();
  voiceBtn.textContent = '🎤';
  handleVoiceCommand(command);
});

recognition?.addEventListener('end', () => voiceBtn.textContent = '🎤');

function handleVoiceCommand(command) {
  if (command.includes('about') || command.includes('me')) {
    scrollToSection('about');
    speak('About Me section. I am YUNG PROGRAM, a full-stack developer obsessed with building fast, scalable, and futuristic web experiences.');
  } else if (command.includes('projects') || command.includes('work')) {
    scrollToSection('projects');
    speak('Projects section. Here are my real projects: AI Analytics Dashboard with React and TensorFlow, Web3 Voting DApp on Ethereum, and more.');
  } else if (command.includes('skills')) {
    scrollToSection('skills');
    speak('Skills section. My tech arsenal includes React, Node.js, TypeScript, Python, Web3, Three.js, Docker, and AWS.');
  } else if (command.includes('gallery') || command.includes('design')) {
    scrollToSection('gallery');
    speak('Design Inspiration gallery. Futuristic visuals powering the aesthetic.');
  } else if (command.includes('contact')) {
    scrollToSection('contact');
    speak('Contact section. Send me a message or call +234 703 541 7876.');
  } else if (command.includes('home') || command.includes('top')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    speak('Scrolling to top.');
  } else {
    speak('Command not recognized. Try: about me, projects, skills, gallery, contact, or home.');
  }
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.1;
  utterance.pitch = 1;
  synth.speak(utterance);
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Contact Form
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  try {
    const res = await fetch('https://formspree.io/f/xjklmnop', {  // Replace with your Formspree ID
      method: 'POST', body: data, headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      alert('Message sent! I’ll hit you back soon.');
      form.reset();
    } else throw new Error();
  } catch {
    alert('Failed. Try again or call me directly.');
  }
});
// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => console.log('PWA Ready')).catch(console.error);
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// ... (All previous JS code remains the same: 3D, Voice, GSAP, Theme, Form)
// Remove the old fetch — Formspree auto-handles
document.getElementById('contact-form').addEventListener('submit', (e) => {
  // Optional: Add loading state
  const btn = e.target.querySelector('button');
  btn.textContent = 'Sending...';
  setTimeout(() => btn.textContent = 'Sent!', 2000);
});
// Language System
const translations = {};
let currentLang = 'en';

async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    translations[lang] = await res.json();
    applyTranslations(lang);
    currentLang = lang;
    updateFlag(lang);
    localStorage.setItem('lang', lang);
  } catch (e) { console.log("Lang not found"); }
}

function applyTranslations(lang) {
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
}

function updateFlag(lang) {
  const flags = { en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', zh: '🇨🇳' };
  const names = { en: 'EN', es: 'ES', fr: 'FR', de: 'DE', zh: '中文' };
  document.getElementById('lang-flag').textContent = flags[lang];
  document.getElementById('lang-name').textContent = names[lang];
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('lang') || navigator.language.split('-')[0];
  loadLanguage(['en','es','fr','de','zh'].includes(saved) ? saved : 'en');

  // Toggle
  const btn = document.getElementById('lang-btn');
  const menu = document.getElementById('lang-menu');
  btn.addEventListener('click', () => menu.classList.toggle('show'));
  menu.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      loadLanguage(b.dataset.lang);
      menu.classList.remove('show');
    });
  });
});