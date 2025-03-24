# Ultimatum - Task Management System

A modern, full-stack task management application with real-time collaboration features.

## Features

- User Authentication & RBAC (Admin, Editor, Viewer roles)
- Kanban-style Task Management
- Real-time Collaboration with WebSocket
- Dark Mode Support
- Responsive Design
- Visual Reports & Analytics
- Deadline Tracking & Notifications

## Tech Stack

- Frontend: React.js, Redux, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB
- Real-time: Socket.io
- Authentication: JWT
- Styling: Material-UI + Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```
3. Set up environment variables
4. Run the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd frontend
   npm start
   ```

## Environment Variables

Create `.env` files in both frontend and backend directories with the following variables:

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```
