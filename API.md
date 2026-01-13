# API Documentation - Mini Games PAUD

> Dokumentasi lengkap untuk semua API endpoints aplikasi Mini Games PAUD

## 📑 Daftar Endpoint

### 1. Health Check
### 2. Games API
### 3. Gameplay API  
### 4. Leaderboard API

---

## 1️⃣ Health Check Endpoint

### GET /api/health
Mengecek status API server.

**Request**:
```
GET http://localhost:3000/api/health
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-13T10:30:45.123Z",
  "version": "1.0.0"
}
```

**Use Case**: Ping server, monitor uptime

---

## 2️⃣ Games API

### GET /api/games
Mendapatkan semua games yang tersedia.

**Request**:
```
GET http://localhost:3000/api/games
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "counting_fruits",
      "name": "Hitung Buah 🍎",
      "description": "Hitung jumlah buah dengan benar",
      "category": "counting",
      "difficulty": "easy",
      "ageRange": "2-5",
      "icon": "🍎",
      "duration": 120,
      "questions": 10,
      "colorful": true,
      "sounds": true,
      "rewards": {
        "correct": 10,
        "wrongAttempt": 0,
        "completion": 50
      },
      "url": "/game/counting_fruits"
    },
    {
      "id": "color_learn",
      "name": "Belajar Warna 🌈",
      "description": "Pelajari dan identifikasi warna-warna",
      "category": "learning",
      "difficulty": "easy",
      "ageRange": "2-4",
      "icon": "🌈",
      ...
    }
  ],
  "total": 6
}
```

**Query Parameters**: None

**Use Case**: Load semua games di home page

---

### GET /api/games/:gameId
Mendapatkan detail game spesifik.

**Request**:
```
GET http://localhost:3000/api/games/counting_fruits
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "counting_fruits",
    "name": "Hitung Buah 🍎",
    "description": "Hitung jumlah buah dengan benar",
    "category": "counting",
    "difficulty": "easy",
    "ageRange": "2-5",
    "icon": "🍎",
    "duration": 120,
    "questions": 10,
    "colorful": true,
    "sounds": true,
    "rewards": {
      "correct": 10,
      "wrongAttempt": 0,
      "completion": 50
    },
    "questions": [
      {
        "id": 1,
        "type": "count",
        "title": "Berapa banyak apel?",
        "emoji": "🍎",
        "count": 3,
        "options": [1, 3, 5],
        "hint": "Hitung satu per satu"
      },
      ...
    ],
    "startUrl": "/game/counting_fruits",
    "playUrl": "/api/gameplay/counting_fruits"
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Game tidak ditemukan"
}
```

**Use Case**: Load game details sebelum bermain

---

### GET /api/games/category/:category
Mendapatkan games berdasarkan kategori.

**Request**:
```
GET http://localhost:3000/api/games/category/counting
```

**Available Categories**:
- `counting` - Permainan hitung-hitungan
- `learning` - Permainan belajar
- `matching` - Permainan pasangan/matching
- `puzzle` - Permainan puzzle/maze

**Response** (200 OK):
```json
{
  "success": true,
  "category": "counting",
  "data": [
    {
      "id": "counting_fruits",
      "name": "Hitung Buah 🍎",
      ...
    }
  ],
  "total": 1
}
```

**Use Case**: Filter games by category

---

### GET /api/games/age/:age
Mendapatkan games berdasarkan usia anak.

**Request**:
```
GET http://localhost:3000/api/games/age/3
```

**Age Parameter**:
- `2` - 2 tahun
- `3` - 3 tahun
- `4` - 4 tahun
- `5` - 5 tahun

**Response** (200 OK):
```json
{
  "success": true,
  "age": 3,
  "data": [
    {
      "id": "counting_fruits",
      "name": "Hitung Buah 🍎",
      "ageRange": "2-5",
      ...
    },
    {
      "id": "color_learn",
      "name": "Belajar Warna 🌈",
      "ageRange": "2-4",
      ...
    }
  ],
  "total": 2
}
```

**Use Case**: Filter games by age selection

---

### GET /api/games/categories
Mendapatkan semua kategori yang tersedia.

