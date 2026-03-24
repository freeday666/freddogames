// Canvas particle background animation
function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 100;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Games data (localStorage backend)
function loadGames() {
    const games = localStorage.getItem('freddoGames');
    return games ? JSON.parse(games) : [
        { id: 1, title: 'Cyber Rush', desc: 'Fast-paced cyberpunk racer' },
        { id: 2, title: 'Neon Battle', desc: 'Multiplayer arena shooter' },
        { id: 3, title: 'Quantum Puzzle', desc: 'Mind-bending puzzles' }
    ];
}

function saveGames(games) {
    localStorage.setItem('freddoGames', JSON.stringify(games));
}

function renderGames(games) {
    const grid = document.getElementById('games-grid');
    grid.innerHTML = games.map(game => `
        <div class="game-card">
            <h3>${game.title}</h3>
            <p>${game.desc}</p>
        </div>
    `).join('');
}

// Login logic
const ADMIN_CREDENTIALS = { username: 'admin', password: 'eigenaar44' };

document.addEventListener('DOMContentLoaded', () => {
    initBackground();

    const games = loadGames();
    renderGames(games);

    // Admin button
    document.getElementById('admin-btn').addEventListener('click', () => {
        document.getElementById('login-modal').style.display = 'block';
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            document.getElementById('login-modal').style.display = 'none';
            document.getElementById('admin-modal').style.display = 'block';
            renderAdminGames(loadGames());
            document.getElementById('admin-message').textContent = 'Login successful! Manage your games.';
            document.getElementById('admin-message').className = 'success';
        } else {
            document.getElementById('admin-message').textContent = 'Invalid credentials!';
            document.getElementById('admin-message').className = 'error';
        }
    });

    // Add game form
    document.getElementById('add-game-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('game-title').value;
        const desc = document.getElementById('game-desc').value;
        const games = loadGames();
        const newGame = {
            id: Date.now(),
            title,
            desc
        };
        games.unshift(newGame);
        saveGames(games);
        renderGames(games);
        renderAdminGames(games);
        document.getElementById('add-game-form').reset();
        document.getElementById('admin-message').textContent = 'Game added successfully!';
        document.getElementById('admin-message').className = 'success';
    });

    // Close modals
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', () => {
            close.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
});

function renderAdminGames(games) {
    const list = document.getElementById('admin-games-list');
    list.innerHTML = games.map(game => `
        <li class="admin-game-item">
            <span><strong>${game.title}</strong>: ${game.desc}</span>
            <button class="delete-btn" onclick="deleteGame(${game.id})">Delete</button>
        </li>
    `).join('');
}

function deleteGame(id) {
    let games = loadGames();
    games = games.filter(g => g.id !== id);
    saveGames(games);
    renderGames(games);
    renderAdminGames(games);
    document.getElementById('admin-message').textContent = 'Game deleted!';
    document.getElementById('admin-message').className = 'success';
}

