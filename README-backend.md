# Todo List Backend API

A robust REST API for todo list management built with Node.js, Express.js, and MongoDB.

## 🛠️ Technologies Used

### **Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- cors

## 🚀 Getting Started

### **Prerequisites:**
- Node.js (v18 or higher)
- MongoDB database
- npm or yarn

### **Installation:**

1. **Clone the repository:**
```bash
git clone https://github.com/Dhairya-911/todo-List-website.git -b backend-only
cd todo-List-website
```

2. **Install dependencies:**
```bash
npm run install-backend
```

3. **Environment Setup:**
Create a `.env` file in the `backend` directory:
```properties
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. **Start the server:**
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### **Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Tasks:**
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

### **Admin (Admin users only):**
- `GET /api/admin/users-with-tasks` - Get all users with their tasks
- `GET /api/admin/stats` - Get system statistics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

## 🏗️ Project Structure

```
backend/
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── models/
│   ├── Task.js          # Task model
│   └── User.js          # User model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── Tasks.js         # Task management routes
│   └── admin.js         # Admin routes
├── utils/
│   └── generateToken.js # JWT token utility
├── .env                 # Environment variables
├── package.json         # Dependencies
└── server.js           # Main server file
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control (Admin/User)
- CORS configuration
- Input validation and sanitization

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Dhairya-911**
- GitHub: [@Dhairya-911](https://github.com/Dhairya-911)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
