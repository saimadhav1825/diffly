#!/bin/bash

# Diffly Development Script
echo "🚀 Starting Diffly Development Server..."
echo "📍 Project Directory: $(pwd)"
echo "🌐 Server will be available at: http://localhost:3000"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🔥 Starting Next.js development server with Turbopack..."
npm run dev
