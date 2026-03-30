# Survey App MVP

A LAN-first survey application for schools, enabling teachers and students to create, distribute, and respond to surveys.

## Features
- **Admin Dashboard**: Real-time analytics, user import (CSV), and class management.
- **Teacher/Student Dashboards**: Role-based access with real-time search and survey status tracking.
- **Survey Creation**: Multi-question support (Multiple Choice, True/False, Ranking, Text).
- **Role-Based Sharing**: Granular control (Class, Year Level, or School).
- **Advanced Analytics**: Aggregated results with automated privacy masking and completion tracking.
- **Modern UI**: Full Dark Mode support with HeroUI (f.k.a. NextUI) and Tailwind CSS.

## Tech Stack
- **Frontend**: React (Vite), HeroUI, Tailwind CSS, Date-fns.
- **Backend**: Node.js (Express), JSON Web Token (JWT), Axios.
- **Database**: SQLite (better-sqlite3) with session persistence.

## LAN Deployment Instructions

To run this application on a local school network:

### 1. Prerequisites
- Node.js (v18+) installed on the host machine.
- All devices must be on the same local network (LAN).

### 2. Setup
Clone the repository and install dependencies in the root, backend, and frontend directories:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Database Initialization
Run the initialization script in the backend:
```bash
cd backend
node src/db/init.js
```

### 4. Running the Application
From the root directory, you can run both the frontend and backend concurrently:
```bash
npm run dev
```

### 5. Accessing from Other Devices
To access the app from other machines on the LAN:
1. Find the host machine's local IP address (e.g., `192.168.1.50`).
   - Windows: `ipconfig`
   - Linux/Mac: `ifconfig` or `ip addr`
2. Open a browser on the other device and navigate to:
   - `http://<HOST_IP>:3005`

### 6. Production Build (Recommended for actual use)
For better performance, build the frontend and serve it through the backend:
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. The backend is configured to serve the production build (ensure the static path is correct in `backend/src/index.js`).

## Ports
- **Frontend**: 3005
- **Backend**: 3006

## Security Note
This application is designed for internal LAN use and does not use HTTPS by default. Do not expose it to the public internet without additional security measures (e.g., a reverse proxy with SSL).
