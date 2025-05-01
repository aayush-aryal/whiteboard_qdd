# ✏️ Real-Time Collaborative Whiteboard

A full-stack collaborative whiteboard application where multiple users can draw together in real time, with authentication, room-based collaboration, and persistent session support.

## 🚀 Features

- 🎨 Draw & erase on a canvas using Konva
- 🤝 Real-time multi-user collaboration with Socket.IO & rooms
- 🔐 User authentication with Passport.js
- 🗃️ PostgreSQL with Prisma ORM for database operations
- 🧠 Express.js backend with RESTful API endpoints
- 🖌️ Tailwind CSS for clean UI design

## 🛠️ Tech Stack

| Frontend | Backend | Realtime | Database | Auth |
|----------|---------|----------|----------|------|
| React    | Express | Socket.IO| PostgreSQL| Passport.js |
| Konva    | Prisma  |          |          |         |
| Tailwind CSS |     |          |          |         |

## 📷 Demo


## 🧪 Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL instance
- Optional: Docker

### Installation

1. Clone the repo:

```bash
git clone https://github.com/yourusername/whiteboard-app.git
cd whiteboard-app

```

2. Install dependencies:

```bash
# Backend
cd server
npm install
# Frontend
cd ../client
npm install
```

3. Configure environtment variables:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/YOUR_DB
SESSION_SECRET=your-secret-key

``` 
4. Setup the database 

```bash 
cd server
npx prisma generate
npx prisma migrate dev --name init

```

6. Run the app 

```bash
# In server terminal
npm run dev

# In a separate terminal, run the frontend
cd ../client
npm run dev

```