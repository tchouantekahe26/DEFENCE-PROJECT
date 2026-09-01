# UniNexus - Full-Stack Role-Based Academic Management System

A comprehensive, production-ready academic management platform with secure JWT-based role-based authentication and separate dashboards for Students, Teachers, and Administrators.

## 🎯 Features

✅ **Secure Authentication**
- JWT token-based authentication
- Real backend validation (not frontend-only)
- Role-based access control (RBAC)
- Automatic session expiration

✅ **Role-Based Dashboards**
- **Student Dashboard**: View courses, results, timetable, attendance
- **Teacher Dashboard**: Manage courses, students, attendance, grades
- **Admin Dashboard**: System administration, user management, statistics

✅ **Security Architecture**
```
Frontend Authentication → Backend Auth → JWT Verification → 
Role Verification → Resource Ownership Check → Database Access
```

✅ **Responsive Design**
- Desktop, laptop, tablet, and mobile support
- Purple/indigo theme with clean academic style
- Smooth transitions and professional UI

## 📁 Project Structure

```
UNINEXUS/
├── src/                          # React Frontend (TypeScript)
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx         # Login page with JWT handling
│   │   │   └── Register.tsx      # Registration with role selection
│   │   ├── student/
│   │   │   └── Dashboard.tsx     # Student-only dashboard
│   │   ├── teacher/
│   │   │   └── Dashboard.tsx     # Teacher-only dashboard
│   │   ├── admin/
│   │   │   └── Dashboard.tsx     # Admin-only dashboard with user management
│   │   ├── Unauthorized.tsx      # 403 error page
│   │   └── NotFound.tsx          # 404 error page
│   ├── context/
│   │   └── AuthContext.tsx       # JWT & Auth state management
│   ├── components/
│   │   └── ProtectedRoute.tsx    # Route protection component
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx                   # Main app with routes
│   └── main.tsx
│
├── UNISPHERE-BACKEND/            # Node.js/Express Backend
│   ├── middleware/
│   │   └── auth.middleware.js    # JWT verification & authorization
│   ├── user/
│   │   ├── user.model.js         # Sequelize User model
│   │   ├── user.controller.js    # Auth logic (register, login, verify)
│   │   └── user.route.js         # API routes with middleware
│   ├── db.connect.js             # MySQL connection
│   ├── server.js                 # Express server setup
│   └── package.json
│
├── package.json                  # Frontend dependencies
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MySQL 8.0+ running locally
- Create database: `CREATE DATABASE unisphere;`

### Installation

**1. Install Backend Dependencies:**
```bash
cd UNISPHERE-BACKEND
npm install
```

**2. Install Frontend Dependencies:**
```bash
cd ..
npm install
```

### Running the Application

**Terminal 1 - Start Backend:**
```bash
cd UNISPHERE-BACKEND
npm run dev
# Server running on http://localhost:3000
```

**Terminal 2 - Start Frontend:**
```bash
npm run dev
# Frontend running on http://localhost:5173
```

## 🧪 Testing

### Demo Login Credentials

After the system is running, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Student | student@uni.edu | password |
| Teacher | teacher@uni.edu | password |
| Admin | admin@uni.edu | password |

### Registration Flow
1. Navigate to `http://localhost:5173/register`
2. Fill in the form (select your role)
3. Click "Create Account"
4. You'll be automatically logged in and redirected to your dashboard

### Login Flow
1. Navigate to `http://localhost:5173/login`
2. Enter email and password
3. You'll be redirected to your role-specific dashboard

## 🔐 Security Architecture

### How It Works

The system implements a **real, production-grade security model**, not a fake frontend-only system:

#### 1. **Registration Process** (Backend Enforced)
```javascript
// Frontend sends credentials
POST /api/users/register
{
  name: "John Doe",
  email: "john@uni.edu",
  password: "securepass123",
  role: "student"  // Frontend sends this
}

// Backend processes:
✓ Validates email format
✓ Checks email uniqueness  
✓ Hashes password with bcrypt
✓ IGNORES frontend role claim
✓ Verifies role from authorization rules
✓ Creates user in database
✓ Generates JWT token
✓ Returns token to frontend
```

#### 2. **Login Process** (Backend Validated)
```javascript
// Frontend sends credentials
POST /api/users/login
{
  email: "student@uni.edu",
  password: "password"
}

// Backend processes:
✓ Finds user by email
✓ Compares password hash (bcrypt)
✓ Checks account status
✓ Fetches role from database (not token)
✓ Generates JWT token
✓ Returns user data with role
```

