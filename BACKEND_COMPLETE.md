# Social Issues Platform - Enhanced Backend

## 🚀 Complete Backend Features

### ✅ **Authentication System**
- JWT authentication with 7-day expiry
- Role-based access (user/admin)
- Demo accounts for development
- Secure password hashing with bcrypt

### ✅ **Advanced Reports CRUD**
- **Multiple image uploads** (up to 5 images per report)
- **Enhanced categories**: General, Sanitation, Road, Electricity, Water, Hospital, Mosquitos, Other
- **Status management**: pending → in-progress → resolved/rejected
- **Location support** with search capabilities
- **Pagination** for better performance
- **Full-text search** in title and description

### ✅ **Comments & Replies System**
- **Nested comments** with replies support
- **CRUD operations** for comments and replies
- **User permissions** (owner can edit, admin can delete)
- **Threaded conversations**

### ✅ **Advanced Search & Filtering**
- Filter by category, status, location
- Full-text search with MongoDB indexes
- Pagination with configurable page size
- Optimized database queries

### ✅ **File Upload System**
- **Multiple image support** (JPG, PNG, JPEG)
- **File validation** (type and size limits)
- **Secure file storage** with unique filenames
- **Static file serving** at `/uploads`

### ✅ **Production-Ready Features**
- **Comprehensive error handling**
- **Input validation and sanitization**
- **MongoDB indexes** for performance
- **CORS configuration** for React frontend
- **Environment variable support**
- **Demo mode fallback**

## 📊 **Database Models**

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (user/admin),
  timestamps: true
}
```

### Report Model
```javascript
{
  title: String (required, max 200 chars),
  description: String (required, max 2000 chars),
  category: String (enum: 8 categories),
  location: String (optional),
  images: [String] (array of file URLs),
  status: String (enum: 4 statuses),
  user: ObjectId (ref: User),
  timestamps: true,
  indexes: text search, category, status, location, user, date
}
```

### Comment Model
```javascript
{
  content: String (required, max 1000 chars),
  report: ObjectId (ref: Report),
  user: ObjectId (ref: User),
  parentComment: ObjectId (ref: Comment, nullable),
  replies: [ObjectId] (ref: Comment),
  timestamps: true,
  indexes: report+date, parentComment
}
```

## 🛠 **API Endpoints**

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Reports
- `GET /api/reports` - Get all reports (with filters & pagination)
- `GET /api/reports/:id` - Get single report with comments
- `GET /api/reports/my` - Get user's reports
- `POST /api/reports` - Create report (with multiple images)
- `PATCH /api/reports/:id/status` - Update status (admin)
- `DELETE /api/reports/:id` - Delete report (admin)

### Comments
- `GET /api/reports/:id/comments` - Get comments with replies
- `POST /api/reports/:id/comments` - Add comment
- `POST /api/comments/:commentId/reply` - Add reply
- `PATCH /api/comments/:commentId` - Update comment
- `DELETE /api/comments/:commentId` - Delete comment

## 🔧 **Setup & Deployment**

### Development Setup
```bash
cd server
npm install
npm run dev
```

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-issues
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:5173
```

### Production Deployment
1. Set environment variables
2. Build and deploy
3. Configure MongoDB connection
4. Set up file storage (local or cloud)

## 📈 **Performance Optimizations**

### Database Indexes
- Text search index on title + description
- Compound indexes on frequently queried fields
- User-based indexes for personal reports
- Date-based indexes for sorting

### Query Optimizations
- Pagination to limit result sets
- Selective field population
- Efficient filtering with MongoDB operators
- Proper error handling to prevent crashes

## 🔒 **Security Features**

### Authentication & Authorization
- JWT token validation middleware
- Role-based access control
- Password hashing with bcrypt
- Input validation and sanitization

### File Upload Security
- File type validation
- File size limits
- Secure filename generation
- Path traversal prevention

## 🎮 **Demo Mode**

### Features
- **5 sample reports** across different categories
- **3 sample comments** with replies
- **2 demo accounts** (user + admin)
- **Full functionality** without database
- **Automatic fallback** when MongoDB unavailable

### Demo Accounts
- **User**: `user@demo.com` / `demo123`
- **Admin**: `admin@demo.com` / `demo123`

## 📚 **API Documentation**

Complete API documentation available in `API_DOCUMENTATION.md` including:
- Request/response examples
- Authentication requirements
- Error codes and messages
- File upload specifications

## 🚀 **Ready for Production**

The backend is now fully enhanced and production-ready with:
- ✅ Scalable architecture
- ✅ Comprehensive error handling
- ✅ Security best practices
- ✅ Performance optimizations
- ✅ Complete API documentation
- ✅ Demo mode for development
- ✅ Easy deployment configuration

**Total API Endpoints**: 13 endpoints covering all requirements
**Database Models**: 3 optimized models with proper relationships
**File Upload**: Multiple image support with validation
**Search & Filter**: Advanced querying with pagination
**Comments System**: Nested replies with full CRUD operations