**Request**:
```
GET http://localhost:3000/api/games/categories
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "name": "counting",
      "count": 1
    },
    {
      "name": "learning",
      "count": 3
    },
    {
      "name": "matching",
      "count": 1
    },
    {
      "name": "puzzle",
      "count": 1
    }
  ],
  "total": 4
}
```

**Use Case**: Show category filter options

---

## 3️⃣ Gameplay API

### POST /api/gameplay/start
Memulai game session baru.

**Request**:
```
POST http://localhost:3000/api/gameplay/start
Content-Type: application/json

{
  "gameId": "counting_fruits",
  "playerId": "Budi Anak Cerdas"
}
```

**Request Body**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| gameId | String | Yes | Valid game ID from /api/games |
| playerId | String | No | Player name (default: "anonymous") |

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "gameId": "counting_fruits",
    "gameName": "Hitung Buah 🍎",
    "totalQuestions": 10,
    "totalDuration": 120,
    "message": "Game \"Hitung Buah 🍎\" telah dimulai!"
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "Game ID tidak valid"
}
```

**Use Case**: Start new game, get session ID

---

### POST /api/gameplay/:sessionId/answer
Submit jawaban untuk pertanyaan.

**Request**:
```
POST http://localhost:3000/api/gameplay/550e8400-e29b-41d4-a716-446655440000/answer
Content-Type: application/json

{
  "questionId": 1,
  "answer": 3,
  "timeSpent": 12
}
```

**Request Body**:
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| questionId | Number | Yes | Question ID |
| answer | Any | Yes | User's answer (number, string, object) |
| timeSpent | Number | No | Seconds spent on this question |

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "isCorrect": true,
    "points": 10,
    "totalScore": 10,
    "message": "✅ Jawaban benar! Bagus sekali!"
  }
}
```

**Wrong Answer Response**:
```json
{
  "success": true,
  "data": {
    "isCorrect": false,
    "points": 0,
    "totalScore": 10,
    "message": "❌ Jawaban salah. Coba lagi!"
  }
}
```

**Use Case**: Handle answer submission, update score

---

### POST /api/gameplay/:sessionId/end
Mengakhiri game session dan menghitung final score.

**Request**:
```
POST http://localhost:3000/api/gameplay/550e8400-e29b-41d4-a716-446655440000/end
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "gameName": "Hitung Buah 🍎",
    "finalScore": 75,
    "accuracy": "70%",
    "correctAnswers": 7,
    "totalQuestions": 10,
    "duration": "145 detik",
    "badge": {
      "emoji": "👍",
      "name": "Bagus!"
    },
    "completionBonus": 50,
    "message": "🎉 Selesai! Skormu: 75 poin"
  }
}
```

**Badge Types**:
- 🏆 Sempurna! (100% accuracy)
- ⭐ Hebat! (80%+ accuracy)
- 👍 Bagus! (60%+ accuracy)
- 🌟 Coba Lagi! (<60% accuracy)

**Use Case**: End game, show results

---

### GET /api/gameplay/:sessionId
Mendapatkan detail session.

**Request**:
```
GET http://localhost:3000/api/gameplay/550e8400-e29b-41d4-a716-446655440000
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "gameId": "counting_fruits",
    "playerId": "Budi",
    "startTime": "2024-01-13T10:30:45.123Z",
    "endTime": "2024-01-13T10:33:30.456Z",
    "score": 75,
    "finalScore": 75,
    "accuracy": 70,
    "currentQuestion": 10,
    "answers": [
      {
        "questionId": 1,
        "answer": 3,
        "isCorrect": true,
        "points": 10,
        "timeSpent": 12,
        "timestamp": "2024-01-13T10:30:57.123Z"
      },
      ...
    ],
    "status": "completed"
  }
}
```

**Use Case**: Debug, analytics, session replay

---

## 4️⃣ Leaderboard API

### GET /api/leaderboard
Mendapatkan leaderboard top players.

**Request**:
```
GET http://localhost:3000/api/leaderboard
GET http://localhost:3000/api/leaderboard?gameId=counting_fruits
GET http://localhost:3000/api/leaderboard?limit=20
```

