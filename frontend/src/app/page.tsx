'use client'

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import GameBoard from '@/components/GameBoard';

interface Game {
  id: number | null;
  board: string[];
  human_player: string;
  ai_player: string;
  current_player: string;
  difficulty: string;
  game_active: boolean;
  winner: string | null;
  score_x: number;
  score_o: number;
}

interface WinningLineStyle {
  width: string;
  height: string;
  left: string;
  top: string;
  transform?: string;
  transformOrigin?: string;
}

export default function Home() {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [winningLineStyle, setWinningLineStyle] = useState<WinningLineStyle | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const createConfetti = () => {
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
  };

  const drawWinningLine = useCallback((combo: number[]) => {
    const lineThickness = 8;
    const boardOffset = 2; // Corresponds to the border of the game board

    const isRowWin = (c: number[]) => (c[0] === 0 && c[1] === 1 && c[2] === 2) || (c[0] === 3 && c[1] === 4 && c[2] === 5) || (c[0] === 6 && c[1] === 7 && c[2] === 8);
    const isColumnWin = (c: number[]) => (c[0] === 0 && c[1] === 3 && c[2] === 6) || (c[0] === 1 && c[1] === 4 && c[2] === 7) || (c[0] === 2 && c[1] === 5 && c[2] === 8);
    const isDiagonalWin = (c: number[]) => (c[0] === 0 && c[1] === 4 && c[2] === 8) || (c[0] === 2 && c[1] === 4 && c[2] === 6);

    let style: WinningLineStyle = {
      width: '',
      height: '',
      left: '',
      top: '',
    };

    if (isRowWin(combo)) {
      const rowPositions: { [key: number]: number } = { 0: 97, 3: 297, 6: 497 };
      style = {
        width: '596px',
        height: `${lineThickness}px`,
        left: `${boardOffset}px`,
        top: `${rowPositions[combo[0]] + boardOffset}px`,
      };
    } else if (isColumnWin(combo)) {
      const columnPositions: { [key: number]: number } = { 0: 97, 1: 297, 2: 497 };
      style = {
        width: `${lineThickness}px`,
        height: '596px',
        left: `${columnPositions[combo[0]] + boardOffset}px`,
        top: `${boardOffset}px`,
      };
    } else if (isDiagonalWin(combo)) {
      style = {
        width: `${lineThickness}px`,
        height: '842px',
        left: '298px',
        top: '-121px',
        transformOrigin: 'center',
      };
      if (combo[0] === 0 && combo[1] === 4 && combo[2] === 8) {
        style.transform = 'rotate(45deg)';
      } else if (combo[0] === 2 && combo[1] === 4 && combo[2] === 6) {
        style.transform = 'rotate(-45deg)';
      }
    }
    setWinningLineStyle(style);
  }, []);

  const createNewGame = useCallback(async (initialGame?: Partial<Game>) => {
    try {
      const defaultGame = {
        board: Array(9).fill(''),
        human_player: 'X',
        ai_player: 'O',
        current_player: 'X',
        difficulty: 'normal',
        game_active: true,
        winner: null,
        score_x: initialGame?.score_x || 0,
        score_o: initialGame?.score_o || 0,
        ...initialGame,
      };
      const response = await axios.post(`${API_URL}/games`, defaultGame);
      setGame(response.data);
      setError(null);
      setWinningCells([]);
      setWinningLineStyle(null);
    } catch (err) {
      setError('Failed to create a new game.');
      console.error(err);
    }
  }, [API_URL]);

  useEffect(() => {
    if (!game) {
      createNewGame();
    }
  }, [game, createNewGame]);

  useEffect(() => {
    if (game && game.winner && game.winner !== "tie") {
      const winningCombo = winningCombinations.find(combo =>
        combo.every(index => game.board[index] === game.winner)
      );
      if (winningCombo) {
        setWinningCells(winningCombo);
        drawWinningLine(winningCombo);
        createConfetti();
      }
    }
  }, [game, winningCombinations, drawWinningLine]);

  useEffect(() => {
    if (game && game.current_player === game.ai_player && game.game_active) {
      const aiMove = async () => {
        try {
          const response = await axios.post(`${API_URL}/ai-move`, game);
          setGame(response.data);
          setError(null);
        } catch (err) {
          setError('AI failed to make a move.');
          console.error(err);
        }
      };
      const timer = setTimeout(() => aiMove(), 500);
      return () => clearTimeout(timer);
    }
  }, [game, API_URL]);

  const handleCellClick = async (index: number) => {
    if (!game || game.board[index] !== '' || !game.game_active || game.current_player !== game.human_player) {
      return;
    }

    const newBoard = [...game.board];
    newBoard[index] = game.human_player;

    const updatedGame = { ...game, board: newBoard, current_player: game.ai_player };
    setGame(updatedGame);

    try {
      const response = await axios.put(`${API_URL}/games/${game.id}`, updatedGame);
      setGame(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to make your move.');
      console.error(err);
    }
  };

  const resetGame = () => {
    if (!game) return;
    createNewGame({ score_x: game.score_x, score_o: game.score_o });
  };

  const choosePlayer = (player: string) => {
    if (!game) return;
    createNewGame({
      human_player: player,
      ai_player: player === 'X' ? 'O' : 'X',
      score_x: game.score_x,
      score_o: game.score_o,
    });
  };

  const changeDifficulty = (difficulty: string) => {
    if (!game) return;
    createNewGame({
      difficulty,
      human_player: game.human_player,
      ai_player: game.ai_player,
      score_x: game.score_x,
      score_o: game.score_o,
    });
  };

  const getTurnIndicator = () => {
    if (!game) return "Loading...";
    if (!game.game_active) {
      if (game.winner === "tie") return "It's a tie!";
      return `${game.winner} wins!`;
    }
    if (game.current_player === game.human_player) {
      return `Your turn (${game.human_player})`;
    }
    return `AI's turn (${game.ai_player})`;
  };

  return (
    <div className="game-container w-full max-w-3xl mx-auto text-center relative">
      <div className="header mb-10 p-5 bg-white rounded-lg shadow-md">
        <div className="player-selection mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Choose Your Symbol</h3>
          <div className="player-buttons flex justify-center gap-4 mb-4">
            <button
              className={`player-btn px-5 py-3 border-2 border-gray-800 bg-white cursor-pointer text-lg font-bold rounded-md transition-all duration-300 min-w-[60px] ${game?.human_player === 'X' ? 'active bg-gray-800 text-white' : ''}`}
              onClick={() => choosePlayer('X')}
            >
              X
            </button>
            <button
              className={`player-btn px-5 py-3 border-2 border-gray-800 bg-white cursor-pointer text-lg font-bold rounded-md transition-all duration-300 min-w-[60px] ${game?.human_player === 'O' ? 'active bg-gray-800 text-white' : ''}`}
              onClick={() => choosePlayer('O')}
            >
              O
            </button>
          </div>
        </div>

        <div className="difficulty-selection mb-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Choose Difficulty</h3>
          <div className="difficulty-buttons flex justify-center gap-3 mb-4">
            <button
              className={`difficulty-btn px-4 py-2 border-2 border-gray-800 bg-white cursor-pointer text-base font-bold rounded-md transition-all duration-300 min-w-[80px] ${game?.difficulty === 'easy' ? 'active bg-gray-800 text-white' : ''}`}
              onClick={() => changeDifficulty('easy')}
            >
              Easy
            </button>
            <button
              className={`difficulty-btn px-4 py-2 border-2 border-gray-800 bg-white cursor-pointer text-base font-bold rounded-md transition-all duration-300 min-w-[80px] ${game?.difficulty === 'normal' ? 'active bg-gray-800 text-white' : ''}`}
              onClick={() => changeDifficulty('normal')}
            >
              Normal
            </button>
            <button
              className={`difficulty-btn px-4 py-2 border-2 border-gray-800 bg-white cursor-pointer text-base font-bold rounded-md transition-all duration-300 min-w-[80px] ${game?.difficulty === 'hard' ? 'active bg-gray-800 text-white' : ''}`}
              onClick={() => changeDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>

        <div className="game-info mb-5">
          <div className="turn-indicator text-2xl font-bold mb-5 text-gray-800">{getTurnIndicator()}</div>
          <div className="score-board flex justify-center gap-10 mb-5">
            <div className="score-item text-center p-4 border-2 border-gray-800 rounded-md bg-white min-w-[90px]">
              <div className="score-label text-lg font-bold mb-2 text-gray-800">X</div>
              <div className="score-value text-3xl font-bold text-gray-800">{game?.score_x}</div>
            </div>
            <div className="score-item text-center p-4 border-2 border-gray-800 rounded-md bg-white min-w-[90px]">
              <div className="score-label text-lg font-bold mb-2 text-gray-800">O</div>
              <div className="score-value text-3xl font-bold text-gray-800">{game?.score_o}</div>
            </div>
          </div>
          <button className="reset-btn px-5 py-3 border-2 border-gray-800 bg-gray-800 text-white cursor-pointer text-base font-bold rounded-md transition-all duration-300 hover:bg-gray-600" onClick={resetGame}>
            Reset Game
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {game && (
        <div className="relative">
          <GameBoard board={game.board} onCellClick={handleCellClick} winningCells={winningCells} />
          {winningLineStyle && <div className="winning-line" style={winningLineStyle}></div>}
        </div>
      )}
    </div>
  );
}
