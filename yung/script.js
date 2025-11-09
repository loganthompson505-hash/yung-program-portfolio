// 3D Hero (Same as before)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.getElementById('hero-3d').appendChild(renderer.domElement);

const geometry = new THREE.TorusKnotGeometry(8, 2.5, 200, 16);
const material = new THREE.MeshBasicMaterial({ color: 0x00ffea, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
camera.position.z = 30;

function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.008;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// Tilt Effect
VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
  max: 15, speed: 400, glare: true, "max-glare": 0.3
});

// GSAP Animations
gsap.from('.hero h1', { y: -80, opacity: 0, duration: 1.2, ease: 'bounce.out' });
gsap.from('.tagline', { opacity: 0, delay: 0.8, duration: 1 });
gsap.utils.toArray('.project-card, .img-card').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    y: 100, opacity: 0, duration: 0.8, delay: i * 0.15
  });
});

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