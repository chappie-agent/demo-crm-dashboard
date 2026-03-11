# CRM Dashboard - Running

## Server Details

### Backend (Express API)
- **Port**: 3001
- **PID**: 26901
- **Command**: `cd server && npm run dev`

### Frontend (React + Vite)
- **Port**: 5173
- **PID**: 26898
- **Command**: `cd client && npm run dev`

### Root Process
- **Command**: `npm run dev` (runs concurrently)
- **PIDs**: 26832, 26833 (npm processes)

## How to Start

From `/Users/elwyndeneve/.openclaw/workspace/demo-crm-dashboard`:
```bash
npm run dev
```

Or individually:
```bash
# Terminal 1 - Backend
cd server && npm run dev

# Terminal 2 - Frontend
cd client && npm run dev
```

## Access URLs
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Login Credentials
- **Username**: admin
- **Password**: password123

## Stop Servers
```bash
pkill -f "demo-crm-dashboard"
```
