import random

class TicTacToeGame:
    def __init__(self, board, human_player, ai_player, current_player, difficulty, game_active, winner):
        self.board = board
        self.human_player = human_player
        self.ai_player = ai_player
        self.current_player = current_player
        self.difficulty = difficulty
        self.game_active = game_active
        self.winner = winner

    def make_move(self, index, player):
        if self.board[index] != '' or not self.game_active:
            return False
        self.board[index] = player
        return True

    def check_win(self, player):
        winning_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
            [0, 4, 8], [2, 4, 6]  # diagonals
        ]
        for combination in winning_combinations:
            if all(self.board[i] == player for i in combination):
                return True
        return False

    def is_board_full(self):
        return all(cell != '' for cell in self.board)

    def get_ai_move(self):
        available_moves = [i for i, cell in enumerate(self.board) if cell == '']

        if self.difficulty == 'easy':
            return self._get_easy_move(available_moves)
        elif self.difficulty == 'normal':
            return self._get_normal_move(available_moves)
        else:
            return self._get_hard_move()

    def _get_easy_move(self, available_moves):
        if random.random() < 0.2:
            return self._get_smart_move(available_moves)
        return random.choice(available_moves)

    def _get_normal_move(self, available_moves):
        if random.random() < 0.7:
            return self._get_smart_move(available_moves)
        return random.choice(available_moves)

    def _get_hard_move(self):
        return self._minimax_move()

    def _get_smart_move(self, available_moves):
        # Check for winning move
        for move in available_moves:
            board_copy = list(self.board)
            board_copy[move] = self.ai_player
            if self._check_win_static(board_copy, self.ai_player):
                return move

        # Check for blocking move
        for move in available_moves:
            board_copy = list(self.board)
            board_copy[move] = self.human_player
            if self._check_win_static(board_copy, self.human_player):
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

    def _minimax_move(self):
        best_score = -float('inf')
        best_move = 0

        for i in range(9):
            if self.board[i] == '':
                self.board[i] = self.ai_player
                score = self._minimax(self.board, 0, False)
                self.board[i] = ''

                if score > best_score:
                    best_score = score
                    best_move = i

        return best_move

    def _minimax(self, board, depth, is_maximizing):
        if self._check_win_static(board, self.ai_player):
            return 10 - depth
        if self._check_win_static(board, self.human_player):
            return depth - 10
        if self._is_board_full_static(board):
            return 0

        if is_maximizing:
            best_score = -float('inf')
            for i in range(9):
                if board[i] == '':
                    board[i] = self.ai_player
                    score = self._minimax(board, depth + 1, False)
                    board[i] = ''
                    best_score = max(score, best_score)
            return best_score
        else:
            best_score = float('inf')
            for i in range(9):
                if board[i] == '':
                    board[i] = self.human_player
                    score = self._minimax(board, depth + 1, True)
                    board[i] = ''
                    best_score = min(score, best_score)
            return best_score

    def _check_win_static(self, board, player):
        winning_combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # columns
            [0, 4, 8], [2, 4, 6]  # diagonals
        ]
        for combination in winning_combinations:
            if all(board[i] == player for i in combination):
                return True
        return False

    def _is_board_full_static(self, board):
        return all(cell != '' for cell in board)