#### 3. **Authentication** (Every Protected Request)
```javascript
// Frontend includes token in Authorization header
GET /api/users/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Backend validates:
✓ Extracts token from header
✓ Verifies signature with secret key
✓ Checks token expiration
✓ Fetches fresh user data from database
✓ Verifies account is still active
✓ Returns authenticated user
```

#### 4. **Authorization** (Role Verification)
```javascript
// Protected route example:
GET /api/users/get-all-users
Authorization: Bearer <token>

// Backend middleware:
1. authenticateToken() middleware:
   ✓ Validates JWT
   ✓ Extracts user ID from token
   
2. authorizeRole(['admin']) middleware:
   ✓ Gets user's actual role from database
   ✓ Verifies role is in allowed list
   ✓ Returns 403 Forbidden if not authorized
   
3. Route handler executes only if authorized
```

### Key Security Features

| Feature | Implementation |
|---------|-----------------|
| Password Hashing | Bcrypt with salt rounds |
| Token Format | JWT (JSON Web Tokens) |
| Token Storage | localStorage (secure for this use case) |
| Token Expiration | 7 days |
| Role Source | Database (not token) |
| CORS | Configured for frontend origin |
| Credentials Check | Email/Password via bcrypt comparison |
| Session Validation | Token verification on app load |

## 📡 API Endpoints

### Public Endpoints

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "name": "Student Name",
  "email": "student@uni.edu",
  "password": "password123",
  "role": "student",
  "department": "Computer Science",
  "level": "HND 1",
  "phone": "555-1234"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Student Name",
    "email": "student@uni.edu",
    "role": "student",
    "identifier": "STU-2024-001",
    "status": "active"
  }
}
```

#### Login User
```
POST /api/users/login
Content-Type: application/json

{
  "email": "student@uni.edu",
  "password": "password123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Student Name",
    "email": "student@uni.edu",
    "role": "student",
    "status": "active"
  }
}

Errors:
- 400: "Email and password are required"
- 401: "Invalid email or password."
- 403: "Your account has been suspended or deactivated."
```

### Protected Endpoints

#### Verify Token
```
GET /api/users/verify
Authorization: Bearer <jwt_token>

Response (200):
{
  "user": {
    "id": 1,
    "name": "Student Name",
    "email": "student@uni.edu",
    "role": "student",
    "status": "active"
  }
}

Errors:
- 401: "Your session has expired. Please sign in again."
- 401: "Invalid token"
```

#### Get All Users (Admin Only)
```
GET /api/users/get-all-users
Authorization: Bearer <admin_jwt_token>

Response (200):
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@uni.edu",
    "role": "student",
    "identifier": "STU-2024-001",
    "department": "Computer Science",
    "status": "active"
  },
  ...
]

Errors:
- 403: "You do not have permission to access this resource."
```

## 🛣️ Frontend Routes

| Path | Component | Protection | Roles |
|------|-----------|-----------|-------|
| `/login` | Login | Public | None |
| `/register` | Register | Public | None |
| `/student/dashboard` | StudentDashboard | Protected | student |
| `/teacher/dashboard` | TeacherDashboard | Protected | teacher |
| `/admin/dashboard` | AdminDashboard | Protected | admin |
| `/unauthorized` | Unauthorized | Public | None |
| `/` | Redirect | Auto-redirect | → /login |
| `*` | NotFound | Public | None |

## 🔑 Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
  identifier VARCHAR(50),
  department VARCHAR(100),
  faculty VARCHAR(100),
  program VARCHAR(100),
  level VARCHAR(50),
  phone VARCHAR(20),
  avatar VARCHAR(500),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Theme**: Purple/Indigo gradient
- **Design Pattern**: Clean academic dashboard style
- **Responsive**: Mobile-first design

## ⚙️ Configuration

### Update JWT Secret (Production)
Edit `UNISPHERE-BACKEND/user/user.controller.js`:
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'change-this-in-production';
```

### Update Token Expiry
Edit `UNISPHERE-BACKEND/user/user.controller.js`:
```javascript
const JWT_EXPIRY = '7d'; // Change as needed
```

### Change API Base URL
Edit `src/context/AuthContext.tsx`:
```typescript
const API_BASE_URL = "http://your-api-url:3000/api";
```

