import React from 'react';
import { DrawCardButton } from './DrawCardButton.js';
import { DisplayedCard } from './DisplayedCard.js';

import { 
  GameState, 
  getAvailableCards, 
  selectActorName, 
  selectCardByRef, 
  selectCardsByCategory, 
  selectRandomAvailableCard, 
  selectRandomCard 
} from '../../gamestate.js';

import type { CardWithRef } from '../../parse/parse-template.js';
import { AddActorButton } from './AddActorButton.js';
import { ActorList } from './ActorList.js';

export interface PlayViewProps {
  gameState: GameState,
}

export const PlayView: React.FC<PlayViewProps> = ({ gameState }: PlayViewProps) => {
  let heading: string = "Truth or Dare";
  
  if(gameState.allocation?.length > 0 && gameState.allocation[0]) {
    heading += `, ${selectActorName(gameState, gameState.allocation[0])?.name}`;
  }

  heading += '?'

  let cardsByCategory: { [x: string]: any; } = {};

  if (gameState.template) {
    cardsByCategory = selectCardsByCategory(gameState);
  }

  return (
    <div>
      <h1>{heading}</h1>

      <DisplayedCard card={selectCardByRef(gameState, gameState.displayedCard)} />

      {gameState.template && (<>

        <h2>Buttons</h2>

        <DrawCardButton
          categoryLabel='random'
          remainingCount={getAvailableCards(gameState).length}
          nextCard={selectRandomAvailableCard(gameState)} />

        {Object.keys(cardsByCategory).map(key => {
          const value: CardWithRef[] = cardsByCategory[key];
          const nextCard = selectRandomCard(value, gameState);
          return (
            <DrawCardButton
              key={key}
              categoryLabel={key}
              remainingCount={value.length}
              nextCard={nextCard} />
          );
        })}

        <br />
        <br />

        <ActorList actors={gameState.actors} />

      </>)}
    </div>
  );
};