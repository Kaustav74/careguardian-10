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
