#!/bin/bash

echo "🚀 Setting up Learning Platform with Analytics Tracking"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Create environment file
echo "🔧 Setting up environment variables..."
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "✅ Created server/.env file"
else
    echo "⚠️  server/.env already exists"
fi

# Initialize database
echo "🗄️  Initializing database..."
cd server && npm run init-db && cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development servers:"
echo "  npm run dev"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:5000"
echo ""
echo "Sample login credentials:"
echo "  Username: instructor"
echo "  Password: instructor123"
echo ""
echo "Happy learning! 📚" 