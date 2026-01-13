# 🎮 Mini Games PAUD - Panduan Instalasi & Penggunaan

## 📦 Quick Start (5 Menit)

### 1️⃣ Buka Terminal/PowerShell
```powershell
# Windows PowerShell
cd c:\www\mini_games\mini-games-app
```

### 2️⃣ Install Dependencies
```powershell
npm install
```

### 3️⃣ Jalankan Server
```powershell
# Development mode (dengan auto-reload)
npm run dev

# Atau production mode
npm start
```

### 4️⃣ Buka Browser
```
http://localhost:3000
```

---

## 🎯 Struktur File & Penjelasan

### Frontend (Public Folder)
```
public/
├── index.html           ← Main HTML file (halaman utama)
├── assets/
│   ├── css/
│   │   ├── style.css    ← Styling utama (colorful, child-friendly)
│   │   └── games.css    ← Game-specific styles
│   └── js/
│       ├── api-client.js        ← Komunikasi dengan API
│       ├── app.js               ← Logic aplikasi (games, navigation)
│       └── games/
│           ├── counting-fruits.js
│           ├── color-learn.js
│           └── find-match.js
```

**Penjelasan**:
- `index.html` - Halaman pertama yang dimuat browser
- `api-client.js` - Mengirim/menerima data dari server
- `app.js` - Mengatur alur game dan UI

### Backend (Src Folder)
```
src/
├── index.js                 ← Server Express (PORT 3000)
├── games/
│   └── config/
│       └── gamesConfig.js   ← Konfigurasi semua games
└── api/
    ├── routes/
    │   ├── games.js         ← Endpoints untuk list games
    │   ├── gameplay.js      ← Endpoints untuk bermain
    │   ├── leaderboard.js   ← Endpoints untuk skor
    │   └── health.js        ← Health check
    └── controllers/
        ├── gamesController.js
        ├── gameplayController.js
        └── leaderboardController.js
```

**Penjelasan**:
- Server menerima request dari frontend
- Mengirim data games, handle scoring
- Simpan data sementara (bisa diperluas ke database)

---

## 🎮 Cara Menambah Game Baru

### Langkah 1: Tambah di Config
Edit `src/games/config/gamesConfig.js`:

```javascript
export const GAMES_CONFIG = {
  // ... games lainnya ...
  
  // TAMBAH GAME BARU
  my_quiz_game: {
    id: 'my_quiz_game',
    name: 'Nama Game 🎯',
    description: 'Deskripsi permainan',
    category: 'quiz',           // learning, counting, matching, puzzle
    difficulty: 'easy',         // easy, medium, hard
    ageRange: '3-5',           // '2-3', '3-4', '4-5', '2-5'
    icon: '🎯',                // Emoji icon
    duration: 120,             // Durasi dalam detik
    questions: 10,             // Jumlah pertanyaan
    colorful: true,
    sounds: true,
    rewards: {
      correct: 10,             // Poin per jawaban benar
      wrongAttempt: 0,
      completion: 50           // Bonus selesai game
    }
  }
};
```

### Langkah 2: Buat Game Class
Edit `public/assets/js/app.js`, tambahkan sebelum `// Initialize app`:

