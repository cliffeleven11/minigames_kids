#!/bin/bash
# Quick Setup Script untuk Mini Games PAUD
# Run: bash setup.sh

echo "🎮 Mini Games PAUD - Setup Script"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. npm run dev         (Development mode with auto-reload)"
echo "2. npm start           (Production mode)"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "📚 Documentation:"
echo "   - START.md          (Quick start 3 langkah)"
echo "   - README.md         (Dokumentasi lengkap)"
echo "   - QUICKSTART.md     (Guide untuk developer)"
echo ""
