from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .database import get_db_connection, create_table
from .game_logic import TicTacToeGame
import json

app = FastAPI()

origins = [
    "http://localhost:3000",  # Frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure table is created on startup
@app.on_event("startup")
async def startup_event():
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
    score_x: int = 0
    score_o: int = 0

@app.post("/games", response_model=Game)
def create_game(game: Game):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO games (board, human_player, ai_player, current_player, difficulty, game_active, winner, score_x, score_o) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (json.dumps(game.board), game.human_player, game.ai_player, game.current_player, game.difficulty, game.game_active, game.winner, game.score_x, game.score_o)
        )
        game.id = cur.fetchone()[0]
        conn.commit()
        return game
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating game: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

@app.get("/games/{game_id}", response_model=Game)
def get_game(game_id: int):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, board, human_player, ai_player, current_player, difficulty, game_active, winner, score_x, score_o FROM games WHERE id = %s", (game_id,))
        game_data = cur.fetchone()
        if not game_data:
            raise HTTPException(status_code=404, detail="Game not found")
        return Game(
            id=game_data[0],
            board=json.loads(game_data[1]),
            human_player=game_data[2],
            ai_player=game_data[3],
            current_player=game_data[4],
            difficulty=game_data[5],
            game_active=game_data[6],
            winner=game_data[7],
            score_x=game_data[8],
            score_o=game_data[9]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving game: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

@app.put("/games/{game_id}", response_model=Game)
def update_game(game_id: int, game: Game):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE games SET board = %s, human_player = %s, ai_player = %s, current_player = %s, difficulty = %s, game_active = %s, winner = %s, score_x = %s, score_o = %s WHERE id = %s",
            (json.dumps(game.board), game.human_player, game.ai_player, game.current_player, game.difficulty, game.game_active, game.winner, game.score_x, game.score_o, game_id)
        )
        conn.commit()
        return game
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating game: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

@app.post("/ai-move", response_model=Game)
def ai_move_endpoint(game: Game):
    if not game.game_active:
        return game

    game_instance = TicTacToeGame(
        board=list(game.board),
        human_player=game.human_player,
        ai_player=game.ai_player,
        current_player=game.current_player,
        difficulty=game.difficulty,
        game_active=game.game_active,
        winner=game.winner
    )

    best_move = game_instance.get_ai_move()
    game_instance.make_move(best_move, game_instance.ai_player)

    if game_instance.check_win(game_instance.ai_player):
        game_instance.game_active = False
        game_instance.winner = game_instance.ai_player
        if game_instance.ai_player == 'X':
            game.score_x += 1
        else:
            game.score_o += 1
    elif game_instance.is_board_full():
        game_instance.game_active = False
        game_instance.winner = "tie"
    else:
        game_instance.current_player = game_instance.human_player

    game.board = game_instance.board
    game.game_active = game_instance.game_active
    game.winner = game_instance.winner
    game.current_player = game_instance.current_player

    return game