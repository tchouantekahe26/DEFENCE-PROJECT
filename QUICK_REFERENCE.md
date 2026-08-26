# UniNexus - Quick Reference Guide

## 🚀 Getting Started (Commands)

### Terminal 1: Start Backend
```bash
cd UNISPHERE-BACKEND
npm run dev
# Expected: "Server is running on port 3000"
```

### Terminal 2: Seed Demo Data (Optional)
```bash
cd UNISPHERE-BACKEND
node seed-demo-data.js
# Expected: "✓ Demo data seeded successfully!"
```

### Terminal 3: Start Frontend
```bash
npm run dev
# Expected: "VITE dev server running at http://localhost:5173/"
```

### Open Application
```
http://localhost:5173/
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | student@uni.edu | password |
| Teacher | teacher@uni.edu | password |
| Admin | admin@uni.edu | password |

---

## 📁 Project Structure at a Glance

```
UNINEXUS/
├── UNISPHERE-BACKEND/          # Node.js/Express API
│   ├── middleware/
│   │   └── auth.middleware.js  # JWT & role verification
│   ├── user/
│   │   ├── user.controller.js  # Login/Register/Verify
│   │   ├── user.model.js       # Database model
│   │   └── user.route.js       # API routes
│   ├── server.js               # Express server
│   ├── db.connect.js           # MySQL connection
│   └── seed-demo-data.js       # Create demo users
│
├── src/                         # React Frontend
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx       # Login page
│   │   │   └── Register.tsx    # Registration page
│   │   ├── student/
│   │   │   └── Dashboard.tsx   # Student dashboard
│   │   ├── teacher/
│   │   │   └── Dashboard.tsx   # Teacher dashboard
│   │   ├── admin/
│   │   │   └── Dashboard.tsx   # Admin dashboard
│   │   ├── Unauthorized.tsx    # 403 error
│   │   └── NotFound.tsx        # 404 error
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state & hooks
│   ├── components/
│   │   └── ProtectedRoute.tsx  # Route guard
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── App.tsx                 # Main routes
│   └── main.tsx                # Entry point
│
├── README.md                    # Full documentation
├── TESTING_GUIDE.md            # Testing instructions
└── IMPLEMENTATION_SUMMARY.md   # What was built
```

---

## 🔐 Security Architecture (Simple)

```
User visits login page
        ↓
Enters email & password
        ↓
POST /api/users/login
        ↓
Backend validates:
  1. Email exists in database?
  2. Password matches hash?
  3. Account active?
        ↓
Generate JWT token with user info
        ↓
Return token to frontend
        ↓
Frontend stores token in localStorage
        ↓
User redirected to dashboard
        ↓
All future requests include:
  Authorization: Bearer <token>
        ↓
Backend verifies token & user role
        ↓
Grant access or deny (403 Forbidden)
```

---

## 🛣️ Frontend Routes

| Route | Component | Protected | Roles |
|-------|-----------|-----------|-------|
| `/login` | Login | ❌ No | Anyone |
| `/register` | Register | ❌ No | Anyone |
| `/student/dashboard` | StudentDashboard | ✅ Yes | student |
| `/teacher/dashboard` | TeacherDashboard | ✅ Yes | teacher |
| `/admin/dashboard` | AdminDashboard | ✅ Yes | admin |
| `/unauthorized` | Unauthorized | ❌ No | Anyone |
| `/` | Redirect to login | - | - |

---

## 📡 API Endpoints

### POST /api/users/register
Register new user account
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@uni.edu",
    "password": "password123",
    "role": "student"
  }'
```

### POST /api/users/login
Login user and get JWT
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@uni.edu",
    "password": "password"
  }'
```

### GET /api/users/verify
Verify token and get user data
```bash
curl -X GET http://localhost:3000/api/users/verify \
  -H "Authorization: Bearer <your_token>"
```

### GET /api/users/get-all-users (Admin Only)
Get all users in system
```bash
curl -X GET http://localhost:3000/api/users/get-all-users \
  -H "Authorization: Bearer <admin_token>"
