import React from 'react';
import { DrawCardButton } from './DrawCardButton.js';
import { DisplayedCard } from './DisplayedCard.js';
import { DeleteActorButton } from './DeleteActorButton.js';

import { 
  GameState, 
  getAvailableCards, 
  selectCardByRef, 
  selectCardsByCategory, 
  selectRandomAvailableCard, 
  selectRandomCard 
} from '../../gamestate.js';

import type { CardWithRef } from '../../parse/parse-template.js';
import { AddActorButton } from './AddActorButton.js';

export interface PlayViewProps {
  gameState: GameState,
}

export const PlayView: React.FC<PlayViewProps> = ({ gameState }: PlayViewProps) => {
  const heading: string = "Truth or Dare";

  let cardsByCategory: { [x: string]: any; } = {};

  if (gameState.template) {
    cardsByCategory = selectCardsByCategory(gameState);
  }

  // New ActorList component
  const ActorList: React.FC<{ actors: any[] }> = ({ actors }) => {
    return (
      <div>
        {actors.map((actor) => (
          <p key={actor.id}>
            ID: {actor.id} — Name: {actor.name} — <DeleteActorButton id={actor.id} />
          </p>
        ))}
      </div>
    );
  };

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

        <AddActorButton />

        {/* Render ActorList component */}
        <ActorList actors={gameState.actors} />

      </>)}
    </div>
  );
};