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

export default function Home() {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);

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
      setWinningCombo(null);
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
      const combo = winningCombinations.find(c =>
        c.every(index => game.board[index] === game.winner)
      );
      if (combo) {
        setWinningCells(combo);
        setWinningCombo(combo);
        createConfetti();
      }
    }
  }, [game, winningCombinations]);

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
    <div className="game-container">
      <div className="header">
        <div className="player-selection">
          <h3>Choose Your Symbol</h3>
          <div className="player-buttons">
            <button
              className={`player-btn ${game?.human_player === 'X' ? 'active' : ''}`}
              onClick={() => choosePlayer('X')}
            >
              X
            </button>
            <button
              className={`player-btn ${game?.human_player === 'O' ? 'active' : ''}`}
              onClick={() => choosePlayer('O')}
            >
              O
            </button>
          </div>
        </div>

        <div className="difficulty-selection">
          <h3>Choose Difficulty</h3>
          <div className="difficulty-buttons">
            <button
              className={`difficulty-btn ${game?.difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => changeDifficulty('easy')}
            >
              Easy
            </button>
            <button
              className={`difficulty-btn ${game?.difficulty === 'normal' ? 'active' : ''}`}
              onClick={() => changeDifficulty('normal')}
            >
              Normal
            </button>
            <button
              className={`difficulty-btn ${game?.difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => changeDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>

        <div className="game-info">
          <div className="turn-indicator">{getTurnIndicator()}</div>
          <div className="score-board">
            <div className="score-item">
              <div className="score-label">X</div>
              <div className="score-value">{game?.score_x}</div>
            </div>
            <div className="score-item">
              <div className="score-label">O</div>
              <div className="score-value">{game?.score_o}</div>
            </div>
          </div>
          <button className="reset-btn" onClick={resetGame}>
            Reset Game
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {game && (
        <GameBoard board={game.board} onCellClick={handleCellClick} winningCells={winningCells} winningCombo={winningCombo} />
      )}
    </div>
  );
}
