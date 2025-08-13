# 🎓 Learning Platform - Interactive Web-Based Learning System

A comprehensive **web-based learning platform** featuring user authentication, interactive multi-format content, real-time analytics, and clickstream tracking — designed for modern, engaging education.

---

## 🌟 Features

### 👤 User Management
- **JWT-based Registration & Login** for secure access
- **Role-based Access Control** (Admin, Instructor, Learner)
- **Persistent Sessions** across browser refreshes
- **User Profiles** with progress statistics

### 📚 Interactive Learning Content
- **Multi-format Support**: Text, Video, Quizzes
- **Progress Tracking** with complete/unread status
- **Real-time Analytics**: time spent, completion rate
- **Course Management** with structured modules

### 📊 Analytics & Clickstream Tracking
- **Event Tracking**: page views, content interactions, quiz attempts
- **Admin Dashboard**: global stats and individual learner progress
- **CSV Export** for in-depth reporting
- **Detailed Clickstream Data** for research and improvement

### 🎨 Modern UI/UX
- **Dark Theme** for eye comfort
- **Fully Responsive** (desktop, tablet, mobile)
- **Smooth Navigation** with consistent layouts
- **Interactive Feedback** with hover effects & loaders

---

## 🛠 Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- Lucide React Icons  
- Axios (API calls)  
- React Hot Toast (notifications)

### Backend
- Node.js + Express.js  
- SQLite (lightweight DB)  
- JWT (authentication)  
- bcryptjs (password hashing)

### Deployment
- GitHub (version control)
---

## 📋 Prerequisites
- Node.js v16+
- npm or yarn
- Git

---

## 🚀 Quick Start

1. **Clone the Repository**
Backend Setup

```
cd server
npm install
Create .env in server/:
```

```
PORT=5001
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```
Frontend Setup

```
cd ../client
npm install
```
Database Initialization

Auto-initializes on server start

Sample accounts:

Admin: admin / admin123

Instructor: instructor / instructor123

Learner: Amit / learner123

Run Development Servers

```
# Backend
cd server
npm start
```
```
# Frontend
cd client
npm start
```
📖 Usage Guide
Learners
Register/Login

Browse & enroll in courses

Mark lessons complete

Attempt quizzes

Track stats in Learner Dashboard

Admins
Login with admin credentials

Access Admin Dashboard

Monitor learner analytics

Export CSV reports

Manage user activity

📊 Analytics & Clickstream Data
Tracked Events:

Page & content views

Video plays/pauses

Quiz attempts & scores

Completion updates

Button clicks & form submissions

Data Format:

```
Time,Event context,Component,Event name,Description,Origin,IP,Username,Email,Role,Course Title,Content Type,Action,Score,Progress %,Time Spent (seconds)
```
🏗 Project Structure
```
learning-platform/
├── client/         # React frontend
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── utils/
├── server/         # Node.js backend
│   ├── database/
│   ├── routes/
│   └── utils/
└── README.md
```
🔧 API Endpoints
Authentication
```

POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile
```

Courses
```
GET /api/courses

GET /api/courses/:id

GET /api/courses/:id/content
```
Analytics
```
POST /api/analytics/events

GET /api/analytics/user

GET /api/analytics/admin/all-users

GET /api/analytics/admin/export-all
```
🔒 Security
JWT authentication

bcrypt password hashing

CORS configuration

Rate limiting

SQL injection prevention

📈 Performance
Lazy-loading components

Optimized DB queries

State management efficiency

Asset compression

🐛 Troubleshooting
DB Connection Error

Check SQLite installation & file permissions

Auth Issues

Clear localStorage

Verify JWT expiration

Analytics Not Tracking

Check browser console

Ensure API connectivit
