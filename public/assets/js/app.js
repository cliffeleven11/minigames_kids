/**
 * Main Application Controller
 * Mengelola navigasi dan state aplikasi
 */

class MiniGamesApp {
    constructor() {
        this.currentPage = 'home';
        this.playerName = localStorage.getItem('playerName') || '';
        this.selectedAge = localStorage.getItem('selectedAge') || null;
        this.currentGameId = null;
        this.currentSessionId = null;
        this.currentScore = 0;
        this.attempts = 0;
        this.correctAnswers = 0;
        this.gameStartTime = null;
        this.allGames = [];
        // sound preference (persisted)
        this.soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    }

    async init() {
        // Wait for API to be available
        let retries = 0;
        while (!window.api && retries < 50) {
            await new Promise(resolve => setTimeout(resolve, 10));
            retries++;
        }

        if (!window.api) {
            console.error('API client failed to initialize');
            alert('Gagal menginisialisasi API. Refresh halaman dan coba lagi.');
            return;
        }

        await this.loadGames();
        this.setupEventListeners();
        this.hideLoadingScreen();
        // Setup onboarding modal (shows once by default)
        this.setupOnboarding();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }

    async loadGames() {
        try {
            console.log('Loading games...');
            console.log('window.api:', window.api);
            const response = await window.api.getAllGames();
            console.log('API Response:', response);
            this.allGames = response.data || [];
            console.log('Games loaded:', this.allGames);
            this.renderGames(this.allGames);
        } catch (error) {
            console.error('Error loading games:', error);
            alert('Gagal memuat permainan. Pastikan API server berjalan.');
        }
    }

