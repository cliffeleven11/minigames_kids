# 🏗️ Arsitektur Aplikasi Mini Games PAUD

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                         │
│                  (index.html + JS + CSS)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Frontend Apps                                         │ │
│  │  - Home Page (Game List)                              │ │
│  │  - Game Page (Interactive Game)                       │ │
│  │  - Results Page (Score & Stats)                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Client                                            │ │
│  │  - Fetch API Wrapper                                  │ │
│  │  - Error Handling                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Local Storage                                         │ │
│  │  - Player Name                                        │ │
│  │  - Selected Age                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────────┐
│                   EXPRESS.JS SERVER                         │
│                    (src/index.js)                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Middleware Stack                                      │ │
│  │  - Helmet (Security)                                  │ │
│  │  - CORS (Cross-Origin)                                │ │
│  │  - Compression (Gzip)                                 │ │
│  │  - Rate Limiting                                      │ │
│  │  - Body Parser (JSON)                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Routes                                            │ │
│  │  ├─ /api/games (games endpoints)                      │ │
│  │  ├─ /api/gameplay (session endpoints)                 │ │
│  │  ├─ /api/leaderboard (score endpoints)                │ │
│  │  └─ /api/health (health check)                        │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Controllers                                           │ │
│  │  ├─ gamesController.js                                │ │
│  │  ├─ gameplayController.js                             │ │
│  │  └─ leaderboardController.js                          │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Game Configuration                                   │ │
│  │  └─ gamesConfig.js (Game Metadata)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Data Storage (In-Memory / Future: Database)          │ │
│  │  - Game Sessions                                      │ │
│  │  - Player Scores                                      │ │
│  │  - Leaderboard Data                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request/Response Flow

### 1. Load Games Flow
```
Browser
   ↓ GET /api/games
   ↓
Express Server
   ↓ gamesController.getAllGames()
   ↓ Read from gamesConfig.js
   ↓
Return JSON
   ↓
Browser render games grid
   ↓ User clicks a game
```

### 2. Play Game Flow
```
User clicks game
   ↓ POST /api/gameplay/start
   ↓ {gameId, playerId}
   ↓
Express Server
   ↓ gameplayController.startGameSession()
   ↓ Generate sessionId (UUID)
   ↓ Create session object in memory
   ↓
Return {sessionId, gameConfig}
   ↓
Browser
   ↓ Render game UI
   ↓ Start timer
   ↓ User plays game
   ↓ POST /api/gameplay/:sessionId/answer
   ↓ {questionId, answer, timeSpent}
   ↓
Server validates answer
   ↓ Calculate points
   ↓ Update session score
   ↓
Return {isCorrect, points, totalScore}
   ↓
Browser shows feedback
   ↓ Repeat until game ends
```

### 3. End Game & Results Flow
```
Time runs out / User finishes
   ↓ POST /api/gameplay/:sessionId/end
   ↓
Express Server
   ↓ gameplayController.endGameSession()
   ↓ Calculate stats (accuracy, duration, badge)
   ↓ Save to leaderboard
   ↓
Return {finalScore, accuracy, badge}
   ↓
Browser
   ↓ Show results page with stats
   ↓ Option to play again or go home
```

---

## 🎯 Component Hierarchy

### Frontend Components
```
App
├── HomePage
│   ├── Header
│   ├── PlayerSection (input name)
│   ├── AgeSelection (filter by age)
│   ├── GamesGrid
│   │   └── GameCard (repeated)
│   └── Footer
├── GamePage
│   ├── GameHeader (title, score, timer)
│   └── GameContent
│       ├── CountingFruitsGame (specific game logic)
│       ├── ColorLearnGame
│       ├── FindMatchGame
│       └── ... (other games)
└── ResultsPage
    ├── ResultsHeader
    ├── ResultsStats
    │   ├── FinalScore
    │   ├── Accuracy
    │   └── Badge
    └── ResultsActions (buttons)
```

