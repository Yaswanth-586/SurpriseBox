# SurpriseBox 🎁

SurpriseBox is a time-locked digital gifting application. It allows creators to build custom surprise boxes containing messages, photos, videos, audio, and more. The recipient receives a unique link, but the content remains strictly locked until the exact unlock time.

## Features
- **Time-locked Surprises**: Content is strictly protected on the backend until the designated time.
- **Rich Media**: Supports text, letters, photo uploads, video uploads, audio, secret links, and coupons.
- **Theming**: Various visual themes (Romantic, Birthday, Magic, Dark Luxury, etc.) and custom gift box styles.
- **Occasion System**: Pre-configured occasions (Birthdays, Anniversaries, Festivals) with default greetings.
- **Creator Dashboard**: Manage, edit, and delete created surprises. 
- **Authentication**: Email/Password and Google OAuth.
- **Global Timezones**: Supports creating and receiving surprises across different timezones securely.

---

## Architecture (Production)
- **Frontend**: React + Vite (Deployed on Vercel)
- **Backend**: FastAPI (Deployed on Render)
- **Database**: PostgreSQL (Supabase)
- **Storage**: Supabase Storage (Private Media Bucket)

The time-lock is enforced by the backend. The frontend only displays a countdown, but the API will not return protected data or media until `server_time >= unlock_at`.

---

## Local Development Setup

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt
cp .env.example .env  # Update if needed
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Update VITE_API_URL and VITE_GOOGLE_CLIENT_ID
npm run dev
```

The frontend will run at `http://localhost:5173` and proxy API requests to `http://localhost:8000`.

---

## Production Deployment Guide

### 1. Supabase (Database & Storage)
1. Create a project on [Supabase](https://supabase.com).
2. Get the PostgreSQL Connection String (`DATABASE_URL`).
3. Under **Storage**, create a new bucket named `surprises` (Make it **Private** to ensure time-lock security works!).
4. Get your `SUPABASE_URL` and `SUPABASE_KEY` (Use the **service_role** key to allow the backend to sign URLs and upload).

### 2. Render (Backend)
1. Connect your GitHub repository to [Render](https://render.com).
2. Create a new **Web Service**.
3. Use the following configuration (or use the provided `render.yaml`):
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add the following Environment Variables:
   - `DATABASE_URL` (Supabase Postgres)
   - `SECRET_KEY` (Generate a strong random string)
   - `FRONTEND_URL` (Your Vercel URL, e.g., `https://my-surprisebox.vercel.app`)
   - `SUPABASE_URL`
   - `SUPABASE_KEY` (service_role secret)
   - `SUPABASE_STORAGE_BUCKET` (e.g., `surprises`)

### 3. Vercel (Frontend)
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set the **Framework Preset** to `Vite`.
3. Set the **Root Directory** to `frontend`.
4. Add the following Environment Variables:
   - `VITE_API_URL` (Your Render backend URL, e.g., `https://surprisebox-api.onrender.com`)
   - `VITE_GOOGLE_CLIENT_ID` (If using Google Auth)
5. Deploy! Vercel will use the included `vercel.json` for React SPA routing.

---

## Time-Lock Security Model
The frontend countdown is purely visual. When the browser requests `/api/surprises/{token}`, the backend checks the server's UTC clock against the database `unlock_at`.
- If locked: Returns `is_locked=True` and strips all protected fields (messages, items).
- If unlocked: Returns `is_locked=False` and includes the content.
- Media requests to `/api/media/{media_id}?token=...` perform the exact same lock check. If unlocked, the backend redirects to a short-lived (60s) Supabase signed URL. The actual Supabase URL is never exposed prior to the unlock time.

## Testing
Run the backend QA script to simulate the full E2E time-lock cycle:
```bash
python scratch/test_qa.py
```
