# Social Issues Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses return JSON with consistent structure:
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Authentication Endpoints

### POST /auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Demo Accounts:**
- User: `user@demo.com` / `demo123`
- Admin: `admin@demo.com` / `demo123`

---

## Reports Endpoints

### GET /reports
Get all reports with optional filtering and pagination.

**Query Parameters:**
- `category` - Filter by category (general, sanitation, road, electricity, water, hospital, mosquitos, other)
- `status` - Filter by status (pending, in-progress, resolved, rejected)
- `location` - Filter by location (partial match)
- `search` - Search in title and description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "reports": [
    {
      "_id": "report_id",
      "title": "Broken Street Light",
      "description": "Street light not working",
      "category": "electricity",
      "status": "pending",
      "location": "Main Street",
      "images": ["/uploads/image1.jpg"],
      "user": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1,
  "totalReports": 50
}
```

### GET /reports/:id
Get single report with comments.

**Response:**
```json
{
  "_id": "report_id",
  "title": "Broken Street Light",
  "description": "Street light not working",
  "category": "electricity",
  "status": "pending",
  "location": "Main Street",
  "images": ["/uploads/image1.jpg"],
  "user": {
    "_id": "user_id",
    "name": "John Doe"
  },
  "comments": [
    {
      "_id": "comment_id",
      "content": "I reported this too",
      "user": {
        "_id": "user_id",
        "name": "Jane Doe"
      },
      "replies": [],
      "createdAt": "2024-01-16T10:00:00Z"
    }
  ],
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### GET /reports/my
Get current user's reports. **Requires authentication.**

### POST /reports
Create new report. **Requires authentication.**

**Request Body (multipart/form-data):**
- `title` - Report title (required)
- `description` - Report description (required)
- `category` - Report category (required)
- `location` - Location (optional)
- `images` - Image files (optional, max 5 files, 5MB each)

**Response:**
```json
{
  "_id": "new_report_id",
  "title": "New Report",
  "description": "Report description",
  "category": "road",
  "status": "pending",
  "location": "Some location",
  "images": ["/uploads/image1.jpg"],
  "user": {
    "_id": "user_id",
    "name": "John Doe"
  },
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### PATCH /reports/:id/status
Update report status. **Requires admin role.**

**Request Body:**
```json
{
  "status": "in-progress"
}
```

### DELETE /reports/:id
Delete report. **Requires admin role.**

---

## Comments Endpoints

### GET /reports/:id/comments
Get all comments for a report with replies.

**Response:**
```json
[
  {
    "_id": "comment_id",
    "content": "This is a comment",
    "user": {
      "_id": "user_id",
      "name": "John Doe"
    },
    "replies": [
      {
        "_id": "reply_id",
        "content": "This is a reply",
        "user": {
          "_id": "user_id",
          "name": "Jane Doe"
        },
        "createdAt": "2024-01-16T11:00:00Z"
      }
    ],
    "createdAt": "2024-01-16T10:00:00Z"
  }
]
```

### POST /reports/:id/comments
Add comment to report. **Requires authentication.**

**Request Body:**
```json
{
  "content": "This is my comment"
}
```

### POST /comments/:commentId/reply
Add reply to comment. **Requires authentication.**

**Request Body:**
```json
{
  "content": "This is my reply"
}
```

### PATCH /comments/:commentId
Update comment. **Requires authentication (owner only).**

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

### DELETE /comments/:commentId
Delete comment. **Requires authentication (owner or admin).**

---

## File Upload

### Supported Formats
- JPG, JPEG, PNG
- Maximum file size: 5MB per file
- Maximum files per report: 5

### File Access
Uploaded files are served at:
```
http://localhost:5000/uploads/filename.jpg
```

---

## Error Codes

- `400` - Bad Request (validation errors, invalid input)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Demo Mode

When MongoDB is not connected, the API runs in demo mode with:
- Pre-loaded sample reports and comments
- In-memory storage for new data
- All endpoints functional
- Automatic fallback to real database when available

---

## Categories

Available report categories:
- `general` - General Issues
- `sanitation` - Sanitation & Cleanliness
- `road` - Road & Infrastructure
- `electricity` - Electrical Issues
- `water` - Water Supply
- `hospital` - Hospital & Healthcare
- `mosquitos` - Mosquito & Pest Control
- `other` - Other Issues

## Status Values

Report status progression:
- `pending` - Newly reported
- `in-progress` - Being worked on
- `resolved` - Issue fixed
- `rejected` - Report rejected/invalid