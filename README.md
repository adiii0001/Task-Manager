# Team Task Manager

A full-stack team task management application built with React, Node.js, Express, and MongoDB.

## Tech Stack

- **Frontend**: React + Tailwind CSS + React Router
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt

## Project Structure

```
team-task-manager/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validate.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── ProjectCard.jsx
    │   │   ├── Modal.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── LoadingSpinner.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Projects.jsx
    │   │   ├── ProjectDetail.jsx
    │   │   └── Tasks.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## Deployment on Railway

1. Push code to GitHub
2. Create a new Railway project
3. Add MongoDB service (or use MongoDB Atlas)
4. Deploy backend service — set env vars in Railway dashboard
5. Deploy frontend service — set `VITE_API_URL` to your backend Railway URL
6. Done!

## Default Roles

- **Admin**: Can create/edit/delete projects and tasks, manage team members
- **Member**: Can view assigned tasks and update their status

## API Endpoints

### Auth
- `POST /api/auth/signup` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Projects
- `GET /api/projects` — List projects
- `POST /api/projects` — Create project (Admin)
- `PUT /api/projects/:id` — Update project (Admin)
- `DELETE /api/projects/:id` — Delete project (Admin)

### Tasks
- `GET /api/tasks` — List tasks (filtered by user/project)
- `POST /api/tasks` — Create task (Admin)
- `PUT /api/tasks/:id` — Update task
- `DELETE /api/tasks/:id` — Delete task (Admin)

### Users
- `GET /api/users` — List users (Admin)
