class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.humanPlayer = 'X';
        this.aiPlayer = 'O';
        this.gameActive = true;
        this.scores = { X: 0, O: 0 };
        this.difficulty = 'normal';

        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateTurnIndicator();
        this.updateScoreboard();
    }

    bindEvents() {
        document.querySelectorAll('.cell').forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        document.getElementById('choose-x').addEventListener('click', () => this.choosePlayer('X'));
        document.getElementById('choose-o').addEventListener('click', () => this.choosePlayer('O'));

        document.getElementById('difficulty-easy').addEventListener('click', () => this.setDifficulty('easy'));
        document.getElementById('difficulty-normal').addEventListener('click', () => this.setDifficulty('normal'));
        document.getElementById('difficulty-hard').addEventListener('click', () => this.setDifficulty('hard'));

        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
    }

    setDifficulty(level) {
        this.difficulty = level;

        document.getElementById('difficulty-easy').classList.toggle('active', level === 'easy');
        document.getElementById('difficulty-normal').classList.toggle('active', level === 'normal');
        document.getElementById('difficulty-hard').classList.toggle('active', level === 'hard');

        this.resetGame();
    }

    choosePlayer(player) {
        this.humanPlayer = player;
        this.aiPlayer = player === 'X' ? 'O' : 'X';
        this.currentPlayer = 'X';

        document.getElementById('choose-x').classList.toggle('active', player === 'X');
        document.getElementById('choose-o').classList.toggle('active', player === 'O');

        this.resetGameBoard();

        if (this.humanPlayer === 'O') {
            setTimeout(() => this.aiMove(), 500);
        }
    }

    handleCellClick(index) {
        if (!this.gameActive || this.board[index] !== '' || this.currentPlayer !== this.humanPlayer) {
            return;
        }

        this.makeMove(index, this.humanPlayer);

        if (this.gameActive && !this.isBoardFull()) {
            setTimeout(() => this.aiMove(), 500);
        }
    }

    makeMove(index, player) {
        this.board[index] = player;
        document.getElementById(`cell-${index}`).textContent = player;

        if (this.checkWin(player)) {
            this.endGame(player);
        } else if (this.isBoardFull()) {
            this.endGame('tie');
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateTurnIndicator();
        }
    }

    aiMove() {
        if (!this.gameActive) return;

        const bestMove = this.getBestMove();
        this.makeMove(bestMove, this.aiPlayer);
    }

    getBestMove() {
        const availableMoves = this.board.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);

        if (this.difficulty === 'easy') {
            return this.getEasyMove(availableMoves);
        } else if (this.difficulty === 'normal') {
            return this.getNormalMove(availableMoves);
        } else {
            return this.getHardMove(availableMoves);
        }
    }

    getEasyMove(availableMoves) {
        if (Math.random() < 0.2) {
            return this.getSmartMove(availableMoves);
        }
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    getNormalMove(availableMoves) {
        if (Math.random() < 0.7) {
            return this.getSmartMove(availableMoves);
        }
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    getHardMove(availableMoves) {
        return this.minimaxMove();
    }

    getSmartMove(availableMoves) {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = this.aiPlayer;
                if (this.checkWin(this.aiPlayer)) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = this.humanPlayer;
                if (this.checkWin(this.humanPlayer)) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }

        if (this.board[4] === '') return 4;

        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        const edges = [1, 3, 5, 7];
        const availableEdges = edges.filter(i => this.board[i] === '');
        if (availableEdges.length > 0) {
            return availableEdges[Math.floor(Math.random() * availableEdges.length)];
        }

        return 0;
    }

    minimaxMove() {
        let bestScore = -Infinity;
        let bestMove = 0;

        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = this.aiPlayer;
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    minimax(board, depth, isMaximizing) {
        if (this.checkWin(this.aiPlayer)) return 10 - depth;
        if (this.checkWin(this.humanPlayer)) return depth - 10;
        if (this.isBoardFull()) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.aiPlayer;
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = this.humanPlayer;
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    checkWin(player) {
        return this.winningCombinations.some(combination => {
            return combination.every(index => this.board[index] === player);
        });
    }

    isBoardFull() {
        return this.board.every(cell => cell !== '');
    }

    endGame(winner) {
        this.gameActive = false;

        if (winner === 'tie') {
            document.getElementById('turn-indicator').textContent = "It's a tie!";
        } else {
            document.getElementById('turn-indicator').textContent = `${winner} wins!`;
            this.scores[winner]++;
            this.updateScoreboard();
            this.highlightWinningCells(winner);
            this.createConfetti();
        }
    }

    highlightWinningCells(winner) {
        const winningCombo = this.winningCombinations.find(combination => {
            return combination.every(index => this.board[index] === winner);
        });

        if (winningCombo) {
            winningCombo.forEach(index => {
                document.getElementById(`cell-${index}`).classList.add('winning');
            });

            this.drawWinningLine(winningCombo);
        }
    }

    // Refactored function to reduce cognitive complexity
    drawWinningLine(combo) {
        const line = document.createElement('div');
        line.className = 'winning-line';
        const gameBoard = document.getElementById('game-board');

        const lineThickness = 8;
        const boardOffset = 2;

        this.setLineStyles(line, combo, lineThickness, boardOffset);
        gameBoard.appendChild(line);
    }

    // Extracted method to reduce complexity
    setLineStyles(line, combo, lineThickness, boardOffset) {
        if (this.isRowWin(combo)) {
            this.setHorizontalLineStyles(line, combo, lineThickness, boardOffset);
        } else if (this.isColumnWin(combo)) {
            this.setVerticalLineStyles(line, combo, lineThickness, boardOffset);
        } else if (this.isDiagonalWin(combo)) {
            this.setDiagonalLineStyles(line, combo, lineThickness, boardOffset);
        }
    }

    isRowWin(combo) {
        return (combo[0] === 0 && combo[1] === 1 && combo[2] === 2) ||
            (combo[0] === 3 && combo[1] === 4 && combo[2] === 5) ||
            (combo[0] === 6 && combo[1] === 7 && combo[2] === 8);
    }

    isColumnWin(combo) {
        return (combo[0] === 0 && combo[1] === 3 && combo[2] === 6) ||
            (combo[0] === 1 && combo[1] === 4 && combo[2] === 7) ||
            (combo[0] === 2 && combo[1] === 5 && combo[2] === 8);
    }

    isDiagonalWin(combo) {
        return (combo[0] === 0 && combo[1] === 4 && combo[2] === 8) ||
            (combo[0] === 2 && combo[1] === 4 && combo[2] === 6);
    }

    setHorizontalLineStyles(line, combo, lineThickness, boardOffset) {
        const rowPositions = { 0: 97, 3: 297, 6: 497 };
        line.style.width = '596px';
        line.style.height = lineThickness + 'px';
        line.style.left = boardOffset + 'px';
        line.style.top = (rowPositions[combo[0]] + boardOffset) + 'px';
    }

    setVerticalLineStyles(line, combo, lineThickness, boardOffset) {
        const columnPositions = { 0: 97, 1: 297, 2: 497 };
        line.style.width = lineThickness + 'px';
        line.style.height = '596px';
        line.style.left = (columnPositions[combo[0]] + boardOffset) + 'px';
        line.style.top = boardOffset + 'px';
    }

    setDiagonalLineStyles(line, combo, lineThickness, boardOffset) {
        line.style.width = lineThickness + 'px';
        line.style.height = '842px';
        line.style.left = '298px';
        line.style.top = '-121px';
        line.style.transformOrigin = 'center';

        if (combo[0] === 0 && combo[1] === 4 && combo[2] === 8) {
            line.style.transform = 'rotate(45deg)';
        } else if (combo[0] === 2 && combo[1] === 4 && combo[2] === 6) {
            line.style.transform = 'rotate(-45deg)';
        }
    }

    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#f7dc6f'];
        const confettiCount = 80;

        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 2 + 's';
                confetti.style.animationDuration = (3 + Math.random() * 2) + 's';

                const size = 6 + Math.random() * 4;
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';

                document.body.appendChild(confetti);

                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, 6000);
            }, i * 60);
        }
    }

    updateTurnIndicator() {
        const indicator = document.getElementById('turn-indicator');
        if (this.currentPlayer === this.humanPlayer) {
            indicator.textContent = `Your turn (${this.humanPlayer})`;
        } else {
            indicator.textContent = `AI's turn (${this.aiPlayer})`;
        }
    }

    updateScoreboard() {
        document.getElementById('score-x').textContent = this.scores.X;
        document.getElementById('score-o').textContent = this.scores.O;
    }

    resetGameBoard() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;

        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winning');
        });

        document.querySelectorAll('.winning-line').forEach(line => {
            line.remove();
        });

        this.updateTurnIndicator();
    }

    resetGame() {
        this.resetGameBoard();

        if (this.humanPlayer === 'O') {
            setTimeout(() => this.aiMove(), 500);
        }
    }
}

// Removed unused 'game' variable declaration and useless assignment
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