    setupEventListeners() {
        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.game-content, .game-container')) {
                return;
            }
        }, { passive: true });

        // Prevent accidental zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // Onboarding: shows a brief tip modal for first-time users
    setupOnboarding() {
        try {
            const modal = document.getElementById('onboardingModal');
            if (!modal) return;
            const hidden = localStorage.getItem('hideOnboard') === 'true';
            if (!hidden) modal.classList.remove('hidden');

            const closeBtn = document.getElementById('onboardClose');
            const startBtn = document.getElementById('onboardStart');
            const chk = document.getElementById('dontShowOnboard');

            if (chk) chk.checked = localStorage.getItem('hideOnboard') === 'true';
            if (closeBtn) closeBtn.addEventListener('click', () => this.closeOnboarding());
            if (startBtn) startBtn.addEventListener('click', () => this.startFromOnboard());
            if (chk) chk.addEventListener('change', (e) => localStorage.setItem('hideOnboard', e.target.checked ? 'true' : 'false'));

            this._onboardKeyHandler = (e) => { if (e.key === 'Escape') this.closeOnboarding(); };
            document.addEventListener('keydown', this._onboardKeyHandler);
        } catch (e) {
            console.warn('Onboarding init failed', e);
        }
    }

    closeOnboarding() {
        const modal = document.getElementById('onboardingModal');
        if (!modal) return;
        modal.classList.add('hidden');
        if (this._onboardKeyHandler) {
            document.removeEventListener('keydown', this._onboardKeyHandler);
            this._onboardKeyHandler = null;
        }
    }

    startFromOnboard() {
        this.closeOnboarding();
        const input = document.getElementById('playerNameInput');
        if (input) input.focus();
    }

    setPlayerName() {
        const input = document.getElementById('playerNameInput');
        const name = input.value.trim();

        if (!name) {
            alert('Masukkan nama kamu terlebih dahulu!');
            return;
        }

        this.playerName = name;
        localStorage.setItem('playerName', name);

        const playerSection = document.querySelector('.player-section');
        playerSection.innerHTML = `
            <div style="color: var(--primary); font-size: 18px; font-weight: 600;">
                👋 Halo, ${name}! Siap bermain?
            </div>
        `;
    }

    filterByAge(age) {
        this.selectedAge = age;
        localStorage.setItem('selectedAge', age);

        // Update button states
        document.querySelectorAll('.age-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // Filter games
        const filtered = this.allGames.filter(game => {
            const [minAge, maxAge] = game.ageRange.split('-').map(Number);
            return age >= minAge && age <= maxAge;
        });

        this.renderGames(filtered);
    }

    renderGames(games) {
        const gamesGrid = document.getElementById('gamesGrid');
        gamesGrid.innerHTML = '';

        if (games.length === 0) {
            gamesGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><p>Tidak ada game untuk usia ini.</p></div>';
            return;
        }

        // Use requestAnimationFrame to batch DOM updates
        requestAnimationFrame(() => {
            const fragment = document.createDocumentFragment();

            games.forEach((game, index) => {
                const gameCard = document.createElement('div');
                gameCard.className = 'game-card';
                // Remove inline styles in favor of CSS

                gameCard.innerHTML = `
                    <div class="game-icon">${game.icon}</div>
                    <div class="game-name">${game.name}</div>
                    <div class="game-info">
                        <span class="badge badge-age">👧 ${game.ageRange} thn</span>
                        <span class="badge badge-diff">${this.getDifficultyLabel(game.difficulty)}</span>
                    </div>
                `;
                gameCard.addEventListener('click', () => this.startGame(game.id, game.name));
                fragment.appendChild(gameCard);
            });

            gamesGrid.appendChild(fragment);
        });
    }

    getDifficultyLabel(difficulty) {
        const labels = {
            easy: '⭐ Mudah',
            medium: '⭐⭐ Sedang',
            hard: '⭐⭐⭐ Sulit'
        };
        return labels[difficulty] || difficulty;
    }

    async startGame(gameId, gameName) {
        if (!this.playerName) {
            alert('Masukkan nama kamu dulu!');
            document.getElementById('playerNameInput').focus();
            return;
        }

        this.currentGameId = gameId;
        this.currentGameName = gameName; // Ensure name is saved

        try {
            const response = await window.api.startGameSession(gameId, this.playerName);
            this.currentSessionId = response.data.sessionId;

            // Update game page
            document.getElementById('gameTitle').textContent = response.data.gameName;
            document.getElementById('scoreDisplay').textContent = 'Skor: 0';
            document.getElementById('timerDisplay').textContent = `Waktu: ${response.data.totalDuration}s`;

            // Reset stats
            this.currentScore = 0;
            this.attempts = 0;
            this.correctAnswers = 0;
            this.gameStartTime = Date.now();

            // Fetch session details to get server-generated questions
            let sessionDetails = null;
            try {
                const sd = await window.api.getSessionDetails(this.currentSessionId);
                sessionDetails = sd.data || null;
            } catch (sdErr) {
                console.warn('Could not fetch session details:', sdErr);
            }

            // Load game-specific UI (pass questions if available)
            this.loadGameUI(gameId, sessionDetails ? sessionDetails.questions : null);

            // Switch to game page
            this.showPage('game');

            // Start timer
            this.startTimer(response.data.totalDuration);

        } catch (error) {
            console.error('Error starting game:', error);
            alert('Gagal memulai permainan: ' + error.message);
        }
    }

    loadGameUI(gameId, questions = null) {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = '';

        // Load specific game UI
        switch (gameId) {
            case 'counting_fruits':
                new CountingFruitsGame(this, questions);
                break;
            case 'color_learn':
                new ColorLearnGame(this, questions);
                break;
            case 'find_match_animals':
                new FindMatchGame(this, questions);
                break;
            case 'maze_rabbit':
                new MazeRabbitGame(this, questions);
                break;
            case 'shape_recognition':
            case 'shape-recognition':
                new ShapeRecognitionGame(this, questions);
                break;
            case 'alphabet_quiz':
            case 'alphabet-quiz':
                new AlphabetQuizGame(this, questions);
                break;
            case 'memory_pairs':
            case 'memory-pairs':
            case 'memory_game':
            case 'memory':
                new MemoryPairsGame(this, questions);
                break;
            default:
                console.warn('Unknown game ID:', gameId);
                gameContent.innerHTML = `<div style="text-align:center; padding:40px;">
                    <h3>Maaf, game ini belum tersedia.</h3>
                    <p>ID: ${gameId}</p>
                    <button class="btn btn-secondary" onclick="app.backToHome()" style="margin-top:20px;">Kembali</button>
                </div>`;
        }
    }

    startTimer(duration) {
        // Clear any previous timer to avoid multiple intervals updating the UI
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }

        let remaining = Number(duration) || 0;
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) timerDisplay.textContent = `Waktu: ${remaining}s`;

        this._timerInterval = setInterval(() => {
            remaining--;
            if (timerDisplay) timerDisplay.textContent = `Waktu: ${remaining}s`;

            if (remaining <= 0) {
                clearInterval(this._timerInterval);
                this._timerInterval = null;
                this.endGame();
            }
        }, 1000);
    }

    recordAttempt(isCorrect) {
        this.attempts++;
        if (isCorrect) this.correctAnswers++;
    }

    async endGame() {
        // Ensure timer is cleared regardless of session state
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }

        if (!this.currentSessionId) {
            // update UI to reflect stopped timer
            const timerDisplay = document.getElementById('timerDisplay');
            if (timerDisplay) timerDisplay.textContent = `Waktu: 0s`;
            return;
        }

        // Calculate accuracy locally
        const accuracy = this.attempts > 0 ? Math.round((this.correctAnswers / this.attempts) * 100) : 0;

        // Determine badge locally if server doesn't return (or just rely on score)
        let badgeEmoji = '🌟';
        if (accuracy >= 90) badgeEmoji = '🏆';
        else if (accuracy >= 70) badgeEmoji = '🥇';
        else if (accuracy >= 50) badgeEmoji = '🥈';

        try {
            const response = await window.api.endGameSession(this.currentSessionId);
            const data = response.data;

            // Allow server to override but use local stats as fallback/enhancement
            const finalData = {
                finalScore: data.finalScore || this.currentScore,
                accuracy: (data.accuracy !== undefined ? data.accuracy : accuracy) + '%',
                badge: data.badge || { emoji: badgeEmoji }
            };

            // Save to local leaderboard
            this.saveScore(this.currentGameId, this.playerName, finalData.finalScore);

            // Show results
            this.showResults(finalData);

        } catch (error) {
            console.error('Error ending game:', error);
            // Friendly fallback when session disappeared on server
            const msg = (error && error.message) ? error.message : '';
            if (msg.includes('Session tidak ditemukan')) {
                // Fallback result display
                const finalData = {
                    finalScore: this.currentScore,
                    accuracy: accuracy + '%',
                    badge: { emoji: badgeEmoji }
                };
                this.saveScore(this.currentGameId, this.playerName, finalData.finalScore);
                this.showResults(finalData);
            }
        }
    }

    saveScore(gameId, name, score) {
        try {
            const key = `leaderboard_${gameId}`;
            let list = JSON.parse(localStorage.getItem(key) || '[]');
            list.push({ name, score, date: Date.now() });
            list.sort((a, b) => b.score - a.score); // descending
            list = list.slice(0, 5); // top 5
            localStorage.setItem(key, JSON.stringify(list));
        } catch (e) {
            console.warn('Leaderboard save failed', e);
        }
    }

    getLeaderboard(gameId) {
        try {
            return JSON.parse(localStorage.getItem(`leaderboard_${gameId}`) || '[]');
        } catch (e) {
            console.warn('Leaderboard load failed', e);
            return [];
        }
    }

    showResults(data) {
        document.getElementById('finalScore').querySelector('.value').textContent = data.finalScore || 0;
        document.getElementById('accuracy').querySelector('.value').textContent = data.accuracy || '0%';
        document.getElementById('badge').querySelector('.value').textContent = data.badge?.emoji || '🌟';

        // Render leaderboard
        let lbContainer = document.getElementById('leaderboardContainer');
        if (!lbContainer) {
            lbContainer = document.createElement('div');
            lbContainer.id = 'leaderboardContainer';
            lbContainer.className = 'leaderboard-container';
            // append to result page info if not exists
            const resultInfo = document.querySelector('.results-content');
            if (resultInfo) {
                resultInfo.appendChild(lbContainer);
            }
        }

        const list = this.getLeaderboard(this.currentGameId || '');
        if (list.length > 0) {
            lbContainer.innerHTML = `
                <div class="leaderboard-title">🏆 Papan Peringkat</div>
                <ul class="leaderboard-list">
                    ${list.map((item, idx) => `
                        <li class="leaderboard-item">
                            <span class="leaderboard-rank">#${idx + 1}</span>
                            <span class="leaderboard-name">${item.name}</span>
                            <span class="leaderboard-score">${item.score}</span>
                        </li>
                    `).join('')}
                </ul>
            `;
            lbContainer.style.display = 'block';
        } else {
            lbContainer.style.display = 'none';
        }

        this.showPage('results');
    }

    playAgain() {
        this.startGame(this.currentGameId, this.currentGameName);
    }

    showPage(pageName) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });

        const pageMap = {
            'home': 'homePage',
            'game': 'gamePage',
            'results': 'resultsPage'
        };

        const page = document.getElementById(pageMap[pageName]);
        if (page) {
            page.classList.remove('hidden');
        }
        this.currentPage = pageName;
    }

    backToHome() {
        // Clear timer if still running
        if (this._timerInterval) {
            clearInterval(this._timerInterval);
            this._timerInterval = null;
        }
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) timerDisplay.textContent = `Waktu: 0s`;

        this.showPage('home');
        this.currentSessionId = null;
        this.currentGameId = null;
    }

    updateScore(points) {
        this.currentScore += points;
        document.getElementById('scoreDisplay').textContent = `Skor: ${this.currentScore}`;
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        const sounds = {
            correct: document.getElementById('correctSound'),
            wrong: document.getElementById('wrongSound'),
            complete: document.getElementById('completeSound')
        };

        const sound = sounds[type];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {
                // Sound playback failed (user might have disabled it)
            });
        }
    }

    showFeedback(message, type = 'success', duration = 700) {
        try {
            const existing = document.querySelector('.feedback-overlay');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.className = `feedback-overlay ${type}`;
            overlay.setAttribute('role', 'status');
            overlay.setAttribute('aria-live', 'polite');
            overlay.style.pointerEvents = 'none';
            overlay.innerHTML = `<span style="font-size:24px">${type === 'success' ? '✅' : '❌'}</span><span>${message}</span>`;
            document.body.appendChild(overlay);

            // Force reflow then show briefly
            requestAnimationFrame(() => overlay.classList.add('show'));

            setTimeout(() => {
                overlay.classList.remove('show');
                setTimeout(() => overlay.remove(), 300);
            }, duration);
        } catch (e) {
            console.warn('Feedback error', e);
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        localStorage.setItem('soundEnabled', this.soundEnabled ? 'true' : 'false');
        const btn = document.getElementById('muteToggle');
        if (btn) {
            btn.setAttribute('aria-pressed', this.soundEnabled ? 'true' : 'false');
            btn.textContent = this.soundEnabled ? '🔊' : '🔈';
        }
    }

    createConfetti(count = 12) {
        const colors = ['#ff5252', '#ffd166', '#06d6a0', '#4cc9f0', '#c77dff'];
        const container = document.body;
        for (let i = 0; i < count; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            const left = Math.random() * 80 + 10; // 10% - 90%
            el.style.left = `${left}vw`;
            el.style.top = `${-10 - Math.random() * 20}px`;
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
            el.style.transform = `rotate(${Math.random() * 360}deg)`;
            el.style.animation = `confetti-fall ${1.0 + Math.random() * 0.8}s linear forwards`;
            container.appendChild(el);
            setTimeout(() => el.remove(), 2000);
        }
    }
}

