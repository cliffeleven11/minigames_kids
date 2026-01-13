# 🎯 Mini Games PAUD - Complete Setup Guide

## ✅ Pre-Installation Checklist

- [ ] Windows 10/11 atau sistem lain
- [ ] Internet connection untuk download
- [ ] Administrator access (untuk install Node.js)
- [ ] Text editor (VSCode, Sublime, atau sejenisnya)

---

## 📥 Installation Steps

### Step 1: Install Node.js

#### Windows
1. Buka https://nodejs.org
2. Download **LTS version** (Long Term Support)
3. Jalankan installer (.msi)
4. Follow installation wizard, accept defaults
5. Restart computer

**Verify Installation**:
```powershell
# Open PowerShell as Administrator
node --version    # Should show v18.x.x or higher
npm --version     # Should show 8.x.x or higher
```

#### macOS/Linux
```bash
# Using Homebrew (macOS)
brew install node

# Using apt (Linux)
sudo apt update
sudo apt install nodejs npm
```

---

### Step 2: Clone/Navigate to Project

#### Windows PowerShell
```powershell
# Navigate to project folder
cd c:\www\mini_games\mini-games-app

# Or if creating new folder
mkdir c:\projects\mini-games
cd c:\projects\mini-games
# Copy project files here
```

#### macOS/Linux
```bash
cd ~/projects/mini-games-paud
# or wherever you extracted the project
```

---

### Step 3: Install Project Dependencies

```bash
# This will install all required packages from package.json
npm install

# Or use yarn if you prefer
yarn install

# Verify installation
npm list    # Shows installed packages
```

**Expected Output** (partial):
```
mini-games-paud@1.0.0
├── express@4.18.2
├── cors@2.8.5
├── dotenv@16.3.1
├── uuid@9.0.1
├── compression@1.7.4
├── helmet@7.1.0
├── express-rate-limit@7.1.5
└── nodemon@3.0.2
```

---

## ▶️ Running the Application

### Method 1: Development Mode (Recommended for development)
```powershell
npm run dev
```

**What happens**:
- Starts Express server on http://localhost:3000
- Watches file changes (auto-reload)
- Shows detailed error messages
- Good for testing & development

**Output**:
```
╔═══════════════════════════════════════════╗
║    🎮 Mini Games PAUD - Server Running    ║
╠═══════════════════════════════════════════╣
║  Server: http://localhost:3000            ║
║  Environment: development                 ║
║  Version: 1.0.0                           ║
╚═══════════════════════════════════════════╝
```

### Method 2: Production Mode
```powershell
npm start
```

**Differences from dev**:
- Faster performance
- No auto-reload on file changes
- Minimal error details
- Ready for deployment

### Method 3: Using PM2 (Process Manager)
```powershell
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name "mini-games"

# View logs
pm2 logs mini-games

# Stop
pm2 stop mini-games

# Restart
pm2 restart mini-games
```

---

## 🌐 Access the Application

1. **Open Browser**: 
   - Chrome, Firefox, Safari, Edge

2. **Navigate to**:
   - http://localhost:3000

3. **You should see**:
   - 🎮 Mini Games PAUD header
   - Input field untuk nama pemain
   - Game cards grid
   - Age selection buttons

---

## 📝 Configuration Files

### .env (Environment Variables)
```env
# Development settings
NODE_ENV=development
PORT=3000
APP_NAME=Mini Games PAUD
APP_URL=http://localhost:3000
CORS_ORIGIN=*
LOG_LEVEL=info

# Production example:
# NODE_ENV=production
# PORT=3000 (Vercel handles this)
# CORS_ORIGIN=https://mini-games-paud.vercel.app
```

### vercel.json (Deployment Config)
- Already configured for Vercel
- Handles routing API → Express
- Serves static files
- No changes needed for basic deployment

---

## 🎮 Quick Test

### Test Home Page
```
1. Open http://localhost:3000
2. Should see game list
3. Input player name
4. Click a game
5. Game should load
```

### Test API Directly
```powershell
# PowerShell
# Get all games
Invoke-WebRequest -Uri "http://localhost:3000/api/games" | Select-Object -ExpandProperty Content | ConvertFrom-Json

# Or using curl
curl http://localhost:3000/api/games
```

---

## 🚀 Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free)

### Step-by-Step Deployment

#### 1. Create GitHub Repository
```powershell
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Mini Games PAUD - Initial Release"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/mini-games-paud.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

#### 2. Connect to Vercel
```powershell
# Install Vercel CLI (optional)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Or via Vercel Dashboard:
1. Go to https://vercel.com
2. Click "New Project"
3. Import from GitHub
4. Select repository
5. Keep default settings
6. Click "Deploy"

#### 3. Verify Deployment
```
https://mini-games-paud.vercel.app
```

---

## 📂 Project Structure After Installation

```
mini-games-app/
├── src/
│   ├── index.js                      ✅ Server entry
│   ├── games/config/gamesConfig.js   ✅ Game configs
│   └── api/
│       ├── routes/                   ✅ API endpoints
│       └── controllers/              ✅ Game logic
├── public/
│   ├── index.html                    ✅ Main page
│   └── assets/
│       ├── css/                      ✅ Styling
│       ├── js/                       ✅ Frontend logic
│       └── images/                   📁 For assets
├── node_modules/                     📁 Dependencies (auto-created)
├── package.json                      ✅ Package config
├── .env.example                      ✅ Env template
├── .gitignore                        ✅ Git config
├── vercel.json                       ✅ Vercel config
├── README.md                         ✅ Full documentation
├── QUICKSTART.md                     ✅ Quick guide
└── ARCHITECTURE.md                   ✅ Tech details
```

