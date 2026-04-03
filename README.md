# HelpDesk Flow

A full-stack Technical Support Management System built with React, Node.js, Express, and MongoDB Atlas.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| UI | Lucide React, React Toastify |
| Routing | React Router DOM v7 |
| HTTP | Axios |
| Backend | Node.js, Express.js 5 |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Upload | Multer |

## User Roles

| Role | Capabilities |
|---|---|
| **Client** | Register, create tickets, view own tickets, chat with agent |
| **Agent** | View all tickets, claim tickets, change status, reply |
| **Admin** | Full access: stats, delete users/tickets, manage system |

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

## Installation

### 1. Clone and install

```bash
git clone <repo-url>
cd helpdesk

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/helpdesk
JWT_SECRET=<random 32+ char string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed default users

```bash
cd backend
npm run seed
```

This creates:
- **Admin**: `admin@helpdesk.com` / `Admin@123`
- **Agent**: `agent@helpdesk.com` / `Agent@123`

### 4. Run the project

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev
```

Open: http://localhost:5173

## API Reference

Base URL: `http://localhost:5000`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new client |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Get own profile |

### Tickets

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tickets` | JWT | List tickets (role-filtered) |
| POST | `/api/tickets` | JWT (client) | Create ticket (multipart/form-data) |
| GET | `/api/tickets/:id` | JWT | Get single ticket |
| PATCH | `/api/tickets/:id` | JWT (agent/admin) | Update status |
| PATCH | `/api/tickets/:id/claim` | JWT (agent) | Claim ticket |
| DELETE | `/api/tickets/:id` | JWT (admin) | Delete ticket |

### Comments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tickets/:id/comments` | JWT | Get all comments |
| POST | `/api/tickets/:id/comments` | JWT | Post a comment |

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | JWT (admin) | System statistics |
| GET | `/api/admin/users` | JWT (admin) | List all users |
| DELETE | `/api/admin/users/:id` | JWT (admin) | Delete a user |
| DELETE | `/api/admin/tickets/:id` | JWT (admin) | Delete any ticket |

## Project Structure

```
helpdesk/
├── backend/
│   ├── server.js              # Entry point
│   ├── models/                # Mongoose schemas
│   ├── controllers/           # Business logic
│   ├── routes/                # Express routers
│   ├── middleware/            # Auth, error handler, multer
│   └── utils/                 # Token generator, seed script
└── frontend/
    └── src/
        ├── components/        # UI + layout + ticket components
        ├── pages/             # Auth, client, agent, admin pages
        ├── context/           # AuthContext (JWT + user state)
        ├── hooks/             # useAuth, useTickets
        ├── services/          # Axios API wrappers
        └── types/             # TypeScript interfaces
```

## Testing with Postman

1. `POST /api/auth/login` with `{ "email": "admin@helpdesk.com", "password": "Admin@123" }`
2. Copy the `token` from the response
3. Add header `Authorization: Bearer <token>` to all subsequent requests

## Author

Bizhanchik — PM04 Course Project, 2026
