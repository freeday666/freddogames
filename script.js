const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreSpan = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const adminBtn = document.getElementById('adminBtn');

const loginModal = document.getElementById('login-modal');
const adminModal = document.getElementById('admin-modal');
const closeLogin = document.getElementById('close-login');
const closeAdmin = document.getElementById('close-admin');

const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logoutBtn');
const adminScoreSpan = document.getElementById('adminScore');
const saveSettingsBtn = document.getElementById('saveSettings');
const springPowerRange = document.getElementById('springPower');

let gameInterval;
let score = 0;
let gameRunning = false;
let isAdmin = false;

// Spel objecten
const player = {
  x: 100,
  y: 0,
  width: 40,
  height: 60,
  velocityY: 0,
  onTrampoline: false
};

const trampoline = {
  x: 50,
  y: 300,
  width: 300,
  height: 20
};

let springPower = parseInt(springPowerRange.value);

// Canvas grootte
function resizeCanvas() {
  canvas.width = 400;
  canvas.height = 400;
}
resizeCanvas();

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && player.onTrampoline) {
    // Spring
    player.velocityY = -springPower;
    player.onTrampoline = false;
  }
});

// Admin knop
adminBtn.onclick = () => {
  loginModal.style.display = 'block';
};

// Sluit login modal
closeLogin.onclick = () => {
  loginModal.style.display = 'none';
};

// Sluit admin modal
closeAdmin.onclick = () => {
  adminModal.style.display = 'none';
};

// Uitloggen
logoutBtn.onclick = () => {
  isAdmin = false;
  alert('Uitgelogd');
  adminModal.style.display = 'none';
  updateAdminView();
};

// Login form
loginForm.onsubmit = (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (password === 'https100') {
    isAdmin = true;
    alert('Ingelogd als admin!');
    loginModal.style.display = 'none';
    updateAdminView();
  } else {
    alert('Onjuiste wachtwoord!');
  }
};

// Update admin dashboard view
function updateAdminView() {
  if (isAdmin) {
    adminModal.style.display = 'block';
    document.getElementById('admin-message').textContent = '';
    document.getElementById('adminScore').textContent = score;
  }
}

// Spel starten
startBtn.onclick = () => {
  if (gameRunning) return;
  resetGame();
  gameInterval = setInterval(update, 20);
  gameRunning = true;
};

// Reset game
function resetGame() {
  score = 0;
  scoreSpan.textContent = score;
  player.x = 100;
  player.y = 0;
  player.velocityY = 0;
  player.onTrampoline = false;
  updateAdminView();
}

// Update game
function update() {
  player.velocityY += 0.5; // zwaartekracht
  player.y += player.velocityY;

  // Als speler op trampoline landt
  if (player.y + player.height >= trampoline.y) {
    player.y = trampoline.y - player.height;
    player.velocityY = 0;
    if (!player.onTrampoline) {
      player.onTrampoline = true;
      score++;
      scoreSpan.textContent = score;
      if (isAdmin) {
        document.getElementById('adminScore').textContent = score;
      }
    }
  }

  // Vallen
  if (player.y > canvas.height) {
    alert('Je bent gevallen! Game Over.');
    clearInterval(gameInterval);
    gameRunning = false;
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'brown';
  ctx.fillRect(trampoline.x, trampoline.y, trampoline.width, trampoline.height);
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Instellingen opslaan
document.getElementById('saveSettings').onclick = () => {
  springPower = parseInt(springPowerRange.value);
  alert('Instellingen opgeslagen!');
};
