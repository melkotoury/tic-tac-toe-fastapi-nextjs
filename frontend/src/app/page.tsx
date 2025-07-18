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

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Tic Tac Toe</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      <div className="flex gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Choose Your Symbol</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md ${game?.human_player === 'X' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => choosePlayer('X')}
            >
              X
            </button>
            <button
              className={`px-4 py-2 rounded-md ${game?.human_player === 'O' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => choosePlayer('O')}
            >
              O
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Choose Difficulty</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md ${game?.difficulty === 'easy' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => changeDifficulty('easy')}
            >
              Easy
            </button>
            <button
              className={`px-4 py-2 rounded-md ${game?.difficulty === 'normal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => changeDifficulty('normal')}
            >
              Normal
            </button>
            <button
              className={`px-4 py-2 rounded-md ${game?.difficulty === 'hard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => changeDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
      <div className="my-4 text-2xl font-bold">{getTurnIndicator()}</div>
      {game && <GameBoard board={game.board} onCellClick={handleCellClick} winningCells={winningCells} />}
      <div className="flex gap-8 mt-8">
        <div>
          <h2 className="text-2xl font-bold">Score</h2>
          <div className="flex gap-4 mt-4">
            <div>
              <p className="text-xl font-bold">X</p>
              <p className="text-xl">{game?.score_x}</p>
            </div>
            <div>
              <p className="text-xl font-bold">O</p>
              <p className="text-xl">{game?.score_o}</p>
            </div>
          </div>
        </div>
        <button className="px-4 py-2 rounded-md bg-blue-500 text-white" onClick={resetGame}>
          Reset Game
        </button>
      </div>
    </main>
  );
}