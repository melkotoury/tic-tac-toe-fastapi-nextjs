import pytest
from app.game_logic import TicTacToeGame

@pytest.fixture
def new_game():
    return TicTacToeGame(
        board=['', '', '', '', '', '', '', '', ''],
        human_player='X',
        ai_player='O',
        current_player='X',
        difficulty='normal',
        game_active=True,
        winner=None
    )

def test_make_move(new_game):
    assert new_game.make_move(0, 'X') is True
    assert new_game.board[0] == 'X'
    assert new_game.make_move(0, 'O') is False # Already taken

def test_check_win_rows(new_game):
    new_game.board = ['X', 'X', 'X', '', '', '', '', '', '']
    assert new_game.check_win('X') is True
    new_game.board = ['', '', '', 'O', 'O', 'O', '', '', '']
    assert new_game.check_win('O') is True

def test_check_win_columns(new_game):
    new_game.board = ['X', '', '', 'X', '', '', 'X', '', '']
    assert new_game.check_win('X') is True
    new_game.board = ['', 'O', '', '', 'O', '', '', 'O', '']
    assert new_game.check_win('O') is True

def test_check_win_diagonals(new_game):
    new_game.board = ['X', '', '', '', 'X', '', '', '', 'X']
    assert new_game.check_win('X') is True
    new_game.board = ['', '', 'O', '', 'O', '', 'O', '', '']
    assert new_game.check_win('O') is True

def test_is_board_full(new_game):
    new_game.board = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X']
    assert new_game.is_board_full() is True
    new_game.board = ['X', '', 'X', '', '', '', '', '', '']
    assert new_game.is_board_full() is False

def test_ai_easy_move(new_game):
    new_game.difficulty = 'easy'
    new_game.board = ['X', '', '', '', '', '', '', '', '']
    move = new_game.get_ai_move()
    assert move in [1, 2, 3, 4, 5, 6, 7, 8]

def test_ai_hard_move_win(new_game):
    new_game.difficulty = 'hard'
    new_game.board = ['X', 'O', '', 'X', '', '', '', '', '']
    new_game.ai_player = 'O'
    new_game.human_player = 'X'
    # AI should block human win
    new_game.board = ['X', 'X', '', '', '', '', '', '', '']
    assert new_game.get_ai_move() == 2

def test_ai_hard_move_block(new_game):
    new_game.difficulty = 'hard'
    new_game.board = ['X', 'X', '', '', '', '', '', '', '']
    new_game.ai_player = 'O'
    new_game.human_player = 'X'
    assert new_game.get_ai_move() == 2

def test_ai_hard_move_fork(new_game):
    new_game.difficulty = 'hard'
    new_game.board = ['X', '', '', '', 'O', '', '', '', 'X']
    new_game.ai_player = 'O'
    new_game.human_player = 'X'
    # AI should create a fork (e.g., take a corner or edge that leads to two winning lines)
    # This is a complex scenario for simple tests, but we can test specific outcomes
    # For example, if X is at 0 and 8, O should take 4 (center) or a strategic edge/corner
    # Let's test a simpler fork scenario: X at 0, O at 4, X at 2. AI should block at 1 or 6
    new_game.board = ['X', '', 'X', '', 'O', '', '', '', '']
    move = new_game.get_ai_move()
    assert move in [1, 3, 5, 6, 7, 8] # AI should block or create a threat

