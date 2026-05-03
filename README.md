# CareGuardian MVP v1

Production-ready starter architecture for an AI-powered emergency and smart healthcare platform.

## Project Structure

- `client/` React + Vite + Tailwind frontend
- `server/` Node.js + Express + MongoDB backend

## Quick Start

### 1) Frontend

```bash
cd client
npm install
npm run dev
```

### 2) Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Server runs on `http://localhost:5000` and frontend on Vite default `http://localhost:5173`.

## MVP Features Included

### Patient
- Signup/Login screens
- Dashboard with SOS button (UI only)
- Profile page (basic medical fields)
- Static nearby hospital list

### Hospital
- Admin login screen
- Dashboard with mock incoming emergency requests

### Backend
- JWT auth (`/api/auth/signup`, `/api/auth/login`)
- Mongoose models: `User`, `Hospital`, `EmergencyRequest`
- Modular layout: config/controllers/models/routes


## Emergency Flow (MVP+)
- Patient SOS button now creates a real emergency request via backend API.
- Browser geolocation is used with a fallback mock Delhi location.
- Backend assigns nearest hospital from seeded hospitals by simple distance logic.
- Hospital dashboard polls every 4 seconds and supports Accept/Reject actions.

## Production Deployment

### Docker
```bash
docker compose up --build
```
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

### MongoDB Atlas
1. Create cluster and DB user in Atlas.
2. Add network access rule for your backend host.
3. Set `MONGO_URI` in server environment using Atlas connection string.

### Backend Hosting (Render or EC2)
- Use `server/.env.production.example` as template.
- Set runtime env vars in Render/EC2.
- Start command: `node src/index.js`.

### Frontend Hosting (Vercel)
- Use `client/.env.production.example` as template.
- Build command: `npm run build`
- Output directory: `dist`

### CI/CD
- GitHub Actions workflow: `.github/workflows/ci-cd.yml`
- Required GitHub Secrets:
  - `RENDER_DEPLOY_HOOK_URL`
  - `VERCEL_DEPLOY_HOOK_URL`



### Render (Docker) Quick Deploy

This repo includes a Render-specific Dockerfile at project root:

- `Dockerfile.render`

Render service settings:
- Environment: `Docker`
- Dockerfile Path: `Dockerfile.render`
- Port: `5000`

Required environment variables on Render:
- `PORT=5000`
- `MONGO_URI=...`
- `JWT_SECRET=...`
- `CORS_ORIGIN=...`
- `GROQ_API_KEY=...` (optional)