// Game Classes
class CountingFruitsGame {
    constructor(appInstance, serverQuestions = null) {
        this.app = appInstance;
        this.currentQuestion = 0;
        if (Array.isArray(serverQuestions) && serverQuestions.length > 0) {
            // Map server questions format to client expected format
            this.questions = serverQuestions.map((q, idx) => ({
                id: q.id || `q-${idx}`,
                emoji: q.emoji || '🍎',
                count: q.answer || 1,
                options: q.options || [1, q.answer, q.answer + 1],
                title: q.title || 'Berapa banyak buah?'
            }));
        } else {
            this.questions = [
                { id: 1, emoji: '🍎', count: 3, options: [1, 3, 5], title: 'Berapa banyak apel?' },
                { id: 2, emoji: '🍌', count: 2, options: [2, 3, 4], title: 'Berapa banyak pisang?' },
                { id: 3, emoji: '🍓', count: 4, options: [3, 4, 5], title: 'Berapa banyak strawberry?' },
                { id: 4, emoji: '🍇', count: 5, options: [4, 5, 6], title: 'Berapa banyak anggur?' },
                { id: 5, emoji: '🍊', count: 1, options: [1, 2, 3], title: 'Berapa banyak jeruk?' },
            ];
        }

        this.render();
    }

    render() {
        const gameContent = document.getElementById('gameContent');
        const question = this.questions[this.currentQuestion];

        if (!question) {
            this.app.endGame();
            return;
        }

        // mark question start time for scoring
        this.questionStartTime = Date.now();

        const fruitHtml = Array(question.count).fill(`<span style="font-size: 60px; margin: 10px;">${question.emoji}</span>`).join('');

        gameContent.innerHTML = `
            <div style="width: 100%; max-width: 500px;">
                <h3 style="text-align: center; margin-bottom: 30px; font-size: 24px;">${question.title}</h3>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; margin-bottom: 30px; min-height: 100px;">
                    ${fruitHtml}
                </div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    ${question.options.map((opt, idx) => `
                        <button data-opt="${opt}" class="count-opt">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;

        // attach handlers
        document.querySelectorAll('.count-opt').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = Number(e.currentTarget.dataset.opt);
                this.answer(val, e.currentTarget);
            });
        });

        window.currentGame = this;
    }

    async answer(selected, btnEl = null) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = selected === question.count;
        const timeSpent = Math.floor((Date.now() - (this.questionStartTime || Date.now())) / 1000);

        // Submit answer to server (best-effort)
        try {
            if (this.app.currentSessionId) {
                await window.api.submitAnswer(this.app.currentSessionId, question.id, selected, timeSpent);
            }
        } catch (err) {
            console.warn('Failed to submit answer:', err);
            if (err && err.message && err.message.includes('Session tidak ditemukan')) {
                this.app.showFeedback('Sesi permainan hilang, kembali ke beranda.', 'error', 1400);
                setTimeout(() => this.app.backToHome(), 900);
            }
        }

        if (isCorrect) {
            this.app.playSound('correct');
            this.app.updateScore(10);
            // Visual feedback
            this.app.showFeedback('Benar!', 'success', 700);
            this.app.createConfetti(8);

            // Pop the fruit container for satisfying feedback
            const fruitContainer = document.querySelector('.fruit-container');
            if (fruitContainer) {
                fruitContainer.classList.add('pop-fruit');
                setTimeout(() => fruitContainer.classList.remove('pop-fruit'), 450);
            }

            // Disable options briefly to avoid double clicks
            document.querySelectorAll('.count-opt').forEach(b => b.disabled = true);

            // Pulse the score briefly
            const sd = document.getElementById('scoreDisplay');
            sd.classList.add('score-pulse');
            setTimeout(() => sd.classList.remove('score-pulse'), 550);

            setTimeout(() => this.nextQuestion(), 700);
        } else {
            this.app.playSound('wrong');
            // Shake the clicked button (if available)
            if (btnEl) {
                btnEl.classList.add('shake');
                setTimeout(() => btnEl.classList.remove('shake'), 450);
            }
            this.app.showFeedback('Coba lagi!', 'error', 600);
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) {
            this.app.endGame();
        } else {
            this.render();
        }
    }
}

