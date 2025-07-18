# Tic-Tac-Toe Fullstack

This is a full-stack Tic-Tac-Toe application built with the following technologies:

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL (Dockerized)

## Features

- Play Tic-Tac-Toe against an AI opponent.
- Choose your symbol (X or O).
- Select from three difficulty levels: Easy, Normal, and Hard.
- Game state is persisted in a PostgreSQL database.
- Scores are tracked for each player.

## Getting Started

### Prerequisites

- Docker Desktop (ensure it's running)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/melkotoury/tic-tac-toe-fast-nextjs.git
   cd tic-tac-toe-fast-nextjs
   ```

### Environment Variables

Environment variables are crucial for configuring the application. They are kept out of version control for security.

1.  **Backend Environment Variables:**
    *   Copy the example file to create your local `.env` file:
        ```bash
        cp backend/.env.example backend/.env
        ```
    *   Open `backend/.env` and update the database credentials for the **Dockerized PostgreSQL**:
        ```
        DB_USER=postgres_user
        DB_PASSWORD=postgres_password
        DB_NAME=tictactoe_db
        ```
        **IMPORTANT:** You can choose any username and password here. These will be used by the PostgreSQL container that Docker Compose spins up. `tictactoe_db` is the default database name.

2.  **Frontend Environment Variables:**
    *   Copy the example file to create your local `.env.local` file:
        ```bash
        cp frontend/.env.example frontend/.env.local
        ```
    *   Open `frontend/.env.local` and ensure `NEXT_PUBLIC_API_URL` points to your backend service (usually `http://localhost:8000` when running locally via Docker Compose):
        ```
        NEXT_PUBLIC_API_URL=http://localhost:8000
        ```

### Running the Application

1.  **Ensure Docker Desktop is running.**

2.  **Build and run the Docker containers:**

    ```bash
    docker compose up --build
    ```

    This command will:
    - Build the Docker images for the backend and frontend.
    - Start the PostgreSQL database container.
    - Start the FastAPI backend container, connecting to the Dockerized PostgreSQL.
    - Start the Next.js frontend container.

3.  **Open your browser** and navigate to `http://localhost:3000`.

## Project Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── app
│   │   ├── database.py
│   │   ├── game_logic.py
│   │   └── main.py
│   ├── .env (ignored)
│   ├── .env.example
│   └── requirements.txt
├── frontend
│   ├── Dockerfile
│   ├── src
│   │   └── app
│   │       ├── page.tsx
│   │       └── layout.tsx
│   │   └── components
│   │       └── GameBoard.tsx
│   ├── .env.local (ignored)
│   ├── .env.example
│   ├── package.json
│   └── ...
├── .gitignore
├── docker-compose.yml
└── README.md
```