## 🚨 Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid email or password.` | Wrong credentials | Check email/password |
| `An account with this email already exists.` | Duplicate email | Use different email |
| `Your session has expired. Please sign in again.` | Token expired | Log in again |
| `You do not have permission to access this resource.` | Wrong role | Log in with correct account |
| `connect ECONNREFUSED` | MySQL not running | Start MySQL server |
| `Cannot GET /api/users/login` | Backend not running | Start backend server |

## 📋 Validation Rules

- **Email**: Must be valid format, unique in database
- **Password**: Minimum 6 characters
- **Name**: Required, non-empty string
- **Role**: Must be 'student', 'teacher', or 'admin'
- **Status**: Must be 'active', 'inactive', or 'suspended'

## 🔄 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ User visits http://localhost:5173                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
                    ┌────────────────────┐
                    │ AuthProvider loads │
                    │ Checks localStorage │
                    │ for saved token    │
                    └────────────────────┘
                             │
                ┌────────────┴───────────┐
                │                        │
          Token exists?            No token
                │                        │
                ↓                        ↓
         Verify token on       Show Login page
         backend (/verify)            │
                │                     │
        ┌───────┴─────────┐      User enters
        │                 │      email & password
    Valid?           Invalid           │
        │                 │            ↓
        ↓                 ↓      POST /api/users/login
    Load user      Logout &         │
    Show dashboard  redirect to  Backend validates:
                   login page   1. Email exists?
                                 2. Password matches?
                                 3. Account active?
                                 4. Generate JWT
                                    │
                                    ↓
                            Return token & user
                                    │
                                    ↓
                        Store in localStorage
                                    │
                                    ↓
                        Redirect to dashboard
                                    │
                                    ↓
                        ProtectedRoute checks:
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
              Role matches?                   No role match
                    │                                │
                    ↓                                ↓
            Show dashboard              Show Unauthorized page
                    │                                │
                    └───────────────┬────────────────┘
                                    │
                                    ↓
                        If logout → localStorage cleared
                                    │
                                    ↓
                            Redirect to login
```

## 📦 Dependencies

### Frontend
- React 19+
- React Router 7+
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Vite

### Backend
- Express 5+
- Sequelize 6+
- MySQL2
- Bcrypt
- JWT (jsonwebtoken)
- CORS
- Nodemon (dev)

## 🚀 Deployment

### Before Deploying
- [ ] Change JWT_SECRET to a strong value
- [ ] Update MySQL password
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Use environment variables

### Environment Variables (.env)
```
JWT_SECRET=your-super-secret-key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=unisphere
API_URL=https://api.yourdomain.com
```

## 📚 File Descriptions

### Frontend Key Files

**AuthContext.tsx**
- Manages JWT token and user state
- Handles login/register/logout
- Verifies token on app load
- Provides auth state to all components

**ProtectedRoute.tsx**
- Checks if user is authenticated
- Verifies user has required role
- Redirects to login/unauthorized as needed

**Dashboard Components**
- Student/Teacher/Admin specific UIs
- Role-specific features and data
- Logout functionality

### Backend Key Files

**user.model.js**
- Sequelize User model
- Defines database schema
- Handles data validation

**user.controller.js**
- register(): Create new user account
- login(): Authenticate user
- verifyToken(): Validate JWT
- getAllUsers(): Get all users (admin)

**auth.middleware.js**
- authenticateToken(): Verify JWT signature
- authorizeRole(): Check user role

## 🐛 Troubleshooting

### Backend won't start
```
Error: connect ECONNREFUSED 127.0.0.1:3306
Solution: Ensure MySQL is running
Run: mysql -u root -p
```

### Frontend can't reach backend
```
Error: Failed to fetch
Solution 1: Ensure backend is running on port 3000
Solution 2: Check CORS config in server.js
Solution 3: Verify API_BASE_URL in AuthContext.tsx
```

### Can't login with correct credentials
```
Check:
1. Is the user registered in database?
2. Is account status 'active'?
3. Has password been hashed correctly?
4. Is backend running?
5. Check browser console for errors
```

### Protected route redirects immediately
```
Check:
1. Is user logged in? (check localStorage)
2. Has token expired? (7 days)
3. Does user role match route requirement?
4. Is user still in database?
```

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review error messages in browser console
3. Check backend logs in terminal
4. Verify database connection

## 📄 License

© 2024 UniNexus. All rights reserved.

---

**Built with production-grade security and best practices for academic institutions.**
