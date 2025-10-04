# Interview Preparator AI - Server

Optional Express + TypeScript backend for enhanced features.

## Features

- **POST /api/transcribe** - Audio transcription via Whisper (stub)
- **POST /api/score** - Server-side answer evaluation (stub)
- **GET /health** - Health check endpoint

## Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck
```

## Environment Variables

Create `.env`:

```
PORT=3001
OPENAI_API_KEY=your_openai_key_here
```

## API Endpoints

### Health Check

```bash
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Transcribe Audio

```bash
POST /api/transcribe
Content-Type: multipart/form-data

Body:
- audio: Audio file (blob)

Response:
{
  "transcript": "Transcribed text...",
  "duration": 30,
  "language": "en"
}
```

**Current Status**: Returns mock transcript. To enable Whisper:

1. Install OpenAI SDK: `npm install openai`
2. Set `OPENAI_API_KEY` in `.env`
3. Uncomment implementation in `routes/transcribe.ts`

### Score Transcript

```bash
POST /api/score
Content-Type: application/json

Body:
{
  "transcript": "...",
  "role": "frontend_react",
  "skill": "React"
}

Response:
{
  "overall": 75,
  "star": {
    "S": 70,
    "T": 75,
    "A": 80,
    "R": 75
  },
  "suggestions": [...]
}
```

**Current Status**: Returns mock scores. To enable LLM scoring:

1. Install OpenAI SDK: `npm install openai`
2. Uncomment implementation in `routes/score.ts`
3. Customize prompts for your use case

## Integration with Client

In client `.env`:

```
VITE_USE_BACKEND=true
API_BASE_URL=http://localhost:3001
```

Update `useSpeech.ts` to call transcription endpoint.

## Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway up
```

### Render

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Future Enhancements

- Rate limiting middleware
- Redis caching for scores
- WebSocket for real-time feedback
- Database integration for session storage
- Batch processing for multiple sessions
- Advanced NLP with custom models
