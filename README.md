# Learning Platform with Analytics Tracking

A comprehensive learning management system with interactive content, user authentication, and detailed clickstream analytics tracking. Built with React, Node.js, and SQLite for easy deployment.

## Features

### 🎓 Learning Features
- **Interactive Courses**: Text, video, and quiz content
- **Progress Tracking**: Real-time progress monitoring
- **Quiz System**: Interactive assessments with scoring
- **Video Integration**: Embedded video content with tracking
- **User Authentication**: Secure registration and login system

### 📊 Analytics & Tracking
- **Clickstream Analytics**: Track every user interaction
- **Learning Analytics**: Monitor progress and engagement
- **Quiz Performance**: Detailed quiz attempt analytics
- **Time Tracking**: Monitor time spent on content
- **Export Capabilities**: CSV export of analytics data

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Live progress and analytics updates
- **Mobile Responsive**: Works on all devices
- **Intuitive Navigation**: Easy-to-use interface

## Tech Stack

### Frontend
- **React 18** with hooks and context
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hook Form** for form handling
- **Axios** for API calls
- **Recharts** for data visualization

### Backend
- **Node.js** with Express
- **SQLite** database (easy deployment)
- **JWT** authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers

### Analytics
- **Custom Analytics Engine**: Built-in clickstream tracking
- **Event Tracking**: Comprehensive user interaction logging
- **Performance Metrics**: Quiz scores, time tracking, progress
- **Data Export**: CSV format for external analysis

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learning-website
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
   - Backend: http://localhost:5000

### Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:3000
```

## Project Structure

```
learning-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── index.js       # App entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── database/          # Database setup
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course details
- `GET /api/courses/:id/content/:contentId` - Get content
- `POST /api/courses/:id/content/:contentId/quiz-submit` - Submit quiz

### Analytics
- `GET /api/analytics/user` - User analytics
- `GET /api/analytics/events` - Clickstream events
- `GET /api/analytics/export` - Export analytics data

## Database Schema

### Core Tables
- **users**: User accounts and profiles
- **courses**: Course information
- **course_content**: Learning content (text, video, quiz)
- **quiz_questions**: Quiz questions and answers
- **user_progress**: Learning progress tracking
- **clickstream_events**: Analytics event tracking
- **quiz_attempts**: Quiz performance data

## Analytics Tracking

The platform tracks comprehensive user interactions:

### Event Types
- **Page Views**: Every page navigation
- **Content Views**: Course and content interactions
- **Video Interactions**: Play, pause, seek actions
- **Quiz Interactions**: Attempts, completions, scores
- **Button Clicks**: UI interaction tracking
- **Form Submissions**: Registration, login, etc.

### Data Collected
- User ID and session information
- Event type and name
- Component and page context
- Timestamp and IP address
- Additional event data (JSON)

## Deployment

### Option 1: Vercel + Render (Recommended)

**Frontend (Vercel)**
1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm install && npm run build`
3. Set output directory: `client/build`
4. Add environment variables

**Backend (Render)**
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && npm start`
5. Add environment variables

### Option 2: Railway

Deploy both frontend and backend to Railway:
1. Connect your GitHub repository
2. Set up two services (frontend/backend)
3. Configure environment variables
4. Deploy automatically

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-production-secret-key
CLIENT_URL=https://your-frontend-domain.vercel.app
```

## Sample Data

The application includes sample data for testing:

### Sample User
- **Username**: instructor
- **Password**: instructor123
- **Role**: instructor

### Sample Course
- **Title**: Introduction to Web Development
- **Content**: Text, video, and quiz modules
- **Category**: Programming

## Analytics Dashboard

The analytics dashboard provides:

### User Analytics
- Learning progress overview
- Time spent tracking
- Quiz performance metrics
- Activity summaries

### Clickstream Data
- Detailed event logs
- User interaction patterns
- Export capabilities
- Filtering and search

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Built with ❤️ for educational analytics and learning tracking** # et617
