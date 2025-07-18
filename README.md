# 🎮 Tic-Tac-Toe Fullstack Application

Welcome to the Tic-Tac-Toe Fullstack Application! This project demonstrates a modern web application built with a robust and scalable technology stack, featuring a classic game with an AI opponent.

## ✨ Features

-   **Interactive Gameplay:** Play Tic-Tac-Toe against an intelligent AI.
-   **Player Customization:** Choose your symbol (X or O) to start the game.
-   **Adjustable Difficulty:** Challenge yourself with Easy, Normal, or Hard AI levels.
-   **Persistent Game State:** Game progress and scores are saved in a PostgreSQL database.
-   **Score Tracking:** Keep track of wins for both X and O.
-   **Confetti Celebration:** Enjoy a visual celebration on victory!

## 🚀 Technologies Used

This application leverages the power of:

-   **Frontend:**
    -   [Next.js](https://nextjs.org/) (React Framework)
    -   [React](https://react.dev/) (UI Library)
    -   [TypeScript](https://www.typescriptlang.org/) (Type-safe JavaScript)
    -   [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS Framework)
-   **Backend:**
    -   [Python](https://www.python.org/) (Programming Language)
    -   [FastAPI](https://fastapi.tiangolo.com/) (High-performance Web Framework)
    -   [Pydantic](https://docs.pydantic.dev/latest/) (Data Validation)
    -   [psycopg2](https://www.psycopg.org/) (PostgreSQL Adapter)
    -   [Ruff](https://docs.astral.sh/ruff/) (Python Linter & Formatter)
    -   [Pytest](https://docs.pytest.org/en/stable/) (Testing Framework)
    -   [Httpx](https://www.python-httpx.org/) (HTTP Client for testing)
-   **Database:**
    -   [PostgreSQL](https://www.postgresql.org/) (Powerful Open-Source Relational Database)
-   **Containerization:**
    -   [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (For consistent development environments)

## 📦 Getting Started

To get this project up and running on your local machine, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed:

-   **Docker Desktop:** Essential for running the application's services in containers. [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Installation

1.  **Clone the repository:**

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

2.  Open the newly created `.env` file and update the variables. These credentials will be used by the Dockerized PostgreSQL container. You can choose any strong username and password here.

    ```
    DB_USER=postgres_user
    DB_PASSWORD=postgres_password
    DB_NAME=tictactoe_db

    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

    **IMPORTANT:**
    *   Replace `your_postgres_user` and `your_postgres_password` with your desired strong credentials.
    *   `DB_NAME`: You can keep `tictactoe_db` or choose another name.
    *   `NEXT_PUBLIC_API_URL`: This should point to your backend service. `http://localhost:8000` is correct for local development via Docker Compose.

### Running the Application

1.  **Ensure Docker Desktop is running.** This is vital for `docker compose` commands to function.

2.  **Build and run the Docker containers:**

    ```bash
    docker compose up --build
    ```

    This command will:
    -   Build the Docker images for the backend and frontend (this might take a few minutes on the first run).
    -   Start the PostgreSQL database container.
    -   Start the FastAPI backend container, which will connect to the Dockerized PostgreSQL.
    -   Start the Next.js frontend container.

3.  **Access the Application:**
    Once all services are up and running (you'll see logs from both frontend and backend in your terminal), open your web browser and navigate to:

    ```
    http://localhost:3000
    ```

### Running Tests

#### Backend Tests

To run the backend tests, first ensure your Docker containers are running (`docker compose up`). Then, execute the tests within the backend service:

```bash
docker compose exec backend pytest
```

#### Frontend Tests

(Coming Soon: Frontend tests will be added in a future update.)

### Connecting to the Database (Optional)

If you wish to inspect the database directly using a tool like SQLPro Studio, DBeaver, or pgAdmin, use the following connection details:

-   **Host/Address:** `localhost`
-   **Port:** `5432`
-   **Database:** The `DB_NAME` you set in your `.env` file (default: `tictactoe_db`)
-   **Username:** The `DB_USER` you set in your `.env` file (default: `postgres_user`)
-   **Password:** The `DB_PASSWORD` you set in your `.env` file (default: `postgres_password`)

## 📂 Project Structure

```
.
├── backend/
│   ├── Dockerfile
│   ├── app/
│   │   ├── database.py
│   │   ├── game_logic.py
│   │   └── main.py
│   ├── tests/
│   │   ├── test_game_logic.py
│   │   └── test_main.py
│   └── requirements.txt
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   └── components/
│   │       └── GameBoard.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## 📄 License

This project is open-source and available under the MIT License.