---

## 🔧 Customization After Installation

### Add New Game
1. Edit `src/games/config/gamesConfig.js`
2. Add game configuration
3. Create game class in `public/assets/js/app.js`
4. Register in `loadGameUI()` function
5. Restart server (auto-reload in dev mode)

### Change Theme Colors
Edit `public/assets/css/style.css`:
```css
:root {
    --primary: #FF6B6B;      /* Ubah warna sini */
    --secondary: #4ECDC4;
    /* ... more colors ... */
}
```

### Modify Scoring
Edit `src/games/config/gamesConfig.js`:
```javascript
rewards: {
  correct: 10,      // Points per correct answer
  completion: 50    // Bonus for completing game
}
```

---

## 🆘 Troubleshooting

### Problem: "npm is not recognized"
**Solution**:
1. Make sure Node.js is installed
2. Restart PowerShell/Terminal
3. Try: `C:\Program Files\nodejs\npm --version`

### Problem: "Port 3000 already in use"
**Solution**:
```powershell
# Find process using port 3000
$pid = (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill process
Stop-Process -Id $pid -Force

# Or change port in .env
PORT=3001
```

### Problem: "Cannot find module 'express'"
**Solution**:
```powershell
# Reinstall dependencies
rm -r node_modules
npm install
```

### Problem: "Games not loading"
**Solution**:
1. Check browser console (F12 > Console)
2. Check server logs
3. Clear browser cache (Ctrl+Shift+Del)
4. Try private/incognito window

### Problem: "CORS error"
**Solution**:
Make sure `CORS_ORIGIN=*` in `.env` (for development)

---

## 📊 Performance Optimization

### Before Production Deployment

1. **Minify CSS/JS**:
   ```bash
   npm install -g terser cssnano-cli
   ```

2. **Compress Images**:
   - Use online tools or ImageMagick
   - Target < 100KB per image

3. **Enable GZIP** (Already enabled via compression middleware)

4. **Use CDN** (Vercel provides this automatically)

5. **Monitor Performance**:
   - Use Chrome DevTools (F12)
   - Check Network tab
   - Check Performance tab

---

## 📱 Testing on Different Devices

### Mobile Testing (Same Network)
```powershell
# Find your machine IP
ipconfig

# Look for "IPv4 Address" e.g., 192.168.x.x
# On phone, open: http://192.168.x.x:3000
```

### Remote Testing
```powershell
# Deploy to Vercel
vercel

# Share Vercel URL with others
https://mini-games-paud.vercel.app
```

---

## 📊 Monitoring & Logs

### View Application Logs
```powershell
# In dev mode, logs appear in console
npm run dev

# See request details like:
# GET /api/games
# POST /api/gameplay/start
# etc.
```

### Enable Debug Mode
```powershell
# Set environment
$env:DEBUG='*'
npm start

# Shows detailed internals
```

---

## 🔐 Security Before Production

- [ ] Change `CORS_ORIGIN` to specific domain
- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Add rate limiting (already enabled)
- [ ] Remove console.log statements
- [ ] Test with OWASP checklist
- [ ] Update dependencies: `npm update`

---

## 📞 Getting Help

### Check Logs
```powershell
# Server logs in terminal
npm run dev

# Browser logs
F12 > Console tab

# Network requests
F12 > Network tab
```

### Common Issues
- Port conflict → Change PORT in .env
- Module not found → Run `npm install`
- CORS error → Check `CORS_ORIGIN` in .env
- Games not visible → Check `/api/games` endpoint

### Resources
- Express docs: https://expressjs.com
- Node.js docs: https://nodejs.org/docs
- Vercel docs: https://vercel.com/docs

---

## ✅ Verification Checklist

After installation, verify:

- [ ] `npm install` completed without errors
- [ ] `npm run dev` starts server on port 3000
- [ ] Browser opens http://localhost:3000 successfully
- [ ] Games list displays with cards
- [ ] Can input player name
- [ ] Can click and start a game
- [ ] Game UI renders correctly
- [ ] Timer counts down
- [ ] Score updates on correct answers
- [ ] Results page shows after game
- [ ] F12 Console has no error messages
- [ ] No network errors in F12 Network tab

---

## 🎉 You're Ready!

Aplikasi sudah siap untuk:
- ✅ Local development
- ✅ Team collaboration
- ✅ Deployment ke Vercel
- ✅ Adding more games
- ✅ Customization

---

## 📚 Next Steps

1. **Explore the code**: Read `ARCHITECTURE.md`
2. **Customize**: Add your own games
3. **Deploy**: Push to Vercel
4. **Share**: Give URL to users
5. **Monitor**: Check performance & user feedback

---

**Installation Complete! Happy Coding! 🚀**

For questions: Check README.md or QUICKSTART.md

---

Version: 1.0.0  
Last Updated: January 2024
