# TaskFlow — Mini SaaS Task Management System

> A secure, production-ready, full-stack multi-user task management SaaS built for the NxtWave Full Stack Developer Intern Screening Test.

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13%2B-blue)](https://postgresql.org)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Local Setup — Backend](#local-setup--backend)
7. [Local Setup — Frontend](#local-setup--frontend)
8. [Environment Variables Reference](#environment-variables-reference)
9. [API Reference](#api-reference)
10. [Security Architecture](#security-architecture)
11. [Deployment Guide](#deployment-guide)
12. [Troubleshooting](#troubleshooting)

---

## Overview

TaskFlow is a **multi-user SaaS task management** application. Every user gets a completely private workspace — their tasks are never visible to or accessible by other users. Authentication is handled via **bcrypt-hashed passwords** and **signed JSON Web Tokens (JWT)**.

---

## Features

| Feature | Details |
|---------|---------|
| 🔐 Secure Auth | bcrypt (12 rounds) password hashing + JWT tokens |
| 🛡️ Private Tasks | All queries scoped to `userId` from JWT payload |
| ✅ Full CRUD | Create, Read, Toggle (pending ↔ completed), Delete |
| 📊 Stats Dashboard | Live count of total / pending / completed tasks |
| 🔍 Filter View | Filter tasks by All / Pending / Completed |
| 🚦 Rate Limiting | 20 auth attempts per 15 min per IP |
| 🪖 Helmet | HTTP security headers on every response |
| 🌐 CORS | Configurable allowed origins via environment variable |
| 💅 Premium UI | Dark glassmorphism design with smooth animations |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Backend | Node.js + Express.js v5 |
| Database | PostgreSQL 13+ |
| ORM | Sequelize v6 |
| Auth | bcrypt v6 + jsonwebtoken v9 |
| Security | helmet + express-rate-limit |
| HTTP Client | Native Fetch API |

---

## Project Structure

```
NxtWave_assignment-29/
│
├── backend/                        # Node.js + Express API
│   ├── config/
│   │   └── database.js             # Sequelize PostgreSQL connection
│   ├── controllers/
│   │   ├── authController.js       # Signup & Login (bcrypt + JWT)
│   │   └── taskController.js       # Task CRUD (scoped to userId)
│   ├── middlewares/
│   │   └── verifyToken.js          # JWT Bearer token guard
│   ├── models/
│   │   ├── User.js                 # User schema (id, email, password)
│   │   ├── Task.js                 # Task schema (id, title, status, userId)
│   │   └── index.js                # Associations + auto DB sync
│   ├── routes/
│   │   ├── authRoutes.js           # POST /api/auth/signup & /login
│   │   └── taskRoutes.js           # Protected task CRUD routes
│   ├── .env                        # ⚠️ Secret config — DO NOT commit
│   ├── .env.example                # Safe template to share with team
│   └── server.js                   # Express entry point
│
├── frontend/                       # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Sticky glassmorphism navigation
│   │   │   └── TaskItem.jsx        # Individual task card component
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Login form with error handling
│   │   │   ├── Signup.jsx          # Registration with validation
│   │   │   └── Dashboard.jsx       # Main task management view
│   │   ├── services/
│   │   │   └── api.js              # Centralized API calls (auto JWT)
│   │   ├── App.jsx                 # Router + ProtectedRoute + Home
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Design system + Tailwind
│   ├── index.html                  # Root HTML with Inter font
│   ├── vite.config.js              # Vite + React + Tailwind plugin
│   └── package.json
│
├── .gitignore                      # Excludes .env, node_modules, dist
└── README.md                       # This file
```

---

## Prerequisites

Ensure you have all of the following installed before starting:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | (comes with Node.js) |
| PostgreSQL | v13+ | https://www.postgresql.org |
| Git | Any | https://git-scm.com |

---

## Local Setup — Backend

### Step 1: Navigate to the Backend Folder

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs: `express`, `sequelize`, `pg`, `pg-hstore`, `bcrypt`, `jsonwebtoken`, `cors`, `dotenv`, `helmet`, `express-rate-limit`.

### Step 3: Create the PostgreSQL Database

Open **pgAdmin** or a `psql` terminal and run:

```sql
CREATE DATABASE taskdb;
```

> Sequelize will **automatically create** the `users` and `tasks` tables when the server starts (`sequelize.sync({ alter: true })`). You don't need to run any SQL migrations.

### Step 4: Configure the Environment File

Copy the example file and fill in your credentials:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Then open `.env` and set your values (see [Environment Variables Reference](#environment-variables-reference) below).

#### Generate a Strong JWT Secret

Run this command to generate a cryptographically secure 128-character secret:

```bash
node -e "const crypto = require('crypto'); console.log(crypto.randomBytes(64).toString('hex'));"
```

Copy the output and paste it as the value of `JWT_SECRET` in your `.env`.

### Step 5: Start the Backend Server

```bash
npm start
```

Expected output:

```
✅ Database connected successfully.
✅ All models synced with the database.
🚀 Backend running at http://localhost:5000 [development]
```

You can verify the API is live by visiting: [http://localhost:5000](http://localhost:5000)

---

## Local Setup — Frontend

Open a **new terminal window** (keep the backend running).

### Step 1: Navigate to the Frontend Folder

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

> The frontend is already configured to connect to `http://localhost:5000` (the backend). No additional config is needed for local development.

---

## Environment Variables Reference

All environment variables live in `backend/.env`. **Never commit this file to GitHub.**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5000` | Port the Express server listens on |
| `NODE_ENV` | No | `development` | Set to `production` when deploying |
| `DB_HOST` | ✅ | `localhost` | PostgreSQL host |
| `DB_PORT` | No | `5432` | PostgreSQL port |
| `DB_NAME` | ✅ | — | Database name (e.g., `taskdb`) |
| `DB_USER` | ✅ | — | PostgreSQL username (e.g., `postgres`) |
| `DB_PASSWORD` | ✅ | — | PostgreSQL password |
| `JWT_SECRET` | ✅ | — | **Must be a strong, random 128-char hex string** |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token lifespan (e.g., `1d`, `12h`, `7d`) |
| `BCRYPT_ROUNDS` | No | `12` | bcrypt cost factor (10–14 recommended) |
| `CORS_ORIGIN` | No | `http://localhost:5173` | Comma-separated list of allowed frontend URLs |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Auth rate limit window in milliseconds (15 min) |
| `RATE_LIMIT_MAX` | No | `20` | Max auth attempts per window per IP |

### Example `.env`

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskdb
DB_USER=postgres
DB_PASSWORD=your_strong_db_password

JWT_SECRET=<paste_128_char_hex_string_here>
JWT_EXPIRES_IN=7d

BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=20
```

---

## API Reference

### Base URL (local)

```
http://localhost:5000
```

---

### Auth Endpoints

#### `POST /api/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**Success Response `201`:**
```json
{
  "message": "Account created successfully!",
  "token": "<jwt_token>",
  "user": { "id": 1, "email": "user@example.com" }
}
```

**Error Responses:**
| Code | Reason |
|------|--------|
| `400` | Missing fields or password too short (< 6 chars) |
| `409` | Email already registered |
| `429` | Too many attempts (rate limited) |
| `500` | Server error |

---

#### `POST /api/auth/login`

Log in and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

**Success Response `200`:**
```json
{
  "message": "Login successful!",
  "token": "<jwt_token>",
  "user": { "id": 1, "email": "user@example.com" }
}
```

**Error Responses:**
| Code | Reason |
|------|--------|
| `400` | Missing email or password |
| `401` | Invalid credentials |
| `429` | Too many attempts (rate limited) |

---

### Task Endpoints

> **All task routes require the Authorization header:**
> ```
> Authorization: Bearer <your_jwt_token>
> ```

---

#### `GET /api/tasks`

Fetch all tasks belonging to the logged-in user.

**Success Response `200`:**
```json
[
  {
    "id": 1,
    "title": "Finish the assignment",
    "status": "pending",
    "userId": 1,
    "createdAt": "2026-04-29T...",
    "updatedAt": "2026-04-29T..."
  }
]
```

---

#### `POST /api/tasks`

Create a new task.

**Request Body:**
```json
{ "title": "Finish the assignment" }
```

**Success Response `201`:**
```json
{
  "message": "Task created successfully!",
  "task": { "id": 2, "title": "Finish the assignment", "status": "pending", "userId": 1 }
}
```

---

#### `PUT /api/tasks/:id`

Toggle a task's status between `pending` and `completed`.

**URL Parameter:** `id` — the task's numeric ID.

**Success Response `200`:**
```json
{
  "message": "Task updated successfully!",
  "task": { "id": 2, "title": "Finish the assignment", "status": "completed", "userId": 1 }
}
```

**Error Responses:**
| Code | Reason |
|------|--------|
| `404` | Task not found or belongs to another user |

---

#### `DELETE /api/tasks/:id`

Delete a task permanently.

**URL Parameter:** `id` — the task's numeric ID.

**Success Response `200`:**
```json
{ "message": "Task deleted successfully!" }
```

**Error Responses:**
| Code | Reason |
|------|--------|
| `404` | Task not found or belongs to another user |

---

## Security Architecture

This application implements multiple layers of security:

### 1. Password Security
- Passwords are **never stored in plain text**
- Hashed using **bcrypt** with a configurable cost factor (default: 12 rounds)
- bcrypt is slow by design — brute-forcing is computationally expensive

### 2. JWT Authentication
- Tokens are **signed** with a 128-character cryptographically random secret
- Token payload contains only `{ id, email }` — minimal exposure
- Tokens expire after 7 days (configurable via `JWT_EXPIRES_IN`)
- Invalid/expired tokens return HTTP 401

### 3. Data Isolation
- Every task query uses `WHERE userId = req.user.id`
- Users **cannot** read, update, or delete other users' tasks — even if they guess a task ID
- Attempting to access another user's task returns `404` (not `403`) to avoid revealing existence

### 4. HTTP Security Headers (Helmet)
The following headers are set automatically on every response:
- `Content-Security-Policy`
- `X-XSS-Protection`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security` (in production)

### 5. Rate Limiting
- **Auth routes**: Max **20 requests per 15 minutes** per IP
- **All routes**: Global limiter with generous limit to prevent DoS
- Returns HTTP `429 Too Many Requests` when exceeded

### 6. CORS Protection
- Only whitelisted origins (defined in `CORS_ORIGIN`) can make cross-origin requests
- In production, set this to your exact frontend domain

### 7. Request Size Limit
- JSON bodies capped at **10 KB** to prevent payload-based attacks

### 8. Environment Secrets
- All secrets live in `.env` which is listed in `.gitignore`
- `.env.example` (safe template) is committed instead

---

## Deployment Guide

### Step 1: Deploy the Database

Use a free cloud PostgreSQL provider:
- **[Neon](https://neon.tech)** — recommended, instant setup, free tier
- **[Supabase](https://supabase.com)** — free tier, includes GUI

Copy the connection string (you'll use it in the backend environment variables).

### Step 2: Deploy the Backend

Use **[Render](https://render.com)** (recommended free tier):

1. Push your code to GitHub
2. Create a new **Web Service** on Render, pointing to the `backend/` folder
3. Set the **Build Command**: `npm install`
4. Set the **Start Command**: `npm start`
5. Add all environment variables from `.env` in the Render dashboard (Environment tab)
6. Set `NODE_ENV=production`
7. Set `CORS_ORIGIN` to your deployed frontend URL

### Step 3: Deploy the Frontend

Use **[Vercel](https://vercel.com)** (recommended):

1. Before deploying, update the `API_BASE` in `frontend/src/services/api.js`:
   ```js
   const API_BASE = 'https://your-render-backend-url.onrender.com/api';
   ```
2. Push to GitHub
3. Import the repo in Vercel, set **Root Directory** to `frontend`
4. Deploy — Vercel detects Vite automatically

---

## Troubleshooting

### `psql` / database connection refused
- Make sure PostgreSQL service is running: `services.msc` → PostgreSQL → Start
- Verify `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` in `.env` are correct
- Ensure the database `taskdb` exists: open pgAdmin → right-click → Create Database

### `Invalid Token` errors on the frontend
- The JWT secret may have changed — clear `localStorage` in your browser and log in again
- Check that `JWT_SECRET` in `.env` hasn't accidentally changed

### CORS errors in the browser
- Ensure `CORS_ORIGIN` in `.env` includes the exact URL your frontend runs on (e.g., `http://localhost:5173`)
- Do not include a trailing slash

### `Too many requests` (429) during testing
- Lower `RATE_LIMIT_MAX` in `.env` for testing, or increase it temporarily

### Frontend shows blank page
- Run `npm run dev` inside the `frontend/` folder (not the root)
- Check the browser console for errors
- Ensure the backend is running on port 5000
