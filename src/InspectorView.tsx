import React from 'react';


import { DrawCardButton } from './DrawCardButton.js';
import { StacksDisplay } from './StacksDisplay.js';
import { EventsDisplay } from './EventsDisplay.js';
import { DisplayedCard } from './DisplayedCard.js';
import { RemainingCards } from './RemainingCards.js';
import { PreviousCards } from './PreviousCards.js';

import { 
  GameState, 
  getAvailableCards, 
  selectCardByRef, 
  selectCardsByCategory, 
  selectRandomAvailableCard, 
  selectRandomCard 
} from './gamestate.js';

import type { Card } from './parse-template.js';

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

        {Object.keys(cardsByCategory).map(key => {
          const value: Card[] = cardsByCategory[key];
          const nextCard = selectRandomCard(value, gameState);
          return (
            <DrawCardButton
              key={key}
              categoryLabel={key}
              remainingCount={value.length}
              nextCard={nextCard} />
          );
        })}

        {gameState.events && (
          <>
            <h2>Events</h2>
            <EventsDisplay events={gameState.events} />
          </>
        )}
        {gameState.template.stacks && (
          <>
            <h2>Template</h2>
            <StacksDisplay stacks={gameState.template.stacks} />
          </>
        )}

      </>)}
    </div>
  );
};
