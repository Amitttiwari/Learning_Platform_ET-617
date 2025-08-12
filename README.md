# 🎓 Learning Platform - Interactive Web-Based Learning System

A comprehensive web-based learning platform with user authentication, interactive content (text, video, quizzes), detailed clickstream analytics, and real-time progress tracking.

## 🌟 Features

### 👤 User Management
- **User Registration & Authentication** with JWT tokens
- **Role-based Access Control** (Admin, Instructor, Learner)
- **Session Management** with persistent login
- **User Profiles** with learning statistics

### 📚 Interactive Learning Content
- **Multi-format Content**: Text, Video, and Interactive Quizzes
- **Progress Tracking**: Mark as complete/unread functionality
- **Real-time Learning Analytics**: Time spent, completion rates
- **Course Management**: Multiple courses with structured content

### 📊 Advanced Analytics & Clickstream Tracking
- **Comprehensive Event Tracking**: Page views, content interactions, quiz attempts
- **Real-time Analytics Dashboard**: Learning progress, time spent, scores
- **Admin Analytics**: Complete user activity overview
- **CSV Export**: Download detailed analytics data
- **Clickstream Data**: Detailed user interaction logs

### 🎨 Modern UI/UX
- **Dark Theme**: Modern, eye-friendly interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Intuitive Navigation**: Consistent navbar across all pages
- **Interactive Elements**: Hover effects, loading states, feedback

## 🚀 Live Demo

- **Frontend**: [Netlify Deployment](https://loquacious-sawine-ecfc59.netlify.app)
- **Backend API**: [Render Deployment](https://learning-platform-backend-knkr.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls
- **React Hot Toast** - User notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Deployment
- **Netlify** - Frontend hosting
- **Render** - Backend hosting
- **GitHub** - Version control

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ashwaniiitbb/et617.git
cd et617
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the server directory:

```env
PORT=5001
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd client
npm install
```

### 4. Database Initialization

The database will be automatically initialized when you start the server. Sample data includes:

- **Admin User**: `admin` / `admin123`
- **Instructor User**: `instructor` / `instructor123`
- **Learner User**: `ashwani` / `learner123`

### 5. Start Development Servers

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 📖 Usage Guide

### For Learners

1. **Registration/Login**
   - Register with email and password
   - Login with credentials
   - Session persists across browser refreshes

2. **Course Learning**
   - Browse available courses
   - Click on course modules to view content
   - Mark content as complete
   - Take interactive quizzes
   - Track your progress

3. **Analytics Dashboard**
   - View learning statistics
   - Check time spent on courses
   - Monitor quiz scores
   - Review recent activity

### For Admins

1. **Admin Dashboard**
   - Login with admin credentials (`admin` / `admin123`)
   - View all user analytics
   - Monitor system-wide statistics
   - Export comprehensive CSV reports

2. **User Management**
   - View all registered users
   - Check user activity and progress
   - Monitor learning patterns

3. **Analytics Export**
   - Download complete analytics data
   - Export user clickstream data
   - Generate detailed reports

## 📊 Analytics & Clickstream Data

The platform tracks comprehensive user interactions:

### Event Types Tracked
- **Page Views**: Navigation and page interactions
- **Content Views**: Course and module access
- **Video Interactions**: Play, pause, time spent
- **Quiz Attempts**: Scores, completion rates
- **Progress Updates**: Content completion status
- **Button Clicks**: User interface interactions
- **Form Submissions**: Registration, login events

### Data Format
```csv
Time,Event context,Component,Event name,Description,Origin,IP address,Username,User Email,User Role,Course Title,Content Type,Action,Score,Progress %,Time Spent (seconds)
```

## 🏗️ Project Structure

```
learning-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── utils/          # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── database/           # Database files
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get specific course
- `GET /api/courses/:id/content` - Get course content

### Analytics
- `POST /api/analytics/events` - Track user events
- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/admin/all-users` - Get all users (admin)
- `GET /api/analytics/admin/export-all` - Export CSV (admin)

## 🎯 Key Features Implementation

### Clickstream Analytics
- Real-time event tracking
- Comprehensive user interaction logging
- Detailed analytics dashboard
- CSV export functionality

### Interactive Learning
- Multi-format content support
- Progress tracking system
- Quiz functionality with scoring
- Time tracking for learning sessions

### User Experience
- Responsive design
- Dark theme interface
- Intuitive navigation
- Real-time feedback

## 🚀 Deployment

### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Set build command: `cd client && npm run build`
3. Set publish directory: `client/build`
4. Deploy automatically on push to main branch

### Backend (Render)
1. Connect GitHub repository to Render
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Set environment variables
5. Deploy automatically on push to main branch

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention

## 📈 Performance Optimizations

- Lazy loading of components
- Optimized database queries
- Efficient state management
- Caching strategies
- Compressed assets

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure SQLite is properly installed
   - Check database file permissions
   - Verify database path in configuration

2. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify user credentials

3. **Analytics Not Tracking**
   - Check browser console for errors
   - Verify API endpoint connectivity
   - Ensure user is authenticated

### Development Tips

- Use browser developer tools for debugging
- Check server logs for backend issues
- Monitor network requests for API problems
- Test with different user roles

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of the ET 617 Web-Based System Development course.

## 👨‍💻 Author

**Ashwani Dubey**
- GitHub: [@ashwaniiitbb](https://github.com/ashwaniiitbb)
- Course: ET 617 - Web-Based System Development

## 🙏 Acknowledgments

- React.js community for the excellent framework
- Tailwind CSS for the utility-first styling
- Lucide for the beautiful icons
- Netlify and Render for hosting services

---

**Note**: This project is developed as an educational assignment and demonstrates modern web development practices with a focus on user experience and analytics tracking.
