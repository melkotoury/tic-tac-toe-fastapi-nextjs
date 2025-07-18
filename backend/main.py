from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class GameState(BaseModel):
    board: list[str]
    currentPlayer: str
    humanPlayer: str
    aiPlayer: str
    gameActive: bool
    difficulty: str

@app.post("/ai-move")
def ai_move(game_state: GameState):
    if not game_state.gameActive:
        return {"board": game_state.board}

    best_move = get_best_move(game_state)
    game_state.board[best_move] = game_state.aiPlayer

    if check_win(game_state.board, game_state.aiPlayer):
        game_state.gameActive = False
    elif is_board_full(game_state.board):
        game_state.gameActive = False
    else:
        game_state.currentPlayer = game_state.humanPlayer

    return {"board": game_state.board, "gameActive": game_state.gameActive, "currentPlayer": game_state.currentPlayer}

def get_best_move(game_state: GameState):
    available_moves = [i for i, cell in enumerate(game_state.board) if cell == '']

    if game_state.difficulty == 'easy':
        return get_easy_move(game_state, available_moves)
    elif game_state.difficulty == 'normal':
        return get_normal_move(game_state, available_moves)
    else:
        return get_hard_move(game_state)

def get_easy_move(game_state: GameState, available_moves):
    if random.random() < 0.2:
        return get_smart_move(game_state, available_moves)
    return random.choice(available_moves)

def get_normal_move(game_state: GameState, available_moves):
    if random.random() < 0.7:
        return get_smart_move(game_state, available_moves)
    return random.choice(available_moves)

def get_hard_move(game_state: GameState):
    return minimax_move(game_state)

def get_smart_move(game_state: GameState, available_moves):
    # Check for winning move
    for move in available_moves:
        board_copy = game_state.board[:]
        board_copy[move] = game_state.aiPlayer
        if check_win(board_copy, game_state.aiPlayer):
            return move

    # Check for blocking move
    for move in available_moves:
        board_copy = game_state.board[:]
        board_copy[move] = game_state.humanPlayer
        if check_win(board_copy, game_state.humanPlayer):
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

def minimax_move(game_state: GameState):
    best_score = -float('inf')
    best_move = 0

    for i in range(9):
        if game_state.board[i] == '':
            game_state.board[i] = game_state.aiPlayer
            score = minimax(game_state, 0, False)
            game_state.board[i] = ''

            if score > best_score:
                best_score = score
                best_move = i

    return best_move

def minimax(game_state: GameState, depth, is_maximizing):
    if check_win(game_state.board, game_state.aiPlayer):
        return 10 - depth
    if check_win(game_state.board, game_state.humanPlayer):
        return depth - 10
    if is_board_full(game_state.board):
        return 0

    if is_maximizing:
        best_score = -float('inf')
        for i in range(9):
            if game_state.board[i] == '':
                game_state.board[i] = game_state.aiPlayer
                score = minimax(game_state, depth + 1, False)
                game_state.board[i] = ''
                best_score = max(score, best_score)
        return best_score
    else:
        best_score = float('inf')
        for i in range(9):
            if game_state.board[i] == '':
                game_state.board[i] = game_state.humanPlayer
                score = minimax(game_state, depth + 1, True)
                game_state.board[i] = ''
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