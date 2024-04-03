import React from 'react';

import { JsonStringifyOutput } from './JsonStringifyOutput.js';
import { EventsDisplay } from './EventsDisplay.js';
import { RemainingCards } from './RemainingCards.js';
import { PreviousCards } from './PreviousCards.js';

import { 
  GameState, 
  getAvailableCards, 
  selectCardsByCategory, 
} from '../../gamestate.js';

import type { CardWithRef } from '../../parse/parse-template.js';

export interface InspectorViewProps {
  gameState: GameState,
}

export const InspectorView: React.FC<InspectorViewProps> = ({ gameState }: InspectorViewProps) => {
  const heading: string = "Truth or Dare";

  let cardsByCategory: { [x: string]: any; } = {};

  if (gameState.template) {
    cardsByCategory = selectCardsByCategory(gameState);
  }

  return (
    <div>
      <h1>Inspecting {heading}</h1>

      <h2>Status</h2>

      {gameState.previousCards && (
        <PreviousCards previousCards={gameState.previousCards} />
      )}
      {gameState.template && (<>
        <RemainingCards remainingCards={getAvailableCards(gameState)} />

        {gameState.events && (
          <>
            <h2>Events</h2>
            <EventsDisplay events={gameState.events} />
          </>
        )}
        {gameState.allocation && (
          <>
            <h2>Slots</h2>
            <JsonStringifyOutput javascriptObject={gameState.allocation} />
          </>
        )}
        {gameState.actors && (
          <>
            <h2>Players</h2>
            <JsonStringifyOutput javascriptObject={gameState.actors} />
          </>
        )}
        {gameState.template.stacks && (
          <>
            <h2>Template</h2>
            <JsonStringifyOutput javascriptObject={gameState.template.stacks} />
          </>
        )}

      </>)}
    </div>
  );
};
