# Setup Guide for Contributors

Follow these steps to run the project on your local machine after cloning from GitHub.

## Prerequisites

Before you begin, make sure you have:
- **Node.js 18 or higher** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Chrome or Edge browser** (for best compatibility)

Check your Node version:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be v9.0.0 or higher
```

## Quick Setup (5 minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/interview-preparator-ai.git
cd interview-preparator-ai
```

### Step 2: Install Dependencies

**Option A: Automatic Setup (Mac/Linux)**
```bash
chmod +x setup.sh
./setup.sh
```

**Option B: Manual Setup (All platforms)**
```bash
# Install client dependencies
cd client
npm install
cd ..

# (Optional) Install server dependencies
cd server
npm install
cd ..
```

### Step 3: Run the Application

**Frontend Only (Simplest):**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

**Full Stack (Frontend + Backend):**

Open **two terminal windows**:

```bash
# Terminal 1 - Frontend
cd client
npm run dev
```

```bash
# Terminal 2 - Backend
cd server
npm run dev
```

## First Time Usage

1. Open **http://localhost:5173** in Chrome or Edge
2. Select a role (e.g., "Front-End Engineer")
3. Click "Start Mock Interview"
4. **Allow camera and microphone** when prompted
5. Click "Start Recording" and answer the question
6. Get instant feedback!

## Common Issues

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill the process using the port
npx kill-port 5173

# Or change the port in vite.config.ts
```

### Issue: Camera/microphone not working

**Solution:**
- Use **Chrome or Edge** (best support)
- Access via **http://localhost:5173** (not 127.0.0.1)
- Check browser permissions
- Ensure HTTPS is enabled (Vite provides this automatically)

### Issue: "Cannot find module" errors

**Solution:**
Make sure you ran `npm install` in the correct directory:
```bash
cd client  # Not in root!
npm install
```

### Issue: TypeScript errors in server files

**Solution:**
This is normal before installing dependencies. Run:
```bash
cd server
npm install
```

## Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Fully supported | **Recommended** |
| Edge | ✅ Fully supported | **Recommended** |
| Safari | ⚠️ Partial | No speech recognition on older versions |
| Firefox | ❌ Limited | No speech recognition support |

## Project Structure

```
interview-preparator-ai/
├── client/          # React frontend (START HERE)
│   ├── src/
│   └── package.json
├── server/          # Optional Express backend
│   └── package.json
└── README.md
```

## Development Commands

### Client (Frontend)
```bash
cd client

npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run linter
npm run typecheck  # Check TypeScript
npm test           # Run tests (if installed)
```

### Server (Backend)
```bash
cd server

npm run dev        # Start dev server with hot reload
npm run build      # Compile TypeScript
npm start          # Run production server
npm run typecheck  # Check TypeScript
```

## Optional: Enable OpenAI Features

To use OpenAI Whisper for better transcription:

1. Create `.env` in client directory:
```bash
cd client
touch .env
```

2. Add to `.env`:
```
VITE_USE_BACKEND=true
API_BASE_URL=http://localhost:3001
```

3. Get OpenAI API key from [platform.openai.com](https://platform.openai.com)

4. Create `.env` in server directory:
```bash
cd server
touch .env
```

5. Add to `server/.env`:
```
OPENAI_API_KEY=sk-your-key-here
PORT=3001
```

## Testing Your Setup

After running `npm run dev`, you should see:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Visit http://localhost:5173 and you should see the home page.

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Check [QUICKSTART.md](./QUICKSTART.md) for usage guide
- Open an issue on GitHub with error details
- Check browser console for errors (F12)

## Contributing

Want to improve the project? Check [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

**Happy interviewing! If setup worked, give the repo a ⭐**