```javascript
// ========== MY QUIZ GAME ==========
class MyQuizGame {
  constructor(appInstance) {
    this.app = appInstance;
    this.currentQuestion = 0;
    this.questions = [
      {
        id: 1,
        question: 'Pertanyaan 1?',
        options: ['Opsi A', 'Opsi B', 'Opsi C'],
        correct: 'Opsi A'
      },
      {
        id: 2,
        question: 'Pertanyaan 2?',
        options: ['Opsi A', 'Opsi B', 'Opsi C'],
        correct: 'Opsi B'
      }
      // Tambah lebih banyak pertanyaan
    ];

    this.render();
  }

  render() {
    const gameContent = document.getElementById('gameContent');
    const question = this.questions[this.currentQuestion];

    if (!question) {
      this.app.endGame();
      return;
    }

    gameContent.innerHTML = `
      <div style="width: 100%; max-width: 500px;">
        <h3 style="text-align: center; margin-bottom: 30px; font-size: 24px;">
          ${question.question}
        </h3>
        <div style="display: grid; gap: 10px;">
          ${question.options.map(option => `
            <button onclick="window.myQuizGame.answer('${option}')" 
                    style="
                      padding: 15px;
                      font-size: 16px;
                      border: 3px solid #ccc;
                      border-radius: 12px;
                      background: white;
                      cursor: pointer;
                      font-weight: 600;
                      transition: all 0.3s;
                    ">
              ${option}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    window.myQuizGame = this;
  }

  answer(selected) {
    const question = this.questions[this.currentQuestion];
    const isCorrect = selected === question.correct;

    if (isCorrect) {
      this.app.playSound('correct');
      this.app.updateScore(10);
      setTimeout(() => this.nextQuestion(), 1000);
    } else {
      this.app.playSound('wrong');
      alert('Jawaban salah. Coba lagi!');
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
```

### Langkah 3: Register di loadGameUI()
Edit fungsi `loadGameUI(gameId)` dalam class `MiniGamesApp`:

```javascript
loadGameUI(gameId) {
  const gameContent = document.getElementById('gameContent');
  gameContent.innerHTML = '';

  switch(gameId) {
    case 'counting_fruits':
      new CountingFruitsGame(this);
      break;
    case 'color_learn':
      new ColorLearnGame(this);
      break;
    case 'find_match_animals':
      new FindMatchGame(this);
      break;
    
    // ← TAMBAH INI
    case 'my_quiz_game':
      new MyQuizGame(this);
      break;
    
    default:
      gameContent.innerHTML = '<p>Game belum diimplementasikan</p>';
  }
}
```

### Langkah 4: Test
1. Simpan file
2. Server otomatis reload (npm run dev)
3. Refresh browser
4. Game baru akan muncul di list

---

## 🎨 Kustomisasi Tampilan

### Mengubah Warna Utama
Edit `public/assets/css/style.css`:

```css
:root {
    --primary: #FF6B6B;              /* Warna tombol utama */
    --primary-dark: #FF5252;         /* Warna saat hover */
    --secondary: #4ECDC4;            /* Warna sekunder */
    --success: #51CF66;              /* Warna benar */
    --warning: #FFD93D;              /* Warna warning */
    --danger: #FF6B6B;               /* Warna salah */
}
```

### Mengubah Font
```css
@import url('https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap');

:root {
    --font-primary: 'YOUR_FONT', sans-serif;
}
```

### Menambah Sound Effects
Di `public/index.html`, ganti audio base64:

```html
<!-- Ganti dengan URL file audio -->
<audio id="correctSound" src="/assets/sounds/correct.mp3" preload="auto"></audio>
<audio id="wrongSound" src="/assets/sounds/wrong.mp3" preload="auto"></audio>
<audio id="completeSound" src="/assets/sounds/complete.mp3" preload="auto"></audio>
```

---

## 📊 Mengubah Reward Points

Edit `src/games/config/gamesConfig.js`:

```javascript
rewards: {
  correct: 10,        // Ubah dari 10 ke nilai lain
  wrongAttempt: 0,    // Boleh negative untuk penalty
  completion: 50      // Bonus jika selesai
}
```

---

## 🚀 Deploy ke Vercel

### Langkah 1: Upload ke GitHub
```powershell
# Install git jika belum
# https://git-scm.com/download/win

git init
git add .
git commit -m "Mini Games PAUD v1.0.0"
git branch -M main
git remote add origin https://github.com/USERNAME/mini-games-paud.git
git push -u origin main
```

### Langkah 2: Deploy di Vercel
1. Buka https://vercel.com
2. Klik "New Project"
3. Import GitHub repository
4. Klik "Deploy"
5. Tunggu selesai (±1-2 menit)

### URL Production
```
https://mini-games-paud.vercel.app
```

---

## 🔧 API Endpoints untuk Testing

Buka Postman atau Thunder Client:

### Test API
```
GET http://localhost:3000/api/health
```

### Get Semua Games
```
GET http://localhost:3000/api/games
```

### Start Game
```
POST http://localhost:3000/api/gameplay/start
Content-Type: application/json

{
  "gameId": "counting_fruits",
  "playerId": "anak saya"
}
```

---

## ⚙️ Environment Variables

Edit `.env` untuk kustomisasi:

```env
NODE_ENV=development        # development atau production
PORT=3000                   # Port server
APP_NAME=Mini Games PAUD    # Nama aplikasi
APP_URL=http://localhost:3000
CORS_ORIGIN=*              # Untuk access from anywhere
LOG_LEVEL=info
```

---

## 🐛 Common Issues & Solutions

### ❌ "Port 3000 is already in use"
```powershell
# Matikan process di port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Atau ubah port di .env
PORT=3001
```

### ❌ "npm: command not found"
```powershell
# Install Node.js dari https://nodejs.org/
# Restart PowerShell setelah install

# Verifikasi instalasi
node --version
npm --version
```

### ❌ "Cannot find module 'express'"
```powershell
# Install dependencies
npm install
```

### ❌ "Games tidak muncul"
```powershell
# Clear cache browser (Ctrl+Shift+Del)
# Atau buka di Private/Incognito window
# Check console (F12 > Console) untuk error
```

---

## 📚 File Penting untuk Diedit

| File | Fungsi | Kapan Diedit |
|------|--------|--------------|
| `src/games/config/gamesConfig.js` | Konfigurasi games | Tambah game baru |
| `public/assets/js/app.js` | Logic aplikasi | Tambah game class |
| `public/assets/css/style.css` | Styling utama | Ubah warna/font |
| `public/index.html` | Struktur HTML | Rare (struktur sudah ok) |
| `.env` | Konfigurasi | Setup environment |

---

## ✅ Checklist Pre-Launch

- [ ] Semua games berfungsi
- [ ] Testing di mobile/tablet
- [ ] Sound effects aktif
- [ ] Scoring system jalan
- [ ] UI responsif
- [ ] No console errors
- [ ] Database/Leaderboard setup
- [ ] Deploy ke Vercel
- [ ] Share URL dengan orang tua

---

## 📞 Butuh Bantuan?

### Quick Debug
```powershell
# Cek apakah server jalan
curl http://localhost:3000/api/health

# Cek log di console
# F12 > Console tab

# Cek network requests
# F12 > Network tab
```

### Manual Testing
1. Buka http://localhost:3000
2. Input nama pemain
3. Pilih game
4. Mainkan game
5. Lihat score di results

---

## 🎉 Selesai!

Aplikasi sudah siap digunakan. Nikmati!

```
🎮 Happy Gaming! 🎮
```

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Status**: Production Ready ✅