**Query Parameters**:
| Param | Type | Default | Notes |
|-------|------|---------|-------|
| gameId | String | - | Filter by specific game (optional) |
| limit | Number | 10 | Number of top scores to return |

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "playerId": "Budi",
      "gameId": "counting_fruits",
      "gameName": "Hitung Buah 🍎",
      "score": 100,
      "accuracy": 100,
      "date": "2024-01-13T10:33:30.456Z"
    },
    {
      "playerId": "Ayu",
      "gameId": "counting_fruits",
      "gameName": "Hitung Buah 🍎",
      "score": 85,
      "accuracy": 80,
      "date": "2024-01-13T10:20:15.123Z"
    }
  ],
  "total": 2
}
```

**Use Case**: Display leaderboard, show top scores

---

### GET /api/leaderboard/:playerId
Mendapatkan statistik pemain.

**Request**:
```
GET http://localhost:3000/api/leaderboard/Budi
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "playerId": "Budi",
    "totalScore": 275,
    "gamesPlayed": 3,
    "avgAccuracy": "83%",
    "games": [
      {
        "gameId": "counting_fruits",
        "score": 100,
        "accuracy": 100,
        "date": "2024-01-13T10:33:30.456Z"
      },
      {
        "gameId": "color_learn",
        "score": 85,
        "accuracy": 80,
        "date": "2024-01-13T09:15:00.000Z"
      },
      {
        "gameId": "find_match_animals",
        "score": 90,
        "accuracy": 70,
        "date": "2024-01-13T08:45:30.000Z"
      }
    ]
  }
}
```

**Error Response** (404):
```json
{
  "success": false,
  "message": "Pemain tidak ditemukan"
}
```

**Use Case**: Show player profile, stats

---

### POST /api/leaderboard/score
Menambah skor ke leaderboard (internal use).

**Request**:
```
POST http://localhost:3000/api/leaderboard/score
Content-Type: application/json

{
  "playerId": "Budi",
  "gameId": "counting_fruits",
  "score": 100,
  "accuracy": 100
}
```

**Request Body**:
| Field | Type | Required |
|-------|------|----------|
| playerId | String | Yes |
| gameId | String | Yes |
| score | Number | Yes |
| accuracy | Number | Yes |

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Skor berhasil disimpan"
}
```

**Use Case**: Save final score to leaderboard

---

## 📊 Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Deskripsi error",
  "status": 400
}
```

### Common HTTP Status Codes
| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request berhasil |
| 400 | Bad Request | Parameter tidak valid |
| 404 | Not Found | Game/Session tidak ada |
| 500 | Server Error | Internal error |

---

## 🧪 Testing dengan Postman/cURL

### Example: Complete Game Flow

**1. Start Game**
```bash
curl -X POST http://localhost:3000/api/gameplay/start \
  -H "Content-Type: application/json" \
  -d '{"gameId":"counting_fruits","playerId":"TestPlayer"}'
```

**2. Submit Answers** (Repeat untuk setiap jawaban)
```bash
curl -X POST http://localhost:3000/api/gameplay/{sessionId}/answer \
  -H "Content-Type: application/json" \
  -d '{"questionId":1,"answer":3,"timeSpent":12}'
```

**3. End Game**
```bash
curl -X POST http://localhost:3000/api/gameplay/{sessionId}/end
```

**4. Check Leaderboard**
```bash
curl http://localhost:3000/api/leaderboard?gameId=counting_fruits
```

---

## 📈 Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Rate limit info in response headers
- **Exceed**: Returns 429 Too Many Requests

---

## 🔒 Security

- CORS enabled for all origins (development)
- Helmet.js for HTTP headers
- Input validation on all endpoints
- No sensitive data in responses
- Session IDs are UUIDs (cryptographically secure)

---

## 📝 API Response Format

All responses follow consistent format:

```json
{
  "success": boolean,
  "data": object|array,     // Only if success=true
  "message": string,        // Error message if success=false
  "timestamp": ISO-8601,    // Optional
  "status": HTTP_CODE       // Optional
}
```

---

## 🚀 API Versioning

Current Version: **v1** (implied, not in URL)

Future versions might use: `/api/v2/games`

---

**API Documentation Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintained by**: Mini Games PAUD Team
