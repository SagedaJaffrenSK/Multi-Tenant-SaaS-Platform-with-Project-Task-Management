# Technical Specification Document
## Multi-Tenant SaaS Platform – Project & Task Management System

---

## 1. Project Structure

The project follows a modular and scalable structure separating backend and frontend concerns. This structure supports maintainability, testing, and future expansion.

---

### 1.1 Backend Folder Structure

backend/
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ ├── utils/
│ ├── config/
│ └── app.js
├── migrations/
├── tests/
├── package.json
└── .env

#### Explanation of Backend Folders

- **src/**  
  Contains all backend source code.

- **controllers/**  
  Handles request and response logic for APIs.

- **routes/**  
  Defines API routes such as auth, users, projects, and tasks.

- **models/**  
  Handles database queries and data interaction.

- **middleware/**  
  Contains authentication, authorization (RBAC), and tenant isolation logic.

- **utils/**  
  Helper functions such as JWT helpers and password hashing.

- **config/**  
  Database configuration and environment-based settings.

- **app.js**  
  Main entry point of the backend application.

- **migrations/**  
  Database schema and migration files.

- **tests/**  
  Unit and integration tests.

---

### 1.2 Frontend Project Structure

frontend/
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── context/
│ ├── hooks/
│ ├── utils/
│ └── App.jsx
├── public/
├── package.json
└── .env

#### Explanation of Frontend Folders

- **components/**  
  Reusable UI components.

- **pages/**  
  Application pages like Login, Dashboard, Projects, Tasks.

- **services/**  
  Handles API calls to the backend.

- **context/**  
  Global state management (auth, user data).

- **hooks/**  
  Custom React hooks.

- **utils/**  
  Helper utility functions.

- **App.jsx**  
  Root React component.

---

## 2. Development Setup Guide

---

### 2.1 Prerequisites

Before running the project, ensure the following are installed:

- Node.js (version 18 or above)
- npm or yarn
- PostgreSQL
- Git

---

### 2.2 Environment Variables

#### Backend (`backend/.env`)

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/saas_db
JWT_SECRET=your_secret_key
JWT_EXPIRY=24h


#### Frontend (`frontend/.env`)

---

### 2.3 Installation Steps

1. Clone the repository:
git clone <repository-url>
cd saas-platform

2. Install backend dependencies:
cd backend
npm install

3. Install frontend dependencies:
cd ../frontend
npm install

---

### 2.4 Running the Project Locally

#### Start Backend

cd backend
npm start

Backend runs on: http://localhost:5000

#### Start Frontend

cd frontend
npm run dev

Frontend runs on: http://localhost:3000

---

### 2.5 Running Tests

#### Backend Tests

cd backend
npm test

#### Frontend Tests

cd frontend
npm test
