# tic-tac-toe-fastapi-nextjs

This is a Tic-Tac-Toe game built with Next.js, TypeScript, Tailwind CSS, Python, FastAPI, and PostgreSQL.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Backend

To run the backend server, run the following commands:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## Database

This project uses PostgreSQL to store the game state and scores. To set up the database, you need to have PostgreSQL installed on your machine. Then, you need to create a database and update the database connection string in the `main.py` file.