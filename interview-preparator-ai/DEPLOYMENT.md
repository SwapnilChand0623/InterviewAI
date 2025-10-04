# Deployment Guide

Production deployment instructions for Interview Preparator AI.

## Frontend Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Build and Deploy**:
```bash
cd client
vercel
```

3. **Configure**:
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

4. **Environment Variables** (optional):
```
VITE_USE_BACKEND=true
API_BASE_URL=https://your-backend.herokuapp.com
```

### Netlify

1. **Connect GitHub** or drag & drop `dist/` folder

2. **Build Settings**:
```
Build command: npm run build
Publish directory: dist
```

3. **Add `_redirects` file** in `client/public/`:
```
/*  /index.html  200
```

### GitHub Pages

1. **Update `vite.config.ts`**:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
});
```

2. **Build**:
```bash
npm run build
```

3. **Deploy**:
```bash
# Install gh-pages
npm install -D gh-pages

# Deploy
npx gh-pages -d dist
```

## Backend Deployment

### Railway

1. **Install CLI**:
```bash
npm i -g @railway/cli
```

2. **Deploy**:
```bash
cd server
railway login
railway init
railway up
```

3. **Set Environment Variables**:
```bash
railway variables set OPENAI_API_KEY=sk-...
railway variables set PORT=3001
```

### Render

1. **Create `render.yaml`** in root:
```yaml
services:
  - type: web
    name: interview-prep-api
    env: node
    buildCommand: cd server && npm install && npm run build
    startCommand: cd server && npm start
    envVars:
      - key: OPENAI_API_KEY
        sync: false
      - key: PORT
        value: 3001
```

2. **Connect GitHub** and deploy

### Heroku

1. **Create `Procfile`** in server/:
```
web: npm start
```

2. **Deploy**:
```bash
cd server
heroku create your-app-name
git push heroku main
heroku config:set OPENAI_API_KEY=sk-...
```

## Docker Deployment

### Frontend Dockerfile

```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    environment:
      - VITE_USE_BACKEND=true
      - API_BASE_URL=http://backend:3001

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "3001:3001"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PORT=3001
```

## SSL/HTTPS Setup

### Using Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        root /usr/share/nginx/html;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Using Cloudflare

1. Add your domain to Cloudflare
2. Enable "Always Use HTTPS"
3. Set SSL/TLS mode to "Full"
4. Update DNS to point to your server

## Performance Optimization

### Client-Side

1. **Enable compression**:
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mediapipe': ['@mediapipe/face_mesh', '@mediapipe/camera_utils'],
        },
      },
    },
  },
});
```

2. **Add caching headers** in nginx:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Server-Side

1. **Enable compression**:
```typescript
import compression from 'compression';
app.use(compression());
```

2. **Add rate limiting**:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Monitoring

### Frontend

1. **Add Sentry**:
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: 'production',
});
```

### Backend

1. **Add logging**:
```bash
npm install winston
```

2. **Health checks**:
```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});
```

## Security Checklist

- ✅ HTTPS enabled
- ✅ CORS configured properly
- ✅ API keys in environment variables
- ✅ Rate limiting enabled
- ✅ Input validation on all endpoints
- ✅ CSP headers configured
- ✅ Regular dependency updates

## CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd client && npm ci
      - run: cd client && npm run build
      - run: cd client && npm run test
      - uses: vercel/actions@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd server && npm ci
      - run: cd server && npm run build
      - run: cd server && npm run typecheck
      # Deploy to Railway/Render/Heroku
```

## Cost Estimation

### Free Tier
- **Frontend**: Vercel/Netlify free tier
- **Backend**: Railway/Render free tier
- **Cost**: $0/month

### Production
- **Frontend**: Vercel Pro (~$20/month)
- **Backend**: Railway Starter (~$5/month)
- **OpenAI API**: ~$0.006/minute of audio
- **Estimated**: $25-50/month for moderate usage

## Troubleshooting

### "Module not found" after deployment
- Ensure all dependencies are in `dependencies`, not `devDependencies`
- Check build logs for errors

### Camera not working in production
- Verify HTTPS is enabled
- Check mixed content warnings

### High API costs
- Implement caching for transcriptions
- Add usage limits per user
- Consider self-hosted Whisper

---

**Ready to deploy? Choose a platform and follow the steps above! 🚀**
