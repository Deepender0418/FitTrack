# 🏋️‍♂️ FitTrack

A modern full-stack Fitness Tracker app to help users log workouts, track progress, and visualize performance using charts. Built using the MERN stack with TypeScript, Tailwind CSS, and Vite.

## 🚀 Features

- User authentication with JWT & bcrypt
- Secure API with Express and MongoDB (via Mongoose)
- Chart-based progress visualization (Chart.js)
- Responsive, animated UI (Tailwind CSS + Framer Motion)
- Modular architecture with React Router
- Environment variable support with dotenv
- Linting and type checking for clean, safe code

---

## 🧱 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Chart.js & React Chart.js 2

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs (Password Hashing)
- Cookie Parser & Body Parser

### Dev Tools
- TypeScript
- ESLint
- Concurrently
- PostCSS
- dotenv

---

## 📁 Project Structure

fitness-tracker/
├── client/ # React Frontend
├── server/ # Express Backend
├── public/ # Static Assets
├── .env # Environment Variables
├── package.json # Root Config
├── tailwind.config.js # Tailwind Setup
├── tsconfig.json # TypeScript Setup
└── README.md # Project Docs



---

## ⚙️ Scripts

| Script            | Description                            |
|-------------------|----------------------------------------|
| `npm run dev`     | Runs frontend & backend concurrently   |
| `npm run dev:client` | Runs the React frontend (Vite)     |
| `npm run dev:server` | Runs the Express backend           |
| `npm run build`   | Builds frontend using TypeScript & Vite |
| `npm run preview` | Serves the production frontend locally |
| `npm run lint`    | Runs ESLint across project             |

---

## 🌐 Environment Variables

Create a `.env` file in the root directory with the following:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000

