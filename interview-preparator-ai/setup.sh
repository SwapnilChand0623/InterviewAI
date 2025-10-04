#!/bin/bash

echo "🚀 Setting up Interview Preparator AI..."
echo ""

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies (optional)
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo ""
echo "Frontend only:"
echo "  cd client && npm run dev"
echo ""
echo "Full stack (2 terminals):"
echo "  Terminal 1: cd client && npm run dev"
echo "  Terminal 2: cd server && npm run dev"
echo ""
echo "Then open http://localhost:5173 in Chrome or Edge"
