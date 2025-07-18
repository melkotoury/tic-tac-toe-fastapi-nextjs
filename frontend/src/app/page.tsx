'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Game {
  id: number | null;
  board: string[];
  human_player: string;
  ai_player: string;
  current_player: string;
  difficulty: string;
  game_active: boolean;
  winner: string | null;
}

export default function Home() {
  const [game, setGame] = useState<Game | null>(null);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  useEffect(() => {
    const createNewGame = async () => {
      const response = await axios.post('http://localhost:8000/games', {
        board: Array(9).fill(''),
        human_player: 'X',
        ai_player: 'O',
        current_player: 'X',
        difficulty: 'normal',
        game_active: true,
        winner: null,
      });
      setGame(response.data);
    };
    createNewGame();
  }, []);

  useEffect(() => {
    if (game && game.current_player === game.ai_player && game.game_active) {
      const aiMove = async () => {
        const response = await axios.post('http://localhost:8000/ai-move', game);
        setGame(response.data);
      };
      aiMove();
    }
  }, [game]);

  const handleCellClick = async (index: number) => {
    if (!game || game.board[index] !== '' || !game.game_active || game.current_player !== game.human_player) {
      return;
    }

    const newBoard = [...game.board];
    newBoard[index] = game.human_player;

    const updatedGame = { ...game, board: newBoard, current_player: game.ai_player };
    setGame(updatedGame);

    const response = await axios.put(`http://localhost:8000/games/${game.id}`, updatedGame);
    setGame(response.data);
  };

  const resetGame = async () => {
    if (!game) return;
    const response = await axios.post('http://localhost:8000/games', {
      board: Array(9).fill(''),
      human_player: game.human_player,
      ai_player: game.ai_player,
      current_player: 'X',
      difficulty: game.difficulty,
      game_active: true,
      winner: null,
    });
    setGame(response.data);
  };

  const choosePlayer = (player: string) => {
    if (!game) return;
    const newGame = {
      ...game,
      human_player: player,
      ai_player: player === 'X' ? 'O' : 'X',
    };
    setGame(newGame);
    resetGame();
  };

  const changeDifficulty = (difficulty: string) => {
    if (!game) return;
    const newGame = { ...game, difficulty };
    setGame(newGame);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Tic Tac Toe</h1>
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
      <div className="grid grid-cols-3 gap-4 mt-8">
        {game?.board.map((cell, index) => (
          <div
            key={index}
            className="w-24 h-24 bg-gray-200 flex items-center justify-center text-4xl font-bold cursor-pointer"
            onClick={() => handleCellClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      <div className="flex gap-8 mt-8">
        <div>
          <h2 className="text-2xl font-bold">Score</h2>
          <div className="flex gap-4 mt-4">
            <div>
              <p className="text-xl font-bold">X</p>
              <p className="text-xl">{scores.X}</p>
            </div>
            <div>
              <p className="text-xl font-bold">O</p>
              <p className="text-xl">{scores.O}</p>
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