class ColorLearnGame {
    constructor(appInstance, serverQuestions = null) {
        this.app = appInstance;
        this.currentQuestion = 0;

        if (Array.isArray(serverQuestions) && serverQuestions.length > 0) {
            // normalize server questions
            this.questions = serverQuestions.map((q, idx) => ({
                id: q.id || `q-${idx}`,
                question: q.title || q.question || `Pilih warna yang benar`,
                color: q.color || (q.options && q.options.find(o => o.label) && q.options.find(o => o.label).color) || 'red',
                options: q.options || [{ color: q.color || 'red', label: q.label || 'Merah' }]
            }));
        } else {
            // Expanded default questions
            this.questions = [
                { id: 1, question: 'Mana warna Merah?', color: 'red', options: [{ color: 'red', label: 'Merah' }, { color: 'blue', label: 'Biru' }, { color: 'green', label: 'Hijau' }] },
                { id: 2, question: 'Mana warna Biru?', color: 'blue', options: [{ color: 'yellow', label: 'Kuning' }, { color: 'blue', label: 'Biru' }, { color: 'red', label: 'Merah' }] },
                { id: 3, question: 'Mana warna Hijau?', color: 'green', options: [{ color: 'green', label: 'Hijau' }, { color: 'purple', label: 'Ungu' }, { color: 'orange', label: 'Oranye' }] },
                { id: 4, question: 'Mana warna Kuning?', color: 'yellow', options: [{ color: 'yellow', label: 'Kuning' }, { color: 'brown', label: 'Coklat' }, { color: 'black', label: 'Hitam' }] },
                { id: 5, question: 'Mana warna Ungu?', color: 'purple', options: [{ color: 'purple', label: 'Ungu' }, { color: 'pink', label: 'Pink' }, { color: 'blue', label: 'Biru' }] },
                { id: 6, question: 'Mana warna Coklat?', color: 'brown', options: [{ color: 'brown', label: 'Coklat' }, { color: 'orange', label: 'Oranye' }, { color: 'red', label: 'Merah' }] },
                { id: 7, question: 'Mana warna Pink?', color: 'pink', options: [{ color: 'pink', label: 'Pink' }, { color: 'purple', label: 'Ungu' }, { color: 'white', label: 'Putih' }] },
                { id: 8, question: 'Mana warna Hitam?', color: 'black', options: [{ color: 'black', label: 'Hitam' }, { color: 'gray', label: 'Abu-abu' }, { color: 'brown', label: 'Coklat' }] }
            ];
            // Shuffle questions
            this.questions.sort(() => Math.random() - 0.5);
        }

        this.render();
    }

    render() {
        const gameContent = document.getElementById('gameContent');
        const question = this.questions[this.currentQuestion];

        if (!question) {
            this.app.endGame();
            return;
        }

        // Shuffle options for display
        const opts = [...question.options].sort(() => Math.random() - 0.5);

        gameContent.innerHTML = `
            <div style="width:100%; max-width:540px; margin:0 auto;">
                <h3 style="text-align:center; margin-bottom:18px; font-size:22px;">${question.question}</h3>
                <div class="color-grid" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:14px;">
                    ${opts.map(o => `
                        <button class="color-card game-card" data-color="${o.color}" data-label="${o.label}" aria-label="${o.label}" style="background:${o.color};">
                            <div class="color-label" style="text-shadow: 0 1px 2px rgba(0,0,0,0.5); color: white;">${o.label}</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Attach handlers
        document.querySelectorAll('.color-card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const col = e.currentTarget.dataset.color;
                this.answer(col, e.currentTarget);
            });
        });

        window.colorGame = this;
    }

    async answer(selected, btnEl = null) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = selected === question.color;

        this.app.recordAttempt(isCorrect); // Track accuracy

        if (isCorrect) {
            this.app.playSound('correct');
            this.app.updateScore(10);
            if (btnEl) {
                btnEl.classList.add('selected');
                setTimeout(() => btnEl.classList.remove('selected'), 500);
            }
            this.app.showFeedback('Benar!', 'success', 650);
            this.app.createConfetti(10);

            setTimeout(() => this.nextQuestion(), 700);
        } else {
            this.app.playSound('wrong');
            if (btnEl) {
                btnEl.classList.add('wrong');
                setTimeout(() => btnEl.classList.remove('wrong'), 550);
            }
            this.app.showFeedback('Coba lagi!', 'error', 600);
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) {
            this.app.endGame();
        } else {
            this.render();
        }
    }
}

