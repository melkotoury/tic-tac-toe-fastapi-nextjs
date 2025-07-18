'use client'

import { useState } from 'react';

export default function Home() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [player, setPlayer] = useState('X');
  const [difficulty, setDifficulty] = useState('normal');
  const [scores, setScores] = useState({ X: 0, O: 0 });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Tic Tac Toe</h1>
      <div className="flex gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Choose Your Symbol</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md ${player === 'X' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setPlayer('X')}
            >
              X
            </button>
            <button
              className={`px-4 py-2 rounded-md ${player === 'O' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setPlayer('O')}
            >
              O
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Choose Difficulty</h2>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded-md ${difficulty === 'easy' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setDifficulty('easy')}
            >
              Easy
            </button>
            <button
              className={`px-4 py-2 rounded-md ${difficulty === 'normal' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setDifficulty('normal')}
            >
              Normal
            </button>
            <button
              className={`px-4 py-2 rounded-md ${difficulty === 'hard' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setDifficulty('hard')}
            >
              Hard
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {board.map((cell, index) => (
          <div
            key={index}
            className="w-24 h-24 bg-gray-200 flex items-center justify-center text-4xl font-bold cursor-pointer"
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
        <button className="px-4 py-2 rounded-md bg-blue-500 text-white">Reset Game</button>
      </div>
    </main>
  );
}