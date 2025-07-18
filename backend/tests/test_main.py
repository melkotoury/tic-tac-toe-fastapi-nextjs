import pytest
from httpx import AsyncClient
from app.main import app
from app.database import get_db_connection, create_table
import psycopg2
import os

# Override database connection for testing
@pytest.fixture(name="test_db_conn")
def test_db_conn():
    # Use a separate test database or mock the connection
    # For simplicity, we'll use the same DB_NAME but ensure it's clean
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_USER = os.getenv("DB_USER", "postgres_user") # Use the user from .env
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres_password") # Use the password from .env
    DB_NAME = os.getenv("DB_NAME", "tictactoe_db")

    conn = None
    try:
        # Connect to default postgres database to drop/create test db
        temp_conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname="postgres"
        )
        temp_conn.autocommit = True
        cur = temp_conn.cursor()

        # Drop and create the test database
        cur.execute(f"DROP DATABASE IF EXISTS {DB_NAME} WITH (FORCE);")
        cur.execute(f"CREATE DATABASE {DB_NAME} OWNER {DB_USER};")
        cur.close()
        temp_conn.close()

        # Connect to the newly created test database
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            dbname=DB_NAME
        )
        yield conn
    except Exception as e:
        print(f"Error setting up test database: {e}")
        raise
    finally:
        if conn:
            conn.close()

@pytest.fixture(name="client")
async def client_fixture(test_db_conn):
    # Ensure tables are created for each test run
    create_table()
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.mark.asyncio
async def test_create_game(client):
    response = await client.post(
        "/games",
        json={
            "board": ['', '', '', '', '', '', '', '', ''],
            "human_player": "X",
            "ai_player": "O",
            "current_player": "X",
            "difficulty": "normal",
            "game_active": True,
            "winner": None,
            "score_x": 0,
            "score_o": 0
        }
    )
    assert response.status_code == 200
    assert response.json()["id"] is not None
    assert response.json()["board"] == ['', '', '', '', '', '', '', '', '']

@pytest.mark.asyncio
async def test_get_game(client):
    # First create a game
    create_response = await client.post(
        "/games",
        json={
            "board": ['', '', '', '', '', '', '', '', ''],
            "human_player": "X",
            "ai_player": "O",
            "current_player": "X",
            "difficulty": "normal",
            "game_active": True,
            "winner": None,
            "score_x": 0,
            "score_o": 0
        }
    )
    game_id = create_response.json()["id"]

    # Then get the game
    get_response = await client.get(f"/games/{game_id}")
    assert get_response.status_code == 200
    assert get_response.json()["id"] == game_id

@pytest.mark.asyncio
async def test_ai_move(client):
    # Create a game where AI can make a move
    create_response = await client.post(
        "/games",
        json={
            "board": ['X', '', '', '', '', '', '', '', ''],
            "human_player": "O", # AI is X
            "ai_player": "X",
            "current_player": "X",
            "difficulty": "easy",
            "game_active": True,
            "winner": None,
            "score_x": 0,
            "score_o": 0
        }
    )
    game_data = create_response.json()

    # AI makes a move
    ai_move_response = await client.post("/ai-move", json=game_data)
    assert ai_move_response.status_code == 200
    updated_game = ai_move_response.json()
    assert updated_game["board"] != game_data["board"]
    assert updated_game["current_player"] == game_data["human_player"]

@pytest.mark.asyncio
async def test_ai_move_win(client):
    # Setup board for AI to win
    create_response = await client.post(
        "/games",
        json={
            "board": ['O', 'O', '', '', '', '', '', '', ''],
            "human_player": "X",
            "ai_player": "O",
            "current_player": "O",
            "difficulty": "hard",
            "game_active": True,
            "winner": None,
            "score_x": 0,
            "score_o": 0
        }
    )
    game_data = create_response.json()

    ai_move_response = await client.post("/ai-move", json=game_data)
    assert ai_move_response.status_code == 200
    updated_game = ai_move_response.json()
    assert updated_game["game_active"] is False
    assert updated_game["winner"] == "O"
    assert updated_game["score_o"] == 1

@pytest.mark.asyncio
async def test_ai_move_tie(client):
    # Setup board for a tie
    create_response = await client.post(
        "/games",
        json={
            "board": ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', ''],
            "human_player": "X",
            "ai_player": "O",
            "current_player": "O",
            "difficulty": "hard",
            "game_active": True,
            "winner": None,
            "score_x": 0,
            "score_o": 0
        }
    )
    game_data = create_response.json()

    ai_move_response = await client.post("/ai-move", json=game_data)
    assert ai_move_response.status_code == 200
    updated_game = ai_move_response.json()
    assert updated_game["game_active"] is False
    assert updated_game["winner"] == "tie"

@pytest.mark.asyncio
async def test_update_game(client):
    # First create a game
    create_response = await client.post(
        "/games",
        json={
            "board": ['', '', '', '', '', '', '', '', ''],
            "human_player": "X",
            "ai_player": "O",
            "current_player": "X",
            "difficulty": "normal",
            "game_active": True,
            "winner": None,
            "score_x": 0,
            "score_o": 0
        }
    )
    game_id = create_response.json()["id"]
    updated_board = ['X', '', '', '', '', '', '', '', '']

    # Update the game
    update_response = await client.put(
        f"/games/{game_id}",
        json={
            "id": game_id,
            "board": updated_board,
            "human_player": "X",
            "ai_player": "O",
            "current_player": "O",
            "difficulty": "normal",
            "game_active": True,
            "winner": None,
            "score_x": 0,
            "score_o": 0
        }
    )
    assert update_response.status_code == 200
    assert update_response.json()["board"] == updated_board
    assert update_response.json()["current_player"] == "O"

