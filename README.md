# Tic-Tac-Toe Fullstack

This is a full-stack Tic-Tac-Toe application built with the following technologies:

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL

## Features

- Play Tic-Tac-Toe against an AI opponent.
- Choose your symbol (X or O).
- Select from three difficulty levels: Easy, Normal, and Hard.
- Game state is persisted in a PostgreSQL database.
- Scores are tracked for each player.

## Getting Started

### Prerequisites

- Node.js and npm
- Python and pip
- PostgreSQL

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/melkotoury/tic-tac-toe-fastapi-nextjs.git
   cd tic-tac-toe-fastapi-nextjs
   ```

2. **Install frontend dependencies:**

   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies:**

   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

### Database Setup

1. **Create a PostgreSQL database.**
2. **Create a `.env` file in the `backend` directory** and add your database connection string:

   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

### Running the Application

1. **Start the backend server:**

   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Start the frontend development server:**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`.

## Project Structure

```
.
├── backend
│   ├── .env (ignored)
│   ├── main.py
│   └── requirements.txt
├── frontend
│   ├── src
│   │   └── app
│   │       ├── page.tsx
│   │       └── layout.tsx
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```