// (FindMatchGame logic is fine, skipping to keep file size down if possible, but tool requires contiguous replacement if I use ReplaceFileContent. 
// Actually FindMatchGame is in between ColorLearn and ShapeRecognition. 
// I will just use MultiReplaceFileContent or ReplaceFileContent carefully.
// I will SKIP FindMatchGame replacement since I'm not changing its logic significantly, only CSS was changed.
// I need to target ShapeRecognitionGame separately.)

// Placeholder for clarity, I will close ColorLearnGame and start ShapeRecognitionGame
// Wait, I cannot leave FindMatchGame content out if I use ReplaceFileContent on a range that includes it.
// I will modify `ShapeRecognitionGame` separately. This tool call is ONLY for `ColorLearnGame`? 
// No, the instruction said "Update ColorLearnGame AND ShapeRecognitionGame".
// I will split into two tool calls to be safe and accurate.
// First, ColorLearnGame.


class FindMatchGame {
    constructor(appInstance, serverQuestions = null) {
        this.app = appInstance;
        const defaultData = {
            animals: [
                { id: 'monkey', emoji: '🐒' },
                { id: 'cat', emoji: '🐱' },
                { id: 'rabbit', emoji: '🐰' },
                { id: 'dog', emoji: '🐶' },
                { id: 'cow', emoji: '🐮' }
            ],
            foods: [
                { id: 'monkey', emoji: '🍌' },
                { id: 'cat', emoji: '🐟' },
                { id: 'rabbit', emoji: '🥕' },
                { id: 'dog', emoji: '🦴' },
                { id: 'cow', emoji: '🌿' }
            ]
        };

        if (serverQuestions && serverQuestions.length > 0) {
            const q = serverQuestions[0];
            this.questionId = q.id || null;
            this.data = {
                animals: q.animals || defaultData.animals,
                foods: q.foods || defaultData.foods
            };
        } else {
            this.questionId = null;
            this.data = defaultData;
        }

        this.matchesFound = 0;
        this.selectedAnimal = null;
        this.selectedFood = null;

        this.render();
    }

    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div style="max-width:900px; margin: 0 auto; display:grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div id="animal-col"></div>
                <div id="food-col"></div>
                <div style="grid-column: 1/-1; text-align:center; margin-top:20px;">
                    <div>Sisa: <span id="remaining-count">${this.data.animals.length}</span></div>
                </div>
            </div>
        `;

        this.renderColumns();
    }

    renderColumns() {
        const animalCol = document.getElementById('animal-col');
        const foodCol = document.getElementById('food-col');
        const remainingEl = document.getElementById('remaining-count');

        animalCol.innerHTML = '';
        foodCol.innerHTML = '';

        // shuffle animals
        const animals = [...this.data.animals].sort(() => Math.random() - 0.5);
        // shuffle foods
        const foods = [...this.data.foods].sort(() => Math.random() - 0.5);

        animals.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'game-card-btn';
            btn.dataset.id = item.id;
            btn.dataset.type = 'animal';
            btn.setAttribute('aria-pressed', 'false');
            btn.innerHTML = `<span class="card-content">${item.emoji}</span><span class="match-badge" aria-hidden="true" style="display:none">✓</span>`;
            btn.addEventListener('click', () => this.handleCardClick(btn));
            animalCol.appendChild(btn);
        });

        foods.forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'game-card-btn';
            btn.dataset.id = item.id;
            btn.dataset.type = 'food';
            btn.setAttribute('aria-pressed', 'false');
            btn.innerHTML = `<span class="card-content">${item.emoji}</span><span class="match-badge" aria-hidden="true" style="display:none">✓</span>`;
            btn.addEventListener('click', () => this.handleCardClick(btn));
            foodCol.appendChild(btn);
        });

        remainingEl.innerText = this.data.animals.length - this.matchesFound;
        window.currentGame = this;
    }

    handleCardClick(btn) {
        // ignore clicks on matched/disabled
        if (btn.classList.contains('matched') || btn.classList.contains('disabled')) return;

        // reset any visual 'wrong' markers
        document.querySelectorAll('.wrong').forEach(el => el.classList.remove('wrong'));

        const type = btn.dataset.type;

        // Toggle selection if user clicks same selected item
        if (type === 'animal') {
            if (this.selectedAnimal === btn) {
                // unselect
                this.selectedAnimal.classList.remove('selected');
                this.selectedAnimal.setAttribute('aria-pressed', 'false');
                this.selectedAnimal = null;
                return;
            }

            if (this.selectedAnimal) {
                this.selectedAnimal.classList.remove('selected');
                this.selectedAnimal.setAttribute('aria-pressed', 'false');
            }

            this.selectedAnimal = btn;
            btn.classList.add('selected');
            btn.setAttribute('aria-pressed', 'true');
            // small pop effect
            btn.classList.add('pop-quick');
            setTimeout(() => btn.classList.remove('pop-quick'), 350);
        } else {
            if (this.selectedFood === btn) {
                this.selectedFood.classList.remove('selected');
                this.selectedFood.setAttribute('aria-pressed', 'false');
                this.selectedFood = null;
                return;
            }

            if (this.selectedFood) {
                this.selectedFood.classList.remove('selected');
                this.selectedFood.setAttribute('aria-pressed', 'false');
            }

            this.selectedFood = btn;
            btn.classList.add('selected');
            btn.setAttribute('aria-pressed', 'true');
            btn.classList.add('pop-quick');
            setTimeout(() => btn.classList.remove('pop-quick'), 350);
        }

        if (this.selectedAnimal && this.selectedFood) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const animalId = this.selectedAnimal.dataset.id;
        const foodId = this.selectedFood.dataset.id;

        if (animalId === foodId) {
            // Mark matched visually and disable them
            this.selectedAnimal.classList.add('matched');
            this.selectedFood.classList.add('matched');
            this.selectedAnimal.classList.remove('selected');
            this.selectedFood.classList.remove('selected');

            // show check badges
            const aBadge = this.selectedAnimal.querySelector('.match-badge');
            const fBadge = this.selectedFood.querySelector('.match-badge');
            if (aBadge) aBadge.style.display = 'inline-flex';
            if (fBadge) fBadge.style.display = 'inline-flex';

            this.selectedAnimal.classList.add('disabled');
            this.selectedFood.classList.add('disabled');

            this.matchesFound++;
            this.selectedAnimal = null;
            this.selectedFood = null;
            document.getElementById('remaining-count').innerText = this.data.animals.length - this.matchesFound;
            this.app.updateScore(10);
            // Visual & audio feedback
            this.app.playSound('correct');
            this.app.showFeedback('Cocok!', 'success', 700);
            this.app.createConfetti(8);
            // Submit match to server (best-effort)
            if (this.app.currentSessionId && this.questionId) {
                window.api.submitAnswer(this.app.currentSessionId, this.questionId, { pair: `${animalId}:${foodId}` }, 0).catch(e => {
                    console.warn('Submit match error', e);
                    if (e && e.message && e.message.includes('Session tidak ditemukan')) {
                        this.app.showFeedback('Sesi permainan hilang, kembali ke beranda.', 'error', 1400);
                        setTimeout(() => this.app.backToHome(), 900);
                    }
                });
            }
            if (this.matchesFound === this.data.animals.length) {
                setTimeout(() => this.app.endGame(), 500);
            }
        } else {
            // wrong - quick visual and allow user to try again
            if (this.selectedAnimal) this.selectedAnimal.classList.add('wrong');
            if (this.selectedFood) this.selectedFood.classList.add('wrong');
            this.app.playSound('wrong');
            this.app.showFeedback('Salah. Coba lagi!', 'error', 650);
            setTimeout(() => {
                if (this.selectedAnimal) this.selectedAnimal.classList.remove('wrong');
                if (this.selectedFood) this.selectedFood.classList.remove('wrong');
                if (this.selectedAnimal) this.selectedAnimal.classList.remove('selected');
                if (this.selectedFood) this.selectedFood.classList.remove('selected');
                this.selectedAnimal = null;
                this.selectedFood = null;
            }, 500);
        }
    }
}

// New game: Shape recognition
class ShapeRecognitionGame {
    constructor(appInstance, serverQuestions = null) {
        this.app = appInstance;
        this.currentQuestion = 0;

        if (Array.isArray(serverQuestions) && serverQuestions.length > 0) {
            this.questions = serverQuestions.map(q => ({ id: q.id, title: q.title || 'Pilih bentuk', shape: q.shape, options: q.options }));
        } else {
            // Updated default questions (No Oval)
            this.questions = [
                { id: 's1', title: 'Pilih bentuk Lingkaran', shape: { id: 'circle', name: 'Lingkaran', emoji: '⚪' }, options: [{ id: 'circle', name: 'Lingkaran' }, { id: 'square', name: 'Persegi' }, { id: 'triangle', name: 'Segitiga' }] },
                { id: 's2', title: 'Pilih bentuk Bintang', shape: { id: 'star', name: 'Bintang', emoji: '⭐' }, options: [{ id: 'star', name: 'Bintang' }, { id: 'heart', name: 'Hati' }, { id: 'diamond', name: 'Wajik' }] },
                { id: 's3', title: 'Pilih bentuk Persegi', shape: { id: 'square', name: 'Persegi', emoji: '⬛' }, options: [{ id: 'square', name: 'Persegi' }, { id: 'circle', name: 'Lingkaran' }, { id: 'rect', name: 'Persegi Panjang' }] },
                { id: 's4', title: 'Pilih bentuk Hati', shape: { id: 'heart', name: 'Hati', emoji: '❤️' }, options: [{ id: 'heart', name: 'Hati' }, { id: 'star', name: 'Bintang' }, { id: 'triangle', name: 'Segitiga' }] }
            ];
            this.questions.sort(() => Math.random() - 0.5);
        }

        this.render();
    }

    render() {
        const q = this.questions[this.currentQuestion];
        if (!q) {
            this.app.endGame();
            return;
        }

        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div style="max-width:540px; margin:0 auto; text-align:center;">
                <h3 style="font-size:22px; margin-bottom:12px;">${q.title}</h3>
                <div class="shape-display" style="font-size:100px; margin:20px 0; color:var(--primary);">${q.shape.emoji || ''}</div>
                <div style="display:grid; grid-template-columns: repeat(3,1fr); gap:15px;">
                    ${q.options.map(opt => `<button class="shape-btn game-card" data-id="${opt.id}">${opt.name}</button>`).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.shape-btn').forEach(btn => btn.addEventListener('click', (e) => this.answer(e.currentTarget.dataset.id, e.currentTarget)));
    }

    async answer(selectedId, btn) {
        const q = this.questions[this.currentQuestion];
        const correct = q.shape.id === selectedId;

        this.app.recordAttempt(correct);

        if (correct) {
            this.app.playSound('correct');
            this.app.updateScore(10);
            btn.classList.add('matched');
            this.app.showFeedback('Benar!', 'success', 600);
            setTimeout(() => this.nextQuestion(), 700);
        } else {
            this.app.playSound('wrong');
            btn.classList.add('wrong');
            setTimeout(() => btn.classList.remove('wrong'), 500);
            this.app.showFeedback('Coba lagi', 'error', 600);
        }
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) this.app.endGame(); else this.render();
    }
}

// New game: Alphabet Quiz
class AlphabetQuizGame {
    constructor(appInstance, serverQuestions = null) {
        this.app = appInstance;
        this.currentQuestion = 0;
        if (Array.isArray(serverQuestions) && serverQuestions.length > 0) {
            this.questions = serverQuestions.map(q => ({ id: q.id, letter: q.letter || q.title, options: q.options }));
        } else {
            this.questions = [
                { id: 'a1', letter: 'A', options: ['A', 'B', 'C'] },
                { id: 'a2', letter: 'B', options: ['D', 'B', 'F'] },
                { id: 'a3', letter: 'C', options: ['C', 'L', 'M'] }
            ];
        }
        this.render();
    }

    render() {
        const q = this.questions[this.currentQuestion];
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div style="max-width:520px; margin:0 auto; text-align:center;">
                <h3 style="font-size:22px; margin-bottom:12px;">Pilih huruf ${q.letter}</h3>
                <div style="font-size:90px; font-weight:800; margin: 10px 0;">${q.letter}</div>
                <div style="display:grid; grid-template-columns: repeat(3,1fr); gap:12px;">
                    ${q.options.map(opt => `<button class="alpha-btn game-card" data-val="${opt}">${opt}</button>`).join('')}
                </div>
            </div>
        `;
        document.querySelectorAll('.alpha-btn').forEach(btn => btn.addEventListener('click', (e) => this.answer(e.currentTarget.dataset.val, e.currentTarget)));
    }

    async answer(val, btn) {
        const q = this.questions[this.currentQuestion];
        const correct = val === q.letter;
        if (correct) {
            this.app.playSound('correct'); this.app.updateScore(8); btn.classList.add('matched'); this.app.showFeedback('Benar!', 'success', 600); setTimeout(() => this.nextQuestion(), 700);
        } else { this.app.playSound('wrong'); btn.classList.add('wrong'); setTimeout(() => btn.classList.remove('wrong'), 500); this.app.showFeedback('Salah', 'error', 600); }
    }

    nextQuestion() { this.currentQuestion++; if (this.currentQuestion >= this.questions.length) this.app.endGame(); else this.render(); }
}

