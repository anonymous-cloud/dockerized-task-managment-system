#  Dockerized Task Management System API

A scalable and containerized RESTful API built with **Node.js**, **Express.js**, and **MongoDB**, providing role-based access for managing tasks with file upload support to **AWS S3**.

---

## Features

- JWT-based authentication
- Role-based access (Admin & Regular Users)
- CRUD operations on tasks
- AWS S3 file uploads with signed URL access
- Multer-based file handling
- Rate limiting (10 req/min per user)
- MongoDB indexing for optimized performance
- Dockerized setup with `docker-compose`
- Unit tests for API endpoints

---

## API Endpoints

###  Auth
| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| POST   | `/auth/register` | Register a new user  |
| POST   | `/auth/login`    | Login and get token  |

###  Tasks (Protected)
| Method | Endpoint                                  | Description                                |
|--------|-------------------------------------------|--------------------------------------------|
| POST   | `/createNewTask/:userId`                  | Create a new task                          |
| GET    | `/getAllTasks/:userId`                    | Get all tasks (admin) or user’s tasks      |
| PUT    | `/updateTask/:userId`                     | Update task if admin or owner              |
| POST   | `/deleteTask/:userId/:_id`                | Delete task if admin or owner              |
| POST   | `/uploadAttachment/:userId/:_id`          | Upload file to AWS S3 for specific task    |

---

##  Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (Authentication)
- AWS S3 (File Storage)
- Docker & Docker Compose
- Multer (File Handling)
- express-rate-limit (API protection)

---

##  Docker Setup

### 1. Clone the repository

```bash
git clone https://github.com/anonymous-cloud/dockerized-task-managment-system.git
cd dockerized-task-managment-system