```

---

## 🧪 Quick Tests

### Test 1: Can register new user?
1. Go to http://localhost:5173/register
2. Fill form and submit
3. Should be logged in automatically

### Test 2: Can login?
1. Go to http://localhost:5173/login
2. Use `student@uni.edu` / `password`
3. Should see student dashboard

### Test 3: Role-based access control?
1. Login as student
2. Try to access `/teacher/dashboard`
3. Should see "403 Unauthorized" page

### Test 4: Token verification?
1. Open DevTools → Application → LocalStorage
2. Look for `uninexus_token`
3. Should be a long string starting with `eyJ...`

### Test 5: Logout works?
1. Login and view dashboard
2. Click "Logout" button
3. Should return to login page
4. Token removed from localStorage

---

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Backend won't start | MySQL not running? Create `unisphere` database |
| Can't login | Did you seed demo data? `node seed-demo-data.js` |
| Wrong role redirects | Refresh page or clear localStorage |
| Frontend won't load | Vite server crashed? Run `npm run dev` again |
| Port already in use | Kill existing process: `taskkill /PID <pid> /F` |

---

## 🔑 Key Features

✅ **JWT Authentication**
- Tokens stored in localStorage
- 7-day expiration
- Backend signature validation

✅ **Role-Based Access**
- Student: Student dashboard only
- Teacher: Teacher dashboard only
- Admin: Admin dashboard + user management

✅ **Secure Passwords**
- Hashed with bcrypt (10 salt rounds)
- Never stored in plain text
- Always compared server-side

✅ **Production Ready**
- Proper error messages
- HTTP status codes
- CORS configuration
- Environment ready (add .env)

---

## 💾 Database

```sql
-- View all users
SELECT id, name, email, role, status FROM Users;

-- View specific user
SELECT * FROM Users WHERE email = 'student@uni.edu';

-- Count by role
SELECT role, COUNT(*) FROM Users GROUP BY role;

-- Check password is hashed
SELECT email, LEFT(password, 20) FROM Users;
-- Should show: $2b$10$... (bcrypt format)
```

---

## 🎨 Styling Details

**Color Scheme:**
- Primary: `bg-purple-600` / `from-purple-600 to-indigo-600`
- Secondary: `bg-indigo-600`
- Text: `text-gray-900` (dark)
- Borders: `border-gray-300`
- Shadows: `shadow-lg`

**Spacing:**
- Padding: `p-6`, `p-8`, `p-10`
- Margins: Standard Tailwind
- Border radius: `rounded-lg`, `rounded-2xl`

**Typography:**
- Headers: `font-bold`, sizes `text-2xl` to `text-4xl`
- Body: `text-gray-600`, `text-sm` or `text-base`
- Buttons: `font-semibold`, `py-2.5`, `px-4`

---

## 📊 File Sizes (Approximate)

| File | Lines | Purpose |
|------|-------|---------|
| user.controller.js | 120 | Auth logic |
| auth.middleware.js | 35 | JWT verification |
| AuthContext.tsx | 180 | React state |
| Login.tsx | 250 | Login UI |
| Register.tsx | 330 | Registration UI |
| Dashboard files | 200 each | Role dashboards |

---

## ⚙️ Environment Variables (Optional)

Create `.env` in backend for production:
```
JWT_SECRET=your-super-secret-key-here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=unisphere
NODE_ENV=production
```

---

## 📞 Useful Commands

```bash
# Frontend
npm install              # Install deps
npm run dev             # Start dev server
npm run build           # Build for production
npm run lint            # Run linter

# Backend
npm install             # Install deps
npm run dev             # Start with nodemon
npm start               # Start node server
node seed-demo-data.js  # Create demo accounts

# Database
mysql -u root           # Connect to MySQL
CREATE DATABASE unisphere;
USE unisphere;
SHOW TABLES;
SELECT * FROM Users;
```

---

## 🎓 Learning Resources

**Files to Read:**
1. `IMPLEMENTATION_SUMMARY.md` - What was built and how
2. `TESTING_GUIDE.md` - Complete testing instructions
3. `README.md` - Full documentation with diagrams
4. `src/context/AuthContext.tsx` - React auth logic
5. `UNISPHERE-BACKEND/middleware/auth.middleware.js` - JWT logic

**Key Concepts:**
- JWT: Stateless authentication tokens
- Bcrypt: Password hashing algorithm
- Middleware: Function that processes requests
- CORS: Cross-Origin Resource Sharing
- Sequelize: ORM for database queries

---

## ✨ What Makes This Special

1. **Real Security** - Backend validates everything
2. **Role Enforcement** - Database stores roles, not tokens
3. **Professional UI** - Academic dashboard design
4. **Scalable** - Middleware pattern, stateless
5. **Well-Documented** - Multiple guide files
6. **Production-Ready** - Proper error handling
7. **Responsive** - Works on all devices
8. **Type-Safe** - Full TypeScript support

---

## 🚀 You're Ready!

Everything is set up and ready to test. Just:

1. Make sure backend is running: `npm run dev` in UNISPHERE-BACKEND
2. Make sure frontend is running: `npm run dev` in UNINEXUS
3. Seed data (optional): `node seed-demo-data.js`
4. Open: `http://localhost:5173`
5. Login with any demo account
6. Explore!

**Happy testing!** 🎉
