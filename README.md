# ET617 - Interactive Learning Platform

A comprehensive web-based learning system with clickstream analytics tracking.

## 🚀 Live Demo
- **Frontend:** [Your Vercel URL]
- **Backend:** [Your Render URL]

## ✨ Features

### 🎓 Learning Features
- **User Registration & Authentication** - Secure JWT-based login system
- **Interactive Course Content** - Text, video, and quiz modules
- **Progress Tracking** - Mark and track learning progress
- **Quiz System** - Multiple choice questions with scoring
- **Responsive Design** - Works on desktop and mobile

### 📊 Analytics & Tracking
- **Clickstream Analytics** - Track all user interactions
- **Event Tracking** - Page views, content interactions, video actions
- **Quiz Performance** - Track quiz attempts and scores
- **Learning Progress** - Monitor user progress and time spent
- **CSV Export** - Download analytics data for analysis

### 🛠 Technical Features
- **Modern Tech Stack** - React 18, Node.js, Express, SQLite
- **Real-time Tracking** - Live analytics updates
- **Secure Authentication** - JWT tokens with bcrypt password hashing
- **Database Analytics** - Comprehensive event logging
- **API Documentation** - RESTful API endpoints

## 🏗 Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **SQLite** - Database (development)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security headers

## 📁 Project Structure

```
et617/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── database/           # Database setup
│   ├── utils/              # Utility functions
│   └── package.json
└── package.json            # Root package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashwaniiitbb/et617.git
   cd et617
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## 🌐 Deployment

### Backend (Render)
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=your-secure-secret
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

### Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com)
2. Create new project
3. Import GitHub repository
4. Configure:
   - Framework: Create React App
   - Root Directory: `client`
   - Build Command: `npm run build`
5. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com
   ```

## 📊 Analytics Features

### Tracked Events
- **Page Views** - Every page navigation
- **Content Views** - Video and text content interactions
- **Video Actions** - Play, pause, seek, volume changes
- **Quiz Interactions** - Question attempts, submissions, scores
- **Button Clicks** - All interactive elements
- **Form Submissions** - Registration, login, profile updates
- **Search Actions** - Search queries and results
- **Navigation Events** - Menu clicks, breadcrumb navigation
- **Error Events** - Failed requests, validation errors

### Analytics Dashboard
- **User Overview** - Registration, login patterns
- **Course Analytics** - Popular content, completion rates
- **Quiz Performance** - Success rates, average scores
- **Learning Insights** - Time spent, progress patterns
- **CSV Export** - Download data for external analysis

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/:id/content/:contentId` - Get content
- `POST /api/courses/:id/content/:contentId/progress` - Update progress

### Analytics
- `GET /api/analytics/user/:userId` - User analytics
- `GET /api/analytics/course/:courseId` - Course analytics
- `GET /api/analytics/export` - Export CSV data

## 📝 Database Schema

### Tables
- **users** - User accounts and profiles
- **courses** - Course information
- **course_content** - Text, video, quiz content
- **quiz_questions** - Quiz questions and answers
- **user_progress** - Learning progress tracking
- **clickstream_events** - Analytics event logging
- **quiz_attempts** - Quiz submission history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Ashwani Dubey**
- GitHub: [@ashwaniiitbb](https://github.com/ashwaniiitbb)
- Email: quant.beyondirr@gmail.com

---

**Built with ❤️ for ET617 Learning Analytics Assignment**