### Backend Components
```
ExpressApp
├── Middleware Stack
│   ├── Helmet
│   ├── CORS
│   ├── Compression
│   ├── RateLimiter
│   └── BodyParser
├── Routes
│   ├── /api/games
│   │   └── gamesController
│   ├── /api/gameplay
│   │   └── gameplayController
│   ├── /api/leaderboard
│   │   └── leaderboardController
│   └── /api/health
├── GameConfig
│   ├── GAMES_CONFIG
│   ├── GAME_QUESTIONS
│   └── CHILD_DEVELOPMENT_FEATURES
└── DataStorage (In-Memory)
    ├── gameSessions (Map)
    └── playerScores (Map)
```

---

## 🔐 Security Architecture

```
┌─────────────────────────────────────┐
│     User Request (Untrusted)        │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   1. Helmet.js (Security Headers)   │
│      - X-Frame-Options              │
│      - X-Content-Type-Options       │
│      - CSP Headers                  │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   2. CORS (Cross-Origin Filter)     │
│      - Check Origin Header          │
│      - Allow/Deny Accordingly       │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   3. Rate Limiter (DDoS Protection) │
│      - 100 requests per 15 min/IP   │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   4. Input Validation               │
│      - Check gameId exists          │
│      - Validate answer format       │
│      - Sanitize playerId            │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   5. Business Logic Validation      │
│      - Verify session exists        │
│      - Check session timeout        │
│      - Validate score calculations  │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│   6. Error Handling                 │
│      - Log errors securely          │
│      - Return safe error messages   │
│      - No stack trace in production │
└──────────────────┬──────────────────┘
                   ↓
┌─────────────────────────────────────┐
│     Trusted Response (Safe)         │
└─────────────────────────────────────┘
```

---

## 📊 Data Models

### Game Config Model
```javascript
{
  id: String,                    // Unique identifier
  name: String,                  // Display name
  description: String,           // Short description
  category: String,              // Type of game
  difficulty: String,            // easy|medium|hard
  ageRange: String,             // e.g., "2-5"
  icon: String,                 // Emoji icon
  duration: Number,             // Seconds
  questions: Number,            // Count
  colorful: Boolean,            // Has colors
  sounds: Boolean,              // Has audio
  rewards: {
    correct: Number,
    wrongAttempt: Number,
    completion: Number
  }
}
```

### Game Session Model
```javascript
{
  sessionId: String,            // UUID
  gameId: String,              // Reference to game
  playerId: String,            // Player name
  startTime: Date,             // When started
  endTime: Date,               // When ended (optional)
  duration: Number,            // Total seconds
  score: Number,               // Current score
  finalScore: Number,          // Final score (after completion)
  currentQuestion: Number,     // Progress
  questions: Array,            // Game questions
  answers: Array[{             // All answers
    questionId: Number,
    answer: Any,
    isCorrect: Boolean,
    points: Number,
    timeSpent: Number,
    timestamp: Date
  }],
  accuracy: Number,            // Percentage
  status: String              // active|completed
}
```

### Player Score Model
```javascript
{
  playerId: String,
  gameId: String,
  gameName: String,
  score: Number,
  accuracy: Number,
  date: Date
}
```

---

## 🔄 State Management

### Client-Side State
```
MiniGamesApp {
  playerName: String            // From localStorage
  selectedAge: Number           // From localStorage
  currentGameId: String         // Game being played
  currentSessionId: String      // Active session
  currentScore: Number          // Real-time score
  gameStartTime: Date           // For timer
  currentPage: String           // home|game|results
  allGames: Array              // Loaded games
}
```

### Server-Side State
```
gameSessions: Map              // sessionId -> session
playerScores: Map              // playerId -> scores[]
```

---

## 🌐 Deployment Architecture

### Local Development
```
Windows PowerShell
    ↓
npm install
    ↓
npm run dev (Nodemon watches files)
    ↓
Express on Port 3000
    ↓
Browser: localhost:3000
```

