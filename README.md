# Social/Civic Issue Reporting Platform

A full-stack MERN application for reporting and managing community issues.

## Features

- **Frontend**: React 18 + Vite, plain CSS (no frameworks)
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: JWT-based with role management
- **File Upload**: Image upload for issue reports
- **Demo Mode**: Works without database connection using mock data

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend  
cd ../client
npm install
```

### 2. Environment Setup

Backend `.env` file is already configured. For demo mode, no changes needed.

For production with real database:
- Update `MONGODB_URI` in `server/.env` with your MongoDB connection string
- Update `JWT_SECRET` with a secure secret

### 3. Run the Application

**Start Backend:**
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

**Start Frontend:**
```bash
cd client  
npm run dev
```
Frontend runs on: http://localhost:5173

## Demo Mode (No Database Required)

The app works fully in demo mode with mock data:

**Demo Accounts:**
- **User**: email: `user@demo.com`, password: `demo123`
- **Admin**: email: `admin@demo.com`, password: `demo123`

**Demo Features:**
- View sample reports
- Create new reports (stored in memory)
- Admin can update status and delete reports
- File uploads work normally

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/reports` - Get all reports
- `GET /api/reports/my` - Get user's reports
- `POST /api/reports` - Create new report
- `PATCH /api/reports/:id/status` - Update report status (admin)
- `DELETE /api/reports/:id` - Delete report (admin)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── styles/         # CSS files
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # MongoDB models
│   │   └── routes/         # API routes
│   └── package.json
└── README.md
```

## Production Deployment

1. Build frontend: `cd client && npm run build`
2. Set environment variables in production
3. Configure MongoDB connection
4. Deploy backend and serve frontend build

The app is production-ready with proper error handling, CORS, and SPA fallback.