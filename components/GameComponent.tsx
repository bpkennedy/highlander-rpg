"use client";
import React, { useState } from 'react';
import BattleComponent from '@/components/BattleComponent';

const classOptions = ['Warrior', 'Rogue', 'Scholar'];

const GameComponent = () => {
  const [character, setCharacter] = useState({
    name: '',
    class: '',
    level: 1,
    health: 100,
    maxHealth: 100,
    energy: 100,
    power: 10,
    suspicion: 0,
    buzz: 0,
    attackSpeed: 5,
    attackPower: 5,
    defenseSpeed: 5,
    defensePower: 5,
  });

  const [gameState, setGameState] = useState('creation');
  const [isQuesting, setIsQuesting] = useState(false);
  const [questResult, setQuestResult] = useState('');

  const handleNameChange = (e: any) => {
    setCharacter({ ...character, name: e.target.value });
  };

  const handleClassChange = (e: any) => {
    setCharacter({ ...character, class: e.target.value });
  };

  const startGame = () => {
    if (character.name && character.class) {
      setGameState('playing');
    } else {
      alert('Please enter a name and choose a class');
    }
  };

  const performQuest = () => {
    setIsQuesting(true);
    setQuestResult('');

    setTimeout(() => {
      const suspicionChange = Math.floor(Math.random() * 21) - 10; // -10 to 10
      const buzzChange = Math.floor(Math.random() * 11); // 0 to 10
      
      const newCharacter = {
        ...character,
        suspicion: Math.max(0, Math.min(100, character.suspicion + suspicionChange)),
        buzz: Math.max(0, Math.min(100, character.buzz + buzzChange)),
      };

      setCharacter(newCharacter);
      setIsQuesting(false);

      if (newCharacter.buzz >= 100) {
        setGameState('battle');
      } else {
        setQuestResult(`Quest completed! Suspicion ${suspicionChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(suspicionChange)}. Buzz ${buzzChange >= 0 ? 'increased' : 'decreased'} by ${Math.abs(buzzChange)}.`);
      }
    }, 800); // Simulate quest duration
  };

  const handleBattleEnd = (winner: any) => {
    if (winner === 'player') {
      const levelUp = character.level + 1;
      const newMaxHealth = character.maxHealth + 10;
      setCharacter({
        ...character,
        level: levelUp,
        health: newMaxHealth,
        maxHealth: newMaxHealth,
        power: character.power + 2,
        buzz: 0,
      });
      alert('Congratulations! You won the battle and leveled up!');
    } else if (winner === 'opponent') {
      alert('You lost the battle. Game over!');
      setGameState('creation');
      setCharacter({
        name: '',
        class: '',
        level: 1,
        health: 100,
        maxHealth: 100,
        energy: 100,
        power: 10,
        suspicion: 0,
        buzz: 0,
        attackSpeed: 5,
        attackPower: 5,
        defenseSpeed: 5,
        defensePower: 5,
      });
    } else if (winner === 'retreat') {
      setCharacter({
        ...character,
        buzz: Math.max(0, character.buzz - 50), // Reduce buzz after retreat
      });
      alert('You retreated from the battle.');
    }
    setGameState('playing');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Highlander: The Game</h1>
      
      {gameState === 'creation' && (
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={character.name} 
            onChange={handleNameChange}
            className="w-full p-2 border rounded"
          />
          <select 
            value={character.class} 
            onChange={handleClassChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select your class</option>
            {classOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <button 
            onClick={startGame}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Game
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="space-y-4">
          <h2 className="text-xl">Welcome, {character.name} the {character.class}</h2>
          <p>Level: {character.level}</p>
          <p>Health: {character.health}/{character.maxHealth}</p>
          <p>Power: {character.power}</p>
          <p>Suspicion: {character.suspicion}%</p>
          <p>Buzz: {character.buzz}%</p>
          <button 
            onClick={performQuest}
            disabled={isQuesting}
            className={`w-full p-2 ${isQuesting ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white rounded transition-colors duration-200`}
          >
            {isQuesting ? (
              <span className="flex items-center justify-center">
                Questing...
                <svg className="animate-spin ml-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            ) : 'Perform Quest'}
          </button>
          {questResult && (
            <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded">
              {questResult}
            </div>
          )}
        </div>
      )}

      {gameState === 'battle' && (
        <BattleComponent playerChar={character} onBattleEnd={handleBattleEnd} />
      )}
    </div>
  );
};

export default GameComponent;