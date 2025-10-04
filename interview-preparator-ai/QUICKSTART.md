# Quick Start Guide

Get up and running with Interview Preparator AI in 5 minutes.

## Step 1: Install Dependencies

```bash
cd interview-preparator-ai/client
npm install
```

This will install all required packages including React, MediaPipe, Zustand, and TailwindCSS.

## Step 2: Start the Development Server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

## Step 3: Grant Permissions

When you start a session, your browser will ask for camera and microphone permissions. Click **Allow**.

> ⚠️ **Important**: Camera access requires HTTPS. The Vite dev server provides this automatically on localhost.

## Step 4: Try Your First Mock Interview

1. **Select a role**: Choose from Frontend/Backend/Data Engineer
2. **Set duration**: Pick how long you want to practice (1-5 minutes)
3. **Click "Start Mock Interview"**: You'll see a random behavioral question
4. **Grant permissions**: Allow camera and microphone access
5. **Click "Start Recording"**: Answer the question using the STAR framework
6. **Review your report**: Get instant feedback on delivery, pace, and structure

## Understanding Your Metrics

### Speaking Pace
- **Target**: 110-150 words per minute
- **Too slow**: < 110 WPM
- **Too fast**: > 150 WPM

### Filler Words
- Tracks: "um", "uh", "like", "you know", etc.
- **Goal**: < 2 fillers per minute

### Attention Score
- Based on head stability and eye contact
- **Excellent**: 80-100
- **Good**: 60-79
- **Needs work**: < 60

### STAR Framework
- **S**ituation: Set context
- **T**ask: Describe the challenge
- **A**ction: Detail what YOU did
- **R**esult: Share measurable outcomes

## Browser Compatibility

### ✅ Recommended
- **Chrome** (desktop) - Full support
- **Edge** (desktop) - Full support

### ⚠️ Limited Support
- **Safari** (desktop) - No speech recognition on older versions
- **Firefox** - No speech recognition support

### ❌ Not Supported
- Most mobile browsers (limited getUserMedia support)

## Common Issues

### "Camera not accessible"
- Ensure you're using HTTPS (localhost is fine)
- Check browser permissions
- Close other apps using the camera

### "No transcript appearing"
- Use Chrome or Edge for best results
- Check microphone permissions
- Speak clearly

### "Face tracking not working"
- Ensure good lighting
- Keep your face centered
- Avoid excessive movement

## Next Steps

- Practice with different question types
- Export your results to track progress
- Review suggestions after each session
- Try the optional backend for Whisper transcription

## Optional: Backend Setup

For enhanced features like Whisper transcription:

```bash
# In a new terminal
cd ../server
npm install
npm run dev
```

Then update `client/.env`:
```
VITE_USE_BACKEND=true
OPENAI_API_KEY=your_key_here
```

## Tips for Best Results

1. **Environment**: Quiet room with good lighting
2. **Position**: Face the camera directly, centered
3. **Distance**: Sit about 2 feet from the camera
4. **Preparation**: Think about your answer before recording
5. **Structure**: Use STAR framework for all answers
6. **Pace**: Speak at conversational speed
7. **Clarity**: Minimize filler words

## Keyboard Shortcuts

Currently none implemented. This is a great contribution opportunity!

## Getting Help

- Check the [README](./README.md) for detailed documentation
- Review [CONTRIBUTING](./CONTRIBUTING.md) to add features
- Open an issue for bugs

---

**Ready to practice? Run `npm run dev` and start improving your interview skills! 🚀**
