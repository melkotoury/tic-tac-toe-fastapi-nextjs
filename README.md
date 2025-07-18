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

- Docker and Docker Compose

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/melkotoury/tic-tac-toe-fastapi-nextjs.git
   cd tic-tac-toe-fastapi-nextjs
   ```

2. **Create a `.env.docker` file** in the root of the project and add your database credentials. This file will be used by Docker Compose to set environment variables for the services.

   ```
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=tictactoe_db
   ```

   **Note:** Replace `your_db_user` and `your_db_password` with strong, secure credentials. The `DB_NAME` can be anything you prefer.

### Running the Application

1. **Build and run the Docker containers:**

   ```bash
   docker compose up --build
   ```

   This command will:
   - Build the Docker images for the backend and frontend.
   - Start the PostgreSQL database container.
   - Start the FastAPI backend container.
   - Start the Next.js frontend container.

2. **Open your browser** and navigate to `http://localhost:3000`.

## Project Structure

```
.
├── backend
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── frontend
│   ├── Dockerfile
│   ├── src
│   │   └── app
│   │       ├── page.tsx
│   │       └── layout.tsx
│   ├── package.json
│   └── ...
├── .env.docker (ignored)
├── .gitignore
├── docker-compose.yml
└── README.md
```