// New game: Memory Pairs
class MemoryPairsGame {
    constructor(appInstance, serverQuestions = null) {
        this.app = appInstance;
        if (Array.isArray(serverQuestions) && serverQuestions.length > 0) {
            const q = serverQuestions[0];
            this.cards = q.cards || [];
        } else {
            // Default pair of cards (shuffled)
            const emojis = ['🐶', '🐱', '🐰', '🐼', '🦊', '🦁'];
            // Create pairs
            this.cards = [];
            emojis.forEach((emoji, idx) => {
                this.cards.push({ id: idx * 2, emoji: emoji });
                this.cards.push({ id: idx * 2 + 1, emoji: emoji, matchId: idx * 2 });
            });
        }

        // Shuffle cards
        this.cards.sort(() => Math.random() - 0.5);

        this.flipped = [];
        this.matched = new Set();
        this.render();
    }

    render() {
        const gameContent = document.getElementById('gameContent');
        const grid = this.cards.map(c => `<div class="memory-card" data-id="${c.id}"><div class="mem-inner"><div class="mem-front">${c.emoji}</div><div class="mem-back">❓</div></div></div>`).join('');
        gameContent.innerHTML = `
            <div style="max-width:560px; margin:0 auto;">
                <div class="memory-grid">${grid}</div>
            </div>
        `;
        document.querySelectorAll('.memory-card').forEach(el => el.addEventListener('click', (e) => this.flip(e.currentTarget)));
    }

    flip(cardEl) {
        const id = cardEl.dataset.id;
        // Ignore if already matched, already flipped, or if 2 cards are already flipping
        if (this.matched.has(id) || cardEl.classList.contains('flipped') || this.flipped.length >= 2) return;

        cardEl.classList.add('flipped');
        this.flipped.push(cardEl);

        if (this.flipped.length === 2) {
            const [a, b] = this.flipped;
            // Trim to avoid whitespace issues
            const aEmoji = a.querySelector('.mem-front').textContent.trim();
            const bEmoji = b.querySelector('.mem-front').textContent.trim();

            if (aEmoji === bEmoji) {
                // Match found
                this.matched.add(a.dataset.id);
                this.matched.add(b.dataset.id);
                this.app.playSound('correct');
                this.app.updateScore(12);
                this.app.createConfetti(10);

                setTimeout(() => {
                    a.classList.add('matched');
                    b.classList.add('matched');
                    this.flipped = [];
                    // Check win condition
                    if (this.matched.size === this.cards.length) {
                        this.app.showFeedback('Menang!', 'success', 1000);
                        setTimeout(() => this.app.endGame(), 800);
                    }
                }, 500);
            } else {
                // No match
                this.app.playSound('wrong');
                setTimeout(() => {
                    a.classList.remove('flipped');
                    b.classList.remove('flipped');
                    this.flipped = [];
                }, 800);
            }
        }
    }
}

class MazeRabbitGame {
    constructor(appInstance, serverQuestions = null) {
        this.app = appInstance;
        this.layout = (serverQuestions && serverQuestions.length > 0 && serverQuestions[0].layout) ? serverQuestions[0].layout : [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 0, 0, 1, 1, 3, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];

        this.start = (serverQuestions && serverQuestions.length > 0 && serverQuestions[0].start) ? serverQuestions[0].start : { x: 1, y: 1 };
        this.playerPos = { ...this.start };
        this.rows = this.layout.length;
        this.cols = this.layout[0].length;
        this.isGameActive = true;
        this.visited = new Set(); // track visited cells for footprints
        // Initialize visited with start position
        this.visited.add(`${this.start.x}:${this.start.y}`);

        this.render();
    }

