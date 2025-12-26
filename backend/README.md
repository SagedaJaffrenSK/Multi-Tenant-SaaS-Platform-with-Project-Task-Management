# Multi-Tenant SaaS Platform – Project & Task Management System

## 📌 Project Description
A production-ready multi-tenant SaaS application that allows multiple organizations to register, manage users, create projects, and track tasks with strict tenant data isolation, role-based access control, and Dockerized deployment.

**Target Audience:**  
Startups, small teams, and enterprises looking for a scalable project & task management SaaS solution.

---

## 🚀 Features
- Multi-tenant architecture with complete data isolation
- Organization registration with unique subdomains
- Role-based access control (Super Admin, Tenant Admin, User)
- JWT-based authentication and authorization
- Project creation and management per tenant
- Task assignment, prioritization, and status tracking
- Subscription-based limits (users & projects)
- Audit logging for critical actions
- Dockerized backend, frontend, and database
- Automatic database migrations and seed data on startup

---

## 🛠️ Technology Stack

### Backend
- Node.js v18
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt for password hashing

### Frontend
- React (Vite)
- HTML5, CSS3, JavaScript

### Database
- PostgreSQL 15

### DevOps & Containerization
- Docker
- Docker Compose

---

## 🏗️ Architecture Overview

The system follows a containerized microservice-style architecture:

- **Frontend**: React application served on port 3000
- **Backend API**: Node.js + Express server on port 5000
- **Database**: PostgreSQL on port 5432
- **Authentication**: JWT-based with role & tenant enforcement

📷 Architecture Diagram:  
`docs/images/system-architecture.png`

---

## ⚙️ Installation & Setup

### Prerequisites
- Docker
- Docker Compose

### Local Setup (MANDATORY METHOD)
```bash
git clone <repository-url>
cd saas-platform
docker-compose up -d

This command will:
    Start PostgreSQL
    Run database migrations automatically
    Seed initial data automatically
    Start backend & frontend services

Access URLs
    Frontend: http://localhost:3000
    Backend API: http://localhost:5000
    Health Check: http://localhost:5000/api/health

🔐 Environment Variables
Backend
| Variable       | Description           |
| -------------- | --------------------- |
| DB_HOST        | Database hostname     |
| DB_PORT        | Database port         |
| DB_NAME        | Database name         |
| DB_USER        | Database user         |
| DB_PASSWORD    | Database password     |
| JWT_SECRET     | Secret key for JWT    |
| JWT_EXPIRES_IN | JWT expiry time       |
| FRONTEND_URL   | Frontend URL for CORS |

Environment variables are managed via:
    .env (local)
    docker-compose.yml (Docker)

📡 API Documentation

Detailed API documentation is available at:
📄 docs/API.md

Includes:
    All 19 APIs
    Request/Response examples
    Authentication requirements

🧪 Test Credentials (Seed Data)
   Role	              Email	                    Password
Super Admin	     superadmin@system.com	        Admin@123
Tenant Admin	    admin@demo.com	            Admin@123

Health Check
 GET /api/health

Response:
 { "status": "ok", "database": "connected" }

📦 Docker Services
    database (PostgreSQL)
    backend (Node.js API)
    frontend (React)
All services start with:
    docker-compose up -d

License:
This project is for academic and demonstration purposes.

---

# ✅ Task 6.1.2 — API Documentation

📍 **File location:** `docs/API.md`

---

## 📄 `docs/API.md` (COMPLETE)

### 👉 COPY–PASTE THIS

```md
# API Documentation – Multi-Tenant SaaS Platform

Base URL: http://localhost:5000/api

Authentication:
- JWT required for protected routes
- Header: `Authorization: Bearer <token>`

---

## 🔐 AUTH MODULE

### 1. Register Tenant
- POST `/auth/register-tenant`
- Auth: ❌
- Body:
```json
{
  "tenantName": "Demo Company",
  "subdomain": "demo",
  "adminEmail": "admin@demo.com",
  "adminPassword": "Admin@123",
  "adminFullName": "Demo Admin"
}

2. Login
POST /auth/login
Auth: ❌
{
  "email": "admin@demo.com",
  "password": "Admin@123",
  "tenantSubdomain": "demo"
}

3. Get Current User

GET /auth/me

Auth: ✅

4. Logout

POST /auth/logout

Auth: ✅

🏢 TENANT MODULE
5. Get Tenant Details

GET /tenants/:tenantId

Auth: ✅

6. Update Tenant

PUT /tenants/:tenantId

Auth: ✅ (tenant_admin / super_admin)

7. List All Tenants

GET /tenants

Auth: ✅ (super_admin)

👤 USER MODULE
8. Add User

POST /tenants/:tenantId/users

Auth: ✅

9. List Users

GET /tenants/:tenantId/users

Auth: ✅

10. Update User

PUT /users/:userId

Auth: ✅

11. Delete User

DELETE /users/:userId

Auth: ✅

📁 PROJECT MODULE
12. Create Project

POST /projects

Auth: ✅

13. List Projects

GET /projects

Auth: ✅

14. Update Project

PUT /projects/:projectId

Auth: ✅

15. Delete Project

DELETE /projects/:projectId

Auth: ✅

✅ TASK MODULE
16. Create Task

POST /projects/:projectId/tasks

Auth: ✅

17. List Tasks

GET /projects/:projectId/tasks

Auth: ✅

18. Update Task Status

PATCH /tasks/:taskId/status

Auth: ✅

19. Update Task

PUT /tasks/:taskId

Auth: ✅

❤️ Health Check

GET /health

Response:

{ "status": "ok", "database": "connected" }


---

# 🏁 STEP 6 STATUS — COMPLETE

| Requirement | Status |
|---|---|
README.md | ✅ |
API documentation | ✅ |
All 19 APIs documented | ✅ |
Seed credentials documented | ✅ |
Health check documented | ✅ |

---

## 🔜 NEXT (FINAL STEPS)

Reply with ONE word:

- **SUBMISSION** → I’ll help you prepare `submission.json`
- **REVIEW** → Full checklist before final upload
- **DEPLOY** → Production deployment guide

You are officially at the **submission stage** 🎓

## 🎥 Demo Video
YouTube Demo (Unlisted):  
https://youtube.com/your-video-link
