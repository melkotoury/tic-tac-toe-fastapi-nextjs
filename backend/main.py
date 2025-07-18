import os
import psycopg2
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import random

load_dotenv()

app = FastAPI()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_USER = os.getenv("DB_USER", "user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_NAME = os.getenv("DB_NAME", "database")

def get_db_connection():
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        dbname=DB_NAME
    )
    return conn

def create_table():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS games (
            id SERIAL PRIMARY KEY,
            board JSONB NOT NULL,
            human_player VARCHAR(1) NOT NULL,
            ai_player VARCHAR(1) NOT NULL,
            current_player VARCHAR(1) NOT NULL,
            difficulty VARCHAR(10) NOT NULL,
            game_active BOOLEAN NOT NULL,
            winner VARCHAR(1)
        );
    """)
    conn.commit()
    cur.close()
    conn.close()

create_table()

class Game(BaseModel):
    id: int | None = None
    board: list[str]
    human_player: str
    ai_player: str
    current_player: str
    difficulty: str
    game_active: bool
    winner: str | None = None

@app.post("/games", response_model=Game)
def create_game(game: Game):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO games (board, human_player, ai_player, current_player, difficulty, game_active, winner) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (str(game.board), game.human_player, game.ai_player, game.current_player, game.difficulty, game.game_active, game.winner)
    )
    game.id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return game

@app.get("/games/{game_id}", response_model=Game)
def get_game(game_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM games WHERE id = %s", (game_id,))
    game_data = cur.fetchone()
    cur.close()
    conn.close()
    if not game_data:
        raise HTTPException(status_code=404, detail="Game not found")
    return Game(
        id=game_data[0],
        board=game_data[1],
        human_player=game_data[2],
        ai_player=game_data[3],
        current_player=game_data[4],
        difficulty=game_data[5],
        game_active=game_data[6],
        winner=game_data[7]
    )

@app.put("/games/{game_id}", response_model=Game)
def update_game(game_id: int, game: Game):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE games SET board = %s, human_player = %s, ai_player = %s, current_player = %s, difficulty = %s, game_active = %s, winner = %s WHERE id = %s",
        (str(game.board), game.human_player, game.ai_player, game.current_player, game.difficulty, game.game_active, game.winner, game_id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return game

@app.post("/ai-move")
def ai_move(game: Game):
    if not game.game_active:
        return {"board": game.board}

    best_move = get_best_move(game)
    game.board[best_move] = game.ai_player

    if check_win(game.board, game.ai_player):
        game.game_active = False
        game.winner = game.ai_player
    elif is_board_full(game.board):
        game.game_active = False
        game.winner = "tie"
    else:
        game.current_player = game.human_player

    return game

def get_best_move(game: Game):
    available_moves = [i for i, cell in enumerate(game.board) if cell == '']

    if game.difficulty == 'easy':
        return get_easy_move(game, available_moves)
    elif game.difficulty == 'normal':
        return get_normal_move(game, available_moves)
    else:
        return get_hard_move(game)

def get_easy_move(game: Game, available_moves):
    if random.random() < 0.2:
        return get_smart_move(game, available_moves)
    return random.choice(available_moves)

def get_normal_move(game: Game, available_moves):
    if random.random() < 0.7:
        return get_smart_move(game, available_moves)
    return random.choice(available_moves)

def get_hard_move(game: Game):
    return minimax_move(game)

def get_smart_move(game: Game, available_moves):
    # Check for winning move
    for move in available_moves:
        board_copy = game.board[:]
        board_copy[move] = game.ai_player
        if check_win(board_copy, game.ai_player):
            return move

    # Check for blocking move
    for move in available_moves:
        board_copy = game.board[:]
        board_copy[move] = game.human_player
        if check_win(board_copy, game.human_player):
            return move

    # Take center
    if 4 in available_moves:
        return 4

    # Take corner
    corners = [0, 2, 6, 8]
    available_corners = [move for move in available_moves if move in corners]
    if available_corners:
        return random.choice(available_corners)

    # Take edge
    edges = [1, 3, 5, 7]
    available_edges = [move for move in available_moves if move in edges]
    if available_edges:
        return random.choice(available_edges)

    return random.choice(available_moves)

def minimax_move(game: Game):
    best_score = -float('inf')
    best_move = 0

    for i in range(9):
        if game.board[i] == '':
            game.board[i] = game.ai_player
            score = minimax(game, 0, False)
            game.board[i] = ''

            if score > best_score:
                best_score = score
                best_move = i

    return best_move

def minimax(game: Game, depth, is_maximizing):
    if check_win(game.board, game.ai_player):
        return 10 - depth
    if check_win(game.board, game.human_player):
        return depth - 10
    if is_board_full(game.board):
        return 0

    if is_maximizing:
        best_score = -float('inf')
        for i in range(9):
            if game.board[i] == '':
                game.board[i] = game.ai_player
                score = minimax(game, depth + 1, False)
                game.board[i] = ''
                best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for i in range(9):
            if game.board[i] == '':
                game.board[i] = game.human_player
                score = minimax(game, depth + 1, True)
                game.board[i] = ''
                best_score = min(score, best_score)
        return best_score

def check_win(board, player):
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
        [0, 4, 8], [2, 4, 6]  # diagonals
    ]
    for combination in winning_combinations:
        if all(board[i] == player for i in combination):
            return True
    return False

def is_board_full(board):
    return all(cell != '' for cell in board)