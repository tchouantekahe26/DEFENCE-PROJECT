# UniNexus - Start Here! 📚

Welcome to **UniNexus**, your complete role-based academic management system.

---

## 🎯 What Is This?

UniNexus is a **production-grade, full-stack authentication system** for an academic institution with:

✅ Real JWT-based authentication (not fake frontend-only)
✅ Separate dashboards for Students, Teachers, and Admins
✅ Secure password hashing with bcrypt
✅ Role-based access control enforced on the backend
✅ Professional, responsive UI design
✅ Complete documentation and testing guides

---

## 🚀 Quick Start (5 Minutes)

### 1. Start Backend
```bash
cd UNISPHERE-BACKEND
npm run dev
```
Expected: `Server is running on port 3000`

### 2. Start Frontend (new terminal)
```bash
npm run dev
```
Expected: `VITE dev server running at http://localhost:5173/`

### 3. Open Application
```
http://localhost:5173
```

### 4. Login with Demo Account
```
Email:    student@uni.edu
Password: password
```

You're in! 🎉

---

## 📖 Documentation Guide

Start with these files **in order**:

### For Quick Understanding
1. **START HERE:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
   - Commands to run
   - Demo credentials
   - Common issues & fixes
   - API endpoints reference
   
2. **Then Read:** [COMPLETION_REPORT.md](./COMPLETION_REPORT.md)
   - What was built
   - File structure
   - Quality checklist
   - 5-minute overview

### For Complete Understanding
3. **Full Details:** [README.md](./README.md)
   - Complete project structure
   - Security architecture explained
   - All API endpoints
   - Deployment guide

4. **How It Works:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
   - Security flow diagram
   - Backend validation details
   - Frontend state management
   - Test scenarios

### For Testing
5. **Test Everything:** [TESTING_GUIDE.md](./TESTING_GUIDE.md)
   - Complete test scenarios
   - Security verification tests
   - Troubleshooting guide
   - Browser inspection tips

---

## 🔑 Demo Login Credentials

After running `node seed-demo-data.js` in backend folder:

| Role | Email | Password | Can Access |
|------|-------|----------|-----------|
| **Student** | student@uni.edu | password | Student Dashboard |
| **Teacher** | teacher@uni.edu | password | Teacher Dashboard |
| **Admin** | admin@uni.edu | password | Admin Dashboard + Users |

---

## 📁 Project Structure

```
UNINEXUS/
├── README.md                          # Full documentation
├── COMPLETION_REPORT.md               # What was built
├── TESTING_GUIDE.md                   # How to test
├── IMPLEMENTATION_SUMMARY.md          # Architecture & security
├── QUICK_REFERENCE.md                 # Quick lookup
├── INDEX.md                           # THIS FILE
│
├── src/                               # React Frontend
│   ├── pages/
│   │   ├── auth/Login.tsx             # Login page
│   │   ├── auth/Register.tsx          # Registration
│   │   ├── student/Dashboard.tsx      # Student dashboard
│   │   ├── teacher/Dashboard.tsx      # Teacher dashboard
│   │   ├── admin/Dashboard.tsx        # Admin dashboard
│   │   ├── Unauthorized.tsx           # 403 error
│   │   └── NotFound.tsx               # 404 error
│   ├── context/AuthContext.tsx        # JWT & auth state
│   ├── components/ProtectedRoute.tsx  # Route guard
│   ├── App.tsx                        # Main routes
│   └── main.tsx                       # Entry point
│
└── UNISPHERE-BACKEND/                 # Node.js API
    ├── middleware/auth.middleware.js  # JWT verification
    ├── user/user.controller.js        # Login/Register
    ├── user/user.model.js             # Database model
    ├── user/user.route.js             # API routes
    ├── db.connect.js                  # MySQL connection
    ├── server.js                      # Express server
    └── seed-demo-data.js              # Demo data
```

---

## 🔐 How Security Works

### Simple Flow
```
User enters email & password
         ↓
Backend validates credentials
         ↓
Generates JWT token
         ↓
Token stored in browser (localStorage)
         ↓
All future requests include token
         ↓
Backend verifies token & user role
         ↓
Access granted or denied
```

### Key Security Features
- ✅ **JWT Tokens** - Stateless, 7-day expiration
- ✅ **Bcrypt Hashing** - Passwords properly secured
- ✅ **Role Verification** - Backend always checks database
- ✅ **Account Status** - Active/Inactive/Suspended checks
- ✅ **Token Validation** - Signature verified on every request

---

## 📡 API Endpoints

### Public (No Token Required)
```
POST /api/users/register    - Create account
POST /api/users/login       - Login & get JWT
```

### Protected (Token Required)
```
GET /api/users/verify              - Validate token
GET /api/users/get-all-users       - List users (admin only)
```

---

## 🧪 Quick Test

**Test 1: Can I Login?**
1. Go to http://localhost:5173/login
2. Use `student@uni.edu` / `password`
3. See student dashboard
✅ If this works, system is running!

**Test 2: Can I Register?**
1. Go to http://localhost:5173/register
2. Fill form and submit
3. Automatically logged in
✅ If this works, backend is working!

**Test 3: Does Role Protection Work?**
1. Login as student
2. Visit `/teacher/dashboard`
3. See "403 Unauthorized" page
✅ If this works, security is working!

---

## ⚙️ Useful Commands

```bash
# Backend
cd UNISPHERE-BACKEND
npm install              # Install dependencies
npm run dev             # Start dev server
node seed-demo-data.js  # Create demo accounts

# Frontend
cd ..
npm install             # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production

# Database
mysql -u root           # Connect to MySQL
mysql> CREATE DATABASE unisphere;
mysql> USE unisphere;
mysql> SHOW TABLES;
mysql> SELECT * FROM Users;
```

