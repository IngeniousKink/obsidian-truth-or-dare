import React from 'react';
import { GameState } from '../gamestate.js';
import { useGameState } from './hooks.js';

interface ReactBaseViewProps {
  GameView: React.ComponentType<{ gameState: GameState }>;
}

export const ReactBaseView: React.FC<ReactBaseViewProps> = ({ GameView }) => {
  const gameState = useGameState();

  return <GameView gameState={gameState} />;
};