    render() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
                <div id="maze-grid" style="display:grid; gap:4px;"></div>
                <div style="display:flex; gap:8px; margin-top:12px;">
                    <button id="btn-up" class="btn btn-primary" aria-label="Atas">⬆️</button>
                    <button id="btn-left" class="btn btn-secondary" aria-label="Kiri">⬅️</button>
                    <button id="btn-reset" class="btn btn-accent">Ulang</button>
                    <button id="btn-right" class="btn btn-secondary" aria-label="Kanan">➡️</button>
                    <button id="btn-down" class="btn btn-primary" aria-label="Bawah">⬇️</button>
                </div>
            </div>
        `;

        this.buildGrid();
        this.updatePlayerPosition();

        // Controls
        document.getElementById('btn-up').addEventListener('click', () => this.movePlayer(0, -1));
        document.getElementById('btn-left').addEventListener('click', () => this.movePlayer(-1, 0));
        document.getElementById('btn-right').addEventListener('click', () => this.movePlayer(1, 0));
        document.getElementById('btn-down').addEventListener('click', () => this.movePlayer(0, 1));
        document.getElementById('btn-reset').addEventListener('click', () => this.resetGame());

        // keyboard
        this.keyHandler = (e) => {
            switch (e.key) {
                case 'ArrowUp': this.movePlayer(0, -1); break;
                case 'ArrowDown': this.movePlayer(0, 1); break;
                case 'ArrowLeft': this.movePlayer(-1, 0); break;
                case 'ArrowRight': this.movePlayer(1, 0); break;
            }
        };
        document.addEventListener('keydown', this.keyHandler);

        window.currentGame = this;
    }

    buildGrid() {
        const mazeGrid = document.getElementById('maze-grid');
        mazeGrid.innerHTML = '';
        mazeGrid.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        const cellSize = Math.min(window.innerWidth / this.cols - 8, 35);

        this.layout.forEach((row, y) => {
            row.forEach((cell, x) => {
                const div = document.createElement('div');
                div.className = 'maze-cell';
                div.style.width = `${cellSize}px`;
                div.style.height = `${cellSize}px`;
                div.id = `cell-${x}-${y}`;
                div.style.display = 'flex';
                div.style.alignItems = 'center';
                div.style.justifyContent = 'center';

                if (cell === 1) {
                    div.classList.add('wall');
                } else {
                    div.classList.add('path');
                }
                if (cell === 3) div.innerHTML = '🥕';
                mazeGrid.appendChild(div);
            });
        });
    }

    updatePlayerPosition() {
        // clear previous player markers
        document.querySelectorAll('.maze-cell.player').forEach(el => {
            el.classList.remove('player');
            // If it was a goal, keep carrot. If simply visited, keep footprint.
            // Actually we re-render footprints next loop.
            // Just clear player content (rabbit) but keep others?
            // Simpler: re-render cell content based on static map + dynamic overlays
        });

        // Re-render visited footprints
        this.visited.forEach(coord => {
            const [x, y] = coord.split(':').map(Number);
            const vcell = document.getElementById(`cell-${x}-${y}`);
            if (vcell && !vcell.classList.contains('wall')) {
                // Ensure footprint is present if no player
                if (!vcell.innerHTML.includes('👣') && !vcell.innerHTML.includes('🐰') && !vcell.innerHTML.includes('🥕')) {
                    vcell.classList.add('visited');
                    const span = document.createElement('span');
                    span.className = 'footprint';
                    span.textContent = '👣';
                    vcell.appendChild(span);
                }
            }
        });

        const cell = document.getElementById(`cell-${this.playerPos.x}-${this.playerPos.y}`);
        if (cell) {
            // Remove footprint if present to show rabbit clearly
            const footprint = cell.querySelector('.footprint');
            if (footprint) footprint.remove();

            cell.classList.add('player');
            cell.innerHTML = '🐰';
            // tiny bounce to emphasize movement
            cell.classList.add('player-bounce');
            setTimeout(() => cell.classList.remove('player-bounce'), 360);
        }
    }

    movePlayer(dx, dy) {
        if (!this.isGameActive) return;
        const newX = this.playerPos.x + dx;
        const newY = this.playerPos.y + dy;

        // Check bounds and walls
        if (newY >= 0 && newY < this.rows && newX >= 0 && newX < this.cols && this.layout[newY][newX] !== 1) {
            // Add CURRENT position to visited before leaving
            this.visited.add(`${this.playerPos.x}:${this.playerPos.y}`);

            this.playerPos.x = newX;
            this.playerPos.y = newY;

            // Add NEW position to visited as well (immediately visited)
            this.visited.add(`${newX}:${newY}`);

            this.updatePlayerPosition();
            this.checkWin();
        } else {
            // Hit wall feedback
            this.app.playSound('wrong');
        }
    }

    checkWin() {
        if (this.layout[this.playerPos.y][this.playerPos.x] === 3) {
            this.isGameActive = false;
            // Visual & audio completion feedback
            this.app.playSound('complete');
            this.app.showFeedback('Selesai!', 'success', 1000);
            this.app.createConfetti(20);

            this.app.recordAttempt(true); // Count as a success
            this.app.updateScore(50); // Big bonus for maze

            // Submit completion to server (best-effort)
            if (this.app.currentSessionId) {
                window.api.submitAnswer(this.app.currentSessionId, this.app.currentGameId || 'maze_rabbit', { completed: true }, 0).catch(e => console.warn('Submit maze completion', e));
            }
            setTimeout(() => this.app.endGame(), 800);
        }
    }

    resetGame() {
        this.playerPos = { ...this.start };
        this.isGameActive = true;
        this.visited.clear();
        this.visited.add(`${this.start.x}:${this.start.y}`);

        // Clear all footprints
        document.querySelectorAll('.footprint').forEach(el => el.remove());
        document.querySelectorAll('.visited').forEach(el => el.classList.remove('visited'));

        this.updatePlayerPosition();
    }
}

export { MiniGamesApp };