---

## 🆘 Having Issues?

### Backend won't start
```
Error: connect ECONNREFUSED 127.0.0.1:3306
→ MySQL not running. Start MySQL service.
```

### Can't login
```
Error: Invalid email or password
→ Run: node seed-demo-data.js (creates demo users)
```

### Can't reach backend from frontend
```
Error: Failed to fetch from http://localhost:3000/api
→ Make sure backend is running on port 3000
→ Check CORS in server.js
```

### More issues?
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) → Troubleshooting section

---

## ✨ Key Features Implemented

### ✅ Authentication
- User registration with validation
- User login with email/password
- JWT token generation & verification
- Automatic logout on token expiration
- Password hashing with bcrypt

### ✅ Authorization
- Student dashboard (students only)
- Teacher dashboard (teachers only)
- Admin dashboard (admins only)
- Admin user management
- Role-based route protection

### ✅ User Interface
- Professional login/registration pages
- Three role-specific dashboards
- Purple/indigo academic theme
- Responsive design (mobile to desktop)
- Error pages (403, 404)
- Logout functionality

### ✅ Database
- MySQL integration with Sequelize
- User model with role fields
- Email uniqueness constraint
- Account status tracking
- Demo data seeding script

### ✅ Documentation
- Complete README with architecture
- Testing guide with scenarios
- Implementation summary
- Quick reference guide
- This index file

---

## 🎓 What You Can Learn From This

1. **Real Authentication** - Not fake frontend-only
2. **JWT Best Practices** - How tokens work and validation
3. **RBAC** - Role-Based Access Control implementation
4. **React Patterns** - Context API, custom hooks, route protection
5. **Express.js** - Middleware, authentication, authorization
6. **Database Design** - MySQL schema, constraints, relationships
7. **Security** - Password hashing, token validation, CORS
8. **TypeScript** - Type-safe React components
9. **Tailwind CSS** - Responsive design styling
10. **Best Practices** - Error handling, validation, documentation

---

## 🚀 Next Steps

### Immediate (Now)
1. ✅ Run backend: `npm run dev`
2. ✅ Run frontend: `npm run dev`
3. ✅ Test login at http://localhost:5173
4. ✅ Explore the dashboards

### Short Term (Today)
1. Read [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. Run all test scenarios
3. Verify security features
4. Check database

### Medium Term (This Week)
1. Read [README.md](./README.md) for full architecture
2. Study the source code
3. Try modifying the UI
4. Deploy to staging

### Long Term (Ongoing)
1. Add more features (grades, attendance, etc.)
2. Implement real-time updates (WebSocket)
3. Add email notifications
4. Deploy to production
5. Monitor and optimize

---

## 📞 File Guide

**Start With:**
- This file (INDEX.md)
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

**Understand System:**
- [COMPLETION_REPORT.md](./COMPLETION_REPORT.md)
- [README.md](./README.md)

**Learn Security:**
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

**Test Everything:**
- [TESTING_GUIDE.md](./TESTING_GUIDE.md)

**View Code:**
- `src/context/AuthContext.tsx` - React auth logic
- `src/components/ProtectedRoute.tsx` - Route protection
- `UNISPHERE-BACKEND/middleware/auth.middleware.js` - JWT validation
- `UNISPHERE-BACKEND/user/user.controller.js` - API endpoints

---

## 🎯 You're Ready!

Everything is built, tested, and documented.

**To get started:**
1. Open terminal in UNISPHERE-BACKEND
2. Run: `npm run dev`
3. Open new terminal in UNINEXUS root
4. Run: `npm run dev`
5. Open: http://localhost:5173
6. Login: student@uni.edu / password
7. Enjoy! 🎉

**Questions?** Check the documentation files above.

---

## 📜 File Checklist

- ✅ INDEX.md (this file) - Navigation
- ✅ README.md - Full documentation
- ✅ COMPLETION_REPORT.md - What was built
- ✅ TESTING_GUIDE.md - Testing procedures
- ✅ IMPLEMENTATION_SUMMARY.md - Architecture
- ✅ QUICK_REFERENCE.md - Quick lookup
- ✅ src/context/AuthContext.tsx - Auth state
- ✅ src/components/ProtectedRoute.tsx - Route guard
- ✅ src/pages/auth/Login.tsx - Login page
- ✅ src/pages/auth/Register.tsx - Registration
- ✅ src/pages/student/Dashboard.tsx - Student view
- ✅ src/pages/teacher/Dashboard.tsx - Teacher view
- ✅ src/pages/admin/Dashboard.tsx - Admin view
- ✅ UNISPHERE-BACKEND/middleware/auth.middleware.js - JWT
- ✅ UNISPHERE-BACKEND/seed-demo-data.js - Demo creation

---

## 🌟 Features at a Glance

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ Complete | With validation |
| User Login | ✅ Complete | JWT token generation |
| Student Dashboard | ✅ Complete | Students only |
| Teacher Dashboard | ✅ Complete | Teachers only |
| Admin Dashboard | ✅ Complete | Admins only, user management |
| Token Verification | ✅ Complete | Every request |
| Role Authorization | ✅ Complete | Backend enforced |
| Password Hashing | ✅ Complete | Bcrypt with salt |
| Error Handling | ✅ Complete | All scenarios |
| Responsive Design | ✅ Complete | All devices |
| Documentation | ✅ Complete | Multiple guides |
| Demo Data | ✅ Complete | Easy seeding |

---

**Happy exploring! 🚀**

*Last Updated: August 26, 2024*
