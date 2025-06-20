# Simple API Project

A lightweight REST API built with Node.js, Express, and MongoDB for managing users and posts.

## Features

- 🔐 JWT Authentication
- 👥 User Management (CRUD operations)
- 📝 Post Management (CRUD operations)
- 🛡️ Input Validation
- 🔒 Password Hashing
- 📊 MongoDB Database
- 🚀 RESTful API Design

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcryptjs
- **Environment**: dotenv

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fromancient/Simple-API-Convo
   cd simle-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/simple-api
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/profile` | Get user profile (protected) |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (protected) |
| GET | `/api/users/:id` | Get user by ID (protected) |
| PUT | `/api/users/:id` | Update user (protected) |
| DELETE | `/api/users/:id` | Delete user (protected) |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts |
| GET | `/api/posts/:id` | Get post by ID |
| POST | `/api/posts` | Create new post (protected) |
| PUT | `/api/posts/:id` | Update post (protected) |
| DELETE | `/api/posts/:id` | Delete post (protected) |

## Request Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Post (with authentication)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my first post."
  }'
```

## Project Structure

```
simle-api/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   └── posts.js
│   ├── utils/
│   │   └── validation.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/simple-api |
| `JWT_SECRET` | JWT secret key | (required) |
| `NODE_ENV` | Environment mode | development |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (when implemented)

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- Protected routes
- Environment variable configuration
