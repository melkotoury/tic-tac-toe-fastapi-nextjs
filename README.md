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

- Docker Desktop (ensure it's running)
- PostgreSQL installed and running on your local machine.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/melkotoury/tic-tac-toe-fastapi-nextjs.git
   cd tic-tac-toe-fast-nextjs
   ```

### Database Setup (Local PostgreSQL)

Since you want to use your local PostgreSQL instance with the `melkotoury` user, follow these steps:

1.  **Ensure your PostgreSQL server is running.**

2.  **Create the database and grant privileges.** Open your terminal and connect to your PostgreSQL server. You might need to use `psql -U postgres` or `sudo -u postgres psql` depending on your setup.

    ```bash
    # Connect to PostgreSQL (replace 'postgres' with your admin user if different)
    psql -U postgres
    ```

    Once in the `psql` prompt, execute the following commands:

    ```sql
    -- Create the database if it doesn't exist
    CREATE DATABASE tictactoe_db;

    -- Grant all privileges on the database to your 'melkotoury' user
    GRANT ALL PRIVILEGES ON DATABASE tictactoe_db TO melkotoury;

    -- Exit psql
    \q
    ```

    **Note:** If your `melkotoury` user does not have a password set for PostgreSQL, or if you're unsure, you might need to set one:

    ```sql
    ALTER USER melkotoury WITH PASSWORD 'your_melkotoury_password';
    ```
    Replace `'your_melkotoury_password'` with your actual password.

3.  **Create a `.env` file** in the root of the project and add your database credentials. This file will be used by Docker Compose to set environment variables for the services.

    ```
    DB_USER=melkotoury
    DB_PASSWORD=Rc0737 # This password is set in the .env file for convenience.
    DB_NAME=tictactoe_db
    ```

    **IMPORTANT:** Ensure the password for your `melkotoury` PostgreSQL user matches the `DB_PASSWORD` in this `.env` file.

### Environment Variables (`.env` vs `.env.example`)

This project uses a single `.env` file at the root for managing environment variables when running with Docker Compose. This file is automatically picked up by `docker compose` and its variables are passed to the respective services (backend and frontend).

*   The **`.env` file at the project root** contains the actual credentials and configuration used by Docker Compose.
*   The **`.env.example` files** (e.g., `frontend/.env.example`) are provided as **templates** for developers who might want to run individual services (like the frontend or backend) *independently* of the full Docker Compose setup. If you were to run `npm run dev` directly in the `frontend` directory, you would typically create a `.env.local` file from `frontend/.env.example` to configure the frontend's API URL.

### Running the Application

1.  **Ensure Docker Desktop is running.**

2.  **Build and run the Docker containers:**

    ```bash
    docker compose up --build
    ```

    This command will:
    - Build the Docker images for the backend and frontend.
    - Start the FastAPI backend container, connecting to your local PostgreSQL.
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
│   └── requirements.txt
├── frontend
│   ├── Dockerfile
│   ├── src
│   │   └── app
│   │       ├── page.tsx
│   │       └── layout.tsx
│   │   └── components
│   │       └── GameBoard.tsx
│   ├── package.json
│   └── ...
├── .env
├── .gitignore
├── docker-compose.yml
└── README.md
```