import React, { useState, useEffect } from 'react';

const BattleComponent = ({ playerChar, onBattleEnd }: any) => {
  const generateOpponent = (playerLevel: any) => ({
    name: "Enemy Immortal",
    level: playerLevel,
    health: 100 + (playerLevel * 10),
    energy: 100,
    power: 10 + (playerLevel * 2),
    suspicion: Math.floor(Math.random() * 100),
    attackSpeed: 5 + Math.floor(Math.random() * 5),
    attackPower: 5 + Math.floor(Math.random() * 5),
    defenseSpeed: 5 + Math.floor(Math.random() * 5),
    defensePower: 5 + Math.floor(Math.random() * 5),
  });

  const [player, setPlayer] = useState(JSON.parse(JSON.stringify(playerChar)));
  const [opponent, setOpponent] = useState(generateOpponent(player.level));
  const [currentTurn, setCurrentTurn] = useState('player');
  const [battleLog, setBattleLog] = useState<any[]>([]);

  useEffect(() => {
    if (currentTurn === 'opponent') {
      setTimeout(() => performOpponentAction(), 1000);
    }
  }, [currentTurn]);

  useEffect(() => {
    if (player.health <= 0 || opponent.health <= 0) {
      const winner = player.health > 0 ? 'player' : 'opponent';
      onBattleEnd(winner);
    }
  }, [player.health, opponent.health]);

  const actions = [
    { name: 'Slash', type: 'attack', energyCost: 20, power: 1.2 },
    { name: 'Thrust', type: 'attack', energyCost: 15, power: 1 },
    { name: 'Parry', type: 'defense', energyCost: 10, power: 1.2 },
    { name: 'Dodge', type: 'defense', energyCost: 15, power: 1 },
    { name: 'Kick', type: 'attack', energyCost: 25, power: 1.5 },
    { name: 'Delay', type: 'recover', energyCost: -30, power: 0 },
  ];

  const calculateHitChance = (attacker: any, defender: any) => {
    const baseHitChance = 70;
    const speedDifference = attacker.attackSpeed - defender.defenseSpeed;
    return Math.min(95, Math.max(40, baseHitChance + speedDifference * 2));
  };

  const calculateDamage = (attacker: any, defender: any, actionPower: any) => {
    const baseDamage = attacker.power * actionPower;
    const defenseFactor = Math.max(0, 1 - (defender.defensePower / 50));
    const damage = baseDamage * defenseFactor;
    const randomFactor = 0.8 + Math.random() * 0.4;
    return Math.floor(damage * randomFactor);
  };

  const addBattleLog = (message: any) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setBattleLog(prevLog => [{timestamp, message}, ...prevLog]);
  };

  const performAction = (action: any) => {
    if (player.energy < action.energyCost) {
      addBattleLog("Not enough energy for this action!");
      return;
    }

    let damage = 0;
    let logMessage = '';

    if (action.type === 'attack') {
      const hitChance = calculateHitChance(player, opponent);
      if (Math.random() * 100 < hitChance) {
        damage = calculateDamage(player, opponent, action.power);
        setOpponent({ ...opponent, health: Math.max(0, opponent.health - damage) });
        logMessage = `You ${action.name} the opponent for ${damage} damage!`;
      } else {
        logMessage = `Your ${action.name} missed!`;
      }
    } else if (action.type === 'defense') {
      logMessage = `You prepare to ${action.name}!`;
    } else if (action.type === 'recover') {
      logMessage = `You delay and recover some energy.`;
    }

    addBattleLog(logMessage);
    setPlayer({ ...player, energy: player.energy - action.energyCost });
    setCurrentTurn('opponent');
  };

  const performOpponentAction = () => {
    const availableActions = actions.filter(a => opponent.energy >= a.energyCost);
    const action = availableActions[Math.floor(Math.random() * availableActions.length)];
    
    let damage = 0;
    let logMessage = '';

    if (action.type === 'attack') {
      const hitChance = calculateHitChance(opponent, player);
      if (Math.random() * 100 < hitChance) {
        damage = calculateDamage(opponent, player, action.power);
        setPlayer({ ...player, health: Math.max(0, player.health - damage) });
        logMessage = `Opponent ${action.name}s you for ${damage} damage!`;
      } else {
        logMessage = `Opponent's ${action.name} missed!`;
      }
    } else if (action.type === 'defense') {
      logMessage = `Opponent prepares to ${action.name}!`;
    } else if (action.type === 'recover') {
      logMessage = `Opponent delays and recovers some energy.`;
    }

    addBattleLog(logMessage);
    setOpponent({ ...opponent, energy: opponent.energy - action.energyCost });
    setCurrentTurn('player');
  };

  const handleRetreat = () => {
    const retreatChance = 50 + (player.level - opponent.level) * 5; // Base 50% chance, adjusted by level difference
    if (Math.random() * 100 < retreatChance) {
      addBattleLog("You successfully retreated from the battle!");
      onBattleEnd('retreat');
    } else {
      addBattleLog("Retreat failed! The opponent blocks your escape.");
      setCurrentTurn('opponent');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Battle!</h2>
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-bold">{player.name}</h3>
          <p>Level: {player.level}</p>
          <p>Health: {player.health}</p>
          <p>Energy: {player.energy}</p>
          <p>Power: {player.power}</p>
          <p>Suspicion: {player.suspicion}%</p>
        </div>
        <div>
          <h3 className="font-bold">{opponent.name}</h3>
          <p>Level: {opponent.level}</p>
          <p>Health: {opponent.health}</p>
          <p>Energy: {opponent.energy}</p>
          <p>Power: {opponent.power}</p>
          <p>Suspicion: {opponent.suspicion}%</p>
        </div>
      </div>
      <div className="mb-4">
        {currentTurn === 'player' && (
          <div>
            <p className="mb-2">Choose your action:</p>
            <div className="flex flex-wrap gap-2">
              {actions.map((action) => (
                <button
                  key={action.name}
                  onClick={() => performAction(action)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={player.energy < action.energyCost}
                >
                  {action.name} ({action.energyCost} energy)
                </button>
              ))}
              <button
                onClick={handleRetreat}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Retreat
              </button>
            </div>
          </div>
        )}
        {currentTurn === 'opponent' && <p>Opponent is taking their turn...</p>}
      </div>
      <div className="mt-4">
        <h4 className="font-bold mb-2">Battle Log:</h4>
        <div className="h-48 overflow-y-auto border p-2 rounded">
          {battleLog.map((log, index) => (
            <p key={index} className="mb-1">
              <span className="text-sm text-gray-500 mr-2">[{log.timestamp}]</span>
              {log.message}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BattleComponent;
