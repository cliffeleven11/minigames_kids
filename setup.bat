@echo off
REM ============================================
REM Mini Games PAUD - Setup Script (Windows)
REM ============================================
REM Double-click this file to setup the project
REM ============================================

echo.
echo 🎮 Mini Games PAUD - Setup Script
echo ===================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

REM Show Node.js version
echo ✅ Found Node.js
node --version
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
echo This may take 1-2 minutes...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🎉 Setup Complete!
echo.
echo ===================================
echo Next Steps:
echo ===================================
echo.
echo 1. Run Development Server:
echo    npm run dev
echo.
echo 2. Or Production Server:
echo    npm start
echo.
echo 3. Then open in browser:
echo    http://localhost:3000
echo.
echo ===================================
echo Documentation:
echo ===================================
echo.
echo 📖 START.md         - Quick start guide
echo 📖 README.md        - Full documentation
echo 📖 QUICKSTART.md    - Developer guide
echo 📖 INSTALLATION.md  - Installation details
echo.
echo ===================================
echo.
pause
