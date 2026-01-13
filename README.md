# 🎮 Mini Games PAUD - Aplikasi Game Edukatif Anak

> Aplikasi game interaktif profesional untuk anak PAUD (usia 2-5 tahun) dengan fokus pada pembelajaran, perkembangan kognitif, dan kesenangan.

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi](#teknologi)
- [Setup & Instalasi](#setup--instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [API Endpoints](#api-endpoints)
- [Struktur Folder](#struktur-folder)
- [Game yang Tersedia](#game-yang-tersedia)
- [Deployment ke Vercel](#deployment-ke-vercel)
- [Development Guide](#development-guide)

---

## ✨ Fitur Utama

### 🎯 Game Features
- **6+ Game Edukatif**: Dirancang khusus untuk anak PAUD
- **Filtrasi Usia**: Pilih game sesuai usia anak (2-5 tahun)
- **Scoring System**: Sistem poin yang memotivasi anak
- **Visual Engaging**: Desain colorful dan child-friendly
- **Sound Effects**: Audio feedback untuk interaksi
- **Responsive Design**: Berjalan sempurna di mobile, tablet, desktop

### 👶 Perkembangan Anak
- **Counting Skills**: Belajar menghitung dengan visual
- **Color Recognition**: Kenal berbagai warna
- **Pattern Matching**: Pengembangan memory dan logika
- **Motor Skills**: Latihan fine motor melalui interaksi
- **Language Development**: Pembelajaran kosa kata baru
- **Problem Solving**: Puzzle dan maze untuk critical thinking

### 📊 User Management
- **Player Profiles**: Simpan nama pemain
- **Score Tracking**: Catat skor setiap game
- **Leaderboard**: Kompetisi sehat antar pemain
- **Progress Analytics**: Monitor perkembangan anak

---

## 🛠 Teknologi

### Backend
- **Node.js** (v18+)
- **Express.js** - Web framework
- **CORS** - Cross-origin handling
- **Helmet** - Security middleware
- **Compression** - Response compression
- **Rate Limiting** - API protection
- **UUID** - Session management

### Frontend
- **Vanilla JavaScript** (No jQuery needed)
- **HTML5** - Semantic markup
- **CSS3** - Modern styling, animations
- **Fetch API** - Async communication
- **LocalStorage** - Client-side data persistence

### Deployment
- **Vercel** - Serverless hosting
- **Docker** - Containerization (optional)

---

## 🚀 Setup & Instalasi

### Prerequisites
```bash
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git (untuk version control)
```

### Step 1: Clone atau Download Project
```bash
cd c:\www\mini_games\mini-games-app
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment
```bash
# Copy file example ke .env
copy .env.example .env

# Edit .env sesuai kebutuhan (opsional untuk development)
```

### Step 4: Verifikasi Instalasi
```bash
npm list
```

---

## ▶️ Menjalankan Aplikasi

### Development Mode
```bash
# Mode watch dengan auto-reload
npm run dev

# Akan running di: http://localhost:3000
```

### Production Mode
```bash
# Start server
npm start

# Akan running di port yang ditentukan di .env (default 3000)
```

### Menggunakan PowerShell (Windows)
```powershell
# Install dependencies
npm install

# Run development
npm run dev

# Atau run production
npm start
```

---

## 🔌 API Endpoints

### Health Check
```
GET /api/health
Response: { success: true, message: "API is running" }
```

### Games API

#### Get All Games
```
GET /api/games
Response: 
{
  "success": true,
  "data": [
    {
      "id": "counting_fruits",
      "name": "Hitung Buah 🍎",
      "category": "counting",
      "difficulty": "easy",
      "ageRange": "2-5",
      ...
    }
  ]
}
```

#### Get Game by ID
```
GET /api/games/:gameId
Example: GET /api/games/counting_fruits
```

#### Get Games by Category
```
GET /api/games/category/:category
Example: GET /api/games/category/counting
```

#### Get Games by Age
```
GET /api/games/age/:age
Example: GET /api/games/age/3
```

#### Get Game Categories
```
GET /api/games/categories
```

### Gameplay API

#### Start Game Session
```
POST /api/gameplay/start
Body: { "gameId": "counting_fruits", "playerId": "John" }
Response: { "sessionId": "uuid", "gameId": "...", ... }
```

#### Submit Answer
```
POST /api/gameplay/:sessionId/answer
Body: { "questionId": 1, "answer": 3, "timeSpent": 15 }
Response: { "isCorrect": true, "points": 10, "totalScore": 10 }
```

#### End Game Session
```
POST /api/gameplay/:sessionId/end
Response: { "finalScore": 100, "accuracy": "100%", "badge": {...} }
```

#### Get Session Details
```
GET /api/gameplay/:sessionId
```

### Leaderboard API

#### Get Leaderboard
```
GET /api/leaderboard?gameId=counting_fruits&limit=10
```

#### Get Player Stats
```
GET /api/leaderboard/:playerId
```

#### Add Score
```
POST /api/leaderboard/score
Body: { "playerId": "John", "gameId": "counting_fruits", "score": 100, "accuracy": 100 }
```

---

## 📁 Struktur Folder

```
mini-games-app/
├── src/
│   ├── index.js                          # Entry point server
│   ├── api/
│   │   ├── routes/
│   │   │   ├── games.js                 # Game listing routes
│   │   │   ├── gameplay.js              # Game session routes
│   │   │   ├── leaderboard.js           # Leaderboard routes
│   │   │   └── health.js                # Health check
│   │   ├── controllers/
│   │   │   ├── gamesController.js       # Game business logic
│   │   │   ├── gameplayController.js    # Game session logic
│   │   │   └── leaderboardController.js # Leaderboard logic
│   │   ├── middleware/                   # (future expansion)
│   │   └── utils/                        # Utility functions
│   └── games/
│       └── config/
│           └── gamesConfig.js            # Game configurations
├── public/
│   ├── index.html                        # Main HTML
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css                # Main styles
│   │   │   └── games.css                # Game-specific styles
│   │   ├── js/
│   │   │   ├── api-client.js            # API communication
│   │   │   ├── app.js                   # Main app logic
│   │   │   └── games/
│   │   │       ├── counting-fruits.js
│   │   │       ├── color-learn.js
│   │   │       └── find-match.js
│   │   └── images/                       # Game assets
├── package.json                          # Dependencies
├── .env.example                          # Example environment
├── .gitignore                            # Git ignore rules
├── vercel.json                           # Vercel deployment config
└── README.md                             # This file
```

---

## 🎮 Game yang Tersedia

### 1. 🍎 Hitung Buah (Counting Fruits)
**Deskripsi**: Anak menghitung buah-buahan dan memilih jumlah yang benar  
**Usia**: 2-5 tahun  
**Kesulitan**: Mudah  
**Skill yang dikembangkan**: Counting, number recognition, visual attention

### 2. 🌈 Belajar Warna (Color Learn)
**Deskripsi**: Identifikasi dan pelajari berbagai warna  
**Usia**: 2-4 tahun  
**Kesulitan**: Mudah  
**Skill yang dikembangkan**: Color recognition, visual discrimination

### 3. 🦁 Pasang Hewan (Find Match Animals)
**Deskripsi**: Pasangkan hewan dengan pasangannya  
**Usia**: 3-5 tahun  
**Kesulitan**: Sedang  
**Skill yang dikembangkan**: Memory, pattern recognition, concentration

### 4. 🐰 Maze Kelinci (Maze Rabbit)
**Deskripsi**: Bantu kelinci keluar dari labirin  
**Usia**: 3-5 tahun  
**Kesulitan**: Sedang  
**Skill yang dikembangkan**: Problem solving, motor skills, planning

### 5. 🔤 Kuis Huruf (Alphabet Quiz)
**Deskripsi**: Pelajari huruf dan suaranya  
**Usia**: 3-5 tahun  
**Kesulitan**: Sedang  
**Skill yang dikembangkan**: Letter recognition, phonics, language

### 6. 🟠 Kenal Bentuk (Shape Recognition)
**Deskripsi**: Kenali berbagai bentuk geometri  
**Usia**: 3-5 tahun  
**Kesulitan**: Mudah  
**Skill yang dikembangkan**: Shape recognition, visual processing

---

## 🌐 Deployment ke Vercel

### Step 1: Siapkan Project di GitHub
```bash
# Initialize git jika belum
git init
git add .
git commit -m "Initial commit: Mini Games PAUD"

# Push ke GitHub
git push origin main
```

### Step 2: Connect ke Vercel
1. Buka https://vercel.com
2. Login/Sign up dengan akun GitHub
3. Import project dari GitHub
4. Vercel akan auto-detect Express.js setup

### Step 3: Deploy
```bash
# Automatic deployment on git push
# atau manual:
# npm install -g vercel
# vercel
```

### Step 4: Konfigurasi
File `vercel.json` sudah siap, yang akan:
- Route `/api/*` ke Express server
- Serve static files dari `public/`
- Auto-scaling serverless functions

### URL Deployment
```
https://mini-games-paud.vercel.app
```

---

## 💻 Development Guide

### Menambah Game Baru

#### 1. Tambah Config di `gamesConfig.js`
```javascript
// src/games/config/gamesConfig.js
export const GAMES_CONFIG = {
  // ... existing games ...
  my_new_game: {
    id: 'my_new_game',
    name: 'Nama Game 🎮',
    description: 'Deskripsi singkat',
    category: 'learning',
    difficulty: 'easy',
    ageRange: '3-5',
    icon: '🎮',
    duration: 120,
    questions: 10,
    rewards: { correct: 10, wrongAttempt: 0, completion: 50 }
  }
};
```

#### 2. Buat Game Class di `public/assets/js/app.js`
```javascript
class MyNewGame {
  constructor(appInstance) {
    this.app = appInstance;
    this.currentQuestion = 0;
    this.questions = [/* game questions */];
    this.render();
  }

  render() {
    // Render game UI
  }

  answer(selected) {
    // Handle answer logic
  }

  nextQuestion() {
    // Move to next question
  }
}
```

#### 3. Update `loadGameUI()` di `app.js`
```javascript
loadGameUI(gameId) {
  switch(gameId) {
    case 'my_new_game':
      new MyNewGame(this);
      break;
    // ... other games ...
  }
}
```

### Styling Guide

**Colors** (CSS Variables):
- `--primary`: #FF6B6B (Red)
- `--secondary`: #4ECDC4 (Cyan)
- `--success`: #51CF66 (Green)
- `--warning`: #FFD93D (Yellow)
- `--info`: #4A90E2 (Blue)

**Fonts**:
- Font Family: 'Fredoka' (Child-friendly)
- Size: Use `clamp()` untuk responsive

**Animations**:
- Use CSS `@keyframes` untuk smooth transitions
- Prefer GPU-accelerated properties: `transform`, `opacity`

### Best Practices

1. **Accessibility**:
   - Use semantic HTML
   - Provide alt text for images
   - Ensure color contrast ratio > 4.5:1
   - Support keyboard navigation

2. **Performance**:
   - Lazy load assets
   - Minimize JavaScript
   - Compress images
   - Use efficient API calls

3. **Child Safety**:
   - No external links
   - No ads or trackers
   - Appropriate content only
   - Clear parental guidelines

4. **Code Quality**:
   - Follow naming conventions
   - Add JSDoc comments
   - Test on multiple devices
   - Use error handling

---

## 🔒 Security

### Implemented Security Measures
- **Helmet.js** - HTTP headers security
- **CORS** - Cross-origin protection
- **Rate Limiting** - DDoS protection
- **Input Validation** - Safe data handling
- **No Sensitive Data** - No storage of personal info

### Best Practices
- Never store passwords
- Use HTTPS in production
- Validate all user inputs
- Keep dependencies updated
- Implement CSRF protection (when needed)

---

## 🐛 Troubleshooting

### Port sudah terpakai
```bash
# Ganti port di .env
PORT=3001

# Atau kill process di port 3000
# Windows: netstat -ano | findstr :3000
# Linux/Mac: lsof -i :3000 | kill -9 <PID>
```

### API tidak merespons
```bash
# Check server status
curl http://localhost:3000/api/health

# Check logs di console
# Pastikan npm install sudah dijalankan
npm install
```

### Games tidak muncul
```bash
# Clear browser cache
# Check console untuk errors (F12 > Console)
# Verifikasi API responses di Network tab
```

---

## 📱 Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Latest 2 versions | Recommended |
| Firefox | ✅ Latest 2 versions | Good support |
| Safari  | ✅ Latest 2 versions | iOS optimized |
| Edge    | ✅ Latest version | Good performance |
| IE11    | ❌ Not supported | Use modern browser |

---

## 📊 Performance Metrics

**Target Performance**:
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3s

**Optimization Tips**:
- Use CDN untuk assets statis
- Implement lazy loading
- Minify CSS/JS
- Compress images
- Enable GZIP compression

---

## 🎓 Educational Value

### Perkembangan Kognitif (Piaget)
- **Sensorimotor** (0-2): Tidak di-support
- **Preoperational** (2-7): ✅ Target usia 2-5
- **Concrete Operational** (7-11): Parsial

### Learning Objectives
- ✅ Counting & Numbers
- ✅ Color Recognition
- ✅ Shape Identification
- ✅ Pattern Matching
- ✅ Memory Building
- ✅ Problem Solving
- ✅ Language Development
- ✅ Motor Skills

---

## 📞 Support & Contact

### Issues & Bug Reports
- GitHub Issues (jika di-host di GitHub)
- Email: support@miniGamesPAUD.com

### Contributing
1. Fork project
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

Project ini menggunakan **MIT License** - lihat file [LICENSE](LICENSE) untuk detail.

---

## 🙏 Terima Kasih

Dibuat dengan ❤️ untuk mendukung perkembangan anak usia dini.

### Contributors
- Mini Games Development Team

### Thanks to
- Express.js community
- Child development experts
- Educational researchers

---

## 📚 Resources

### Learning Materials
- [Express.js Documentation](https://expressjs.com)
- [MDN Web Docs](https://developer.mozilla.org)
- [Child Development](https://www.apa.org/science/about/psa/children)

### Tools
- [Vercel](https://vercel.com) - Hosting
- [GitHub](https://github.com) - Version control
- [Node.js](https://nodejs.org) - Runtime

---

**Happy Gaming! 🎮🎉**

Last Updated: Januari 2024  
Version: 1.0.0
