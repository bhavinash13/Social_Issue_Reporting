# CivicReport - Frontend

A modern React-based frontend for the Community Issue Reporting Platform.

## Features

- **Home Page**: Display all community issues with filtering by category
- **Authentication**: Login and signup with form validation
- **Report Issues**: Submit new issues with image upload and location
- **My Reports**: View and track your submitted reports
- **Admin Dashboard**: Manage all reports (admin only)
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server
- **Plain CSS** - Custom styling without frameworks

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file (optional):
```bash
# Create .env file in client root
VITE_API_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── ReportCard.jsx  # Report display card
│   ├── LoadingSpinner.jsx
│   └── ProtectedRoute.jsx
├── pages/              # Page components
│   ├── Home.jsx        # Landing page with all reports
│   ├── Login.jsx       # User authentication
│   ├── Signup.jsx      # User registration
│   ├── ReportForm.jsx  # Submit new reports
│   ├── MyReports.jsx   # User's reports
│   └── AdminDashboard.jsx
├── services/           # API service layer
│   ├── api.js          # Axios configuration
│   ├── authService.js  # Authentication APIs
│   └── reportService.js # Report management APIs
├── styles/
│   └── global.css      # Global styles and utilities
├── App.jsx             # Main app component
└── main.jsx           # App entry point
```

## API Integration

The frontend is configured to connect to the backend API at `http://localhost:5000/api/` by default.

### Available Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/reports` - Get all reports
- `GET /api/reports/my` - Get user's reports
- `POST /api/reports` - Create new report
- `PATCH /api/reports/:id/status` - Update report status (admin)
- `DELETE /api/reports/:id` - Delete report (admin)

## Features Overview

### Authentication
- Form validation for login/signup
- JWT token management
- Protected routes for authenticated users
- Admin-only routes

### Report Management
- Create reports with title, description, category, location
- Optional image upload (max 5MB)
- Status tracking (pending, in-progress, resolved, rejected)
- Category filtering

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000)

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include form validation
4. Test on multiple screen sizes
5. Update documentation as needed