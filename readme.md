
# Todo App with Authentication & Registration

A full-stack todo application with user authentication, registration, and role-based access control.

---

## 🚀 Features

### 🔐 Authentication System
- ✅ **User Registration**: New users can create accounts
- ✅ **User Login**: Secure JWT-based authentication  
- ✅ **Role-based Access**: Admin and User roles with different permissions
- ✅ **Demo Accounts**: Pre-configured demo accounts for testing

### 👥 User Roles
- **Admin Users**: Admin dashboard, delete any tasks, special "ADMIN" badge
- **Regular Users**: Create and manage their own tasks

### 📝 Task Management
- ✅ Add new to-do items
- ✅ Edit or update tasks
- ✅ Delete tasks (admin permissions)
- ✅ Mark tasks as complete/incomplete
- ✅ Backend API using Node.js & Express
- ✅ MongoDB for data persistence
- ✅ Responsive UI using React & Tailwind 

---

## 🛠️ Tech Stack

### Frontend:
- React
- Axios (for API calls)
- React Hooks
- Tailwind CSS or CSS Modules

### Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

---

## ⚙️ Installation

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app

2. Setup Backend

cd backend
npm install

Create a .env file in the backend/ directory:

env

PORT=5000
MONGO_URI=mongodb://localhost:27017/todo-app

Start the backend:

npm start

3. Setup Frontend
cd ../frontend
npm install
Start the frontend:

npm start
The app will run at: http://localhost:3000