### Vercel Production
```
GitHub Repository
    ↓ (Push to main)
    ↓
Vercel Webhook
    ↓
Build Process
    ├─ Install dependencies
    ├─ Build (if needed)
    └─ Deploy
    ↓
Serverless Function (API)
    ↓
Static Files (Public folder)
    ↓
CDN Distribution
    ↓
https://mini-games-paud.vercel.app
```

---

## 📈 Scalability Considerations

### Current (In-Memory)
- ✅ Perfect for local development
- ✅ No database overhead
- ❌ Data lost on server restart
- ❌ Not suitable for multiple servers

### Future (With Database)
```
Browser → API Server → Database
                      (MongoDB/PostgreSQL/Firebase)
                      
Benefits:
- Persistent data storage
- Multiple server instances
- Better analytics
- Backup & recovery
```

### Load Balancing
```
┌─────────────────┐
│  Browser Client │
└────────┬────────┘
         ↓
┌─────────────────┐
│  Load Balancer  │ (Vercel handles this)
└────┬────┬───┬───┘
     ↓    ↓   ↓
  ┌─────────────────┐
  │ Express Server  │ (Multiple instances)
  │   Instance 1    │
  │   Instance 2    │
  │   Instance 3    │
  └────────┬────────┘
           ↓
      ┌─────────┐
      │ Database│
      └─────────┘
```

---

## 🎮 Game Loop Architecture

```
┌──────────────────────────────────┐
│   Game Initialization            │
│   - Load config                  │
│   - Create session               │
│   - Setup UI                     │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│   Render Current Question        │
│   - Show question                │
│   - Display options              │
│   - Start timer                  │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│   Wait for Player Action         │
│   - Listen for click/touch       │
│   - Track time spent            │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│   Validate Answer                │
│   - Check if correct             │
│   - Calculate points             │
│   - Update score                │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│   Show Feedback                  │
│   - Sound effect                 │
│   - Visual feedback              │
│   - Points earned                │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│   More Questions?                │
│   ├─ Yes → Render Next Question  │
│   └─ No → End Game              │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│   Calculate Final Stats          │
│   - Total score                  │
│   - Accuracy %                   │
│   - Time spent                   │
│   - Badge earned                 │
└────────────┬─────────────────────┘
             ↓
┌──────────────────────────────────┐
│   Save & Display Results         │
│   - Save to leaderboard          │
│   - Show results page            │
│   - Offer next actions           │
└──────────────────────────────────┘
```

---

## 🎯 Database Schema (Future Implementation)

### Games Table
```sql
CREATE TABLE games (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  category VARCHAR(50),
  difficulty VARCHAR(20),
  age_range VARCHAR(20),
  duration INT,
  questions_count INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Game Sessions Table
```sql
CREATE TABLE game_sessions (
  id VARCHAR(36) PRIMARY KEY,
  game_id VARCHAR(50) FOREIGN KEY,
  player_id VARCHAR(100),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  score INT,
  accuracy DECIMAL(5,2),
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Player Scores Table
```sql
CREATE TABLE player_scores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  player_id VARCHAR(100),
  game_id VARCHAR(50),
  score INT,
  accuracy DECIMAL(5,2),
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id)
);
```

---

## 📊 API Response Examples

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "counting_fruits",
    "name": "Hitung Buah 🍎",
    "category": "counting"
  }
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "message": "Game tidak ditemukan"
}
```

---

## ✅ Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Presentation** | HTML, CSS, JS | User interface |
| **API** | Express.js, Node.js | Business logic |
| **Security** | Helmet, CORS, Rate Limit | Protect application |
| **Data** | In-Memory (Map) | Session storage |
| **Deployment** | Vercel | Hosting |
| **CDN** | Vercel Edge | Content delivery |

---

**Architecture Version**: 1.0.0  
**Last Updated**: January 2024
