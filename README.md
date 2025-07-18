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

1.  **Create a `.env` file** in the **root** of the project by copying the example file:

    ```bash
    cp .env.example .env
    ```

2.  Open the newly created `.env` file and update the variables:

    ```
    DB_USER=postgres_user
    DB_PASSWORD=postgres_password
    DB_NAME=tictactoe_db

    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

    **IMPORTANT:**
    *   `DB_USER`, `DB_PASSWORD`, `DB_NAME`: These credentials will be used by the PostgreSQL container that Docker Compose spins up. You can choose any strong username and password here.
    *   `NEXT_PUBLIC_API_URL`: This should point to your backend service. `http://localhost:8000` is correct for local development via Docker Compose.

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
│   ├── package.json
│   └── ...
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```