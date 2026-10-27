# FLEXI ✨ Full-Stack Web Application

A task-management app with a React frontend, a Node.js backend and a MongoDB database.

## Technology stack
| Layer | Technology |
|---|---|
| Frontend | React.js (Vite), HTML, CSS, JavaScript |
| Backend | Node.js + Express, JWT login, bcrypt password hashing |
| Database | MongoDB (view it in MongoDB Compass) via Mongoose |

## Frontend-backend integration
- The React app calls the API with `fetch` (`client/src/api.js`).
- Vite proxies every `/api` request to the backend on port 5000 (`client/vite.config.js`).
- Register, login and task actions (add, move, delete) are all saved in MongoDB and loaded back on every page load.

## Folder structure
```
client/   React frontend  (pages: Login, Dashboard)
server/   Node/Express backend (routes, models, middleware)
```

## Run it (Mac)
1. Start MongoDB:       `brew services start mongodb-community`
2. Free port 5000:      System Settings > General > AirDrop & Handoff > turn AirPlay Receiver Off
3. Backend (Tab 1):     `cd server && npm install && npm run dev`    -> http://localhost:5000
4. Frontend (Tab 2):    `cd client && npm install && npm run dev`    -> http://localhost:5173
5. Open http://localhost:5173, register, log in and add tasks.

## See the data in MongoDB Compass
Connect to `mongodb://127.0.0.1:27017` and open the `flexi` database:
- `users` collection: registered accounts (passwords are hashed)
- `tasks` collection: every task, linked to its owner

## API
- POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
- GET /api/tasks, POST /api/tasks, PUT /api/tasks/:id, DELETE /api/tasks/:id  (Bearer token required)
- GET /api/health

Server settings live in `server/.env` (hidden file; press Cmd+Shift+. in Finder to see it).
