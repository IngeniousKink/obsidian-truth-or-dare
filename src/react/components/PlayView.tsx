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
import { ActorList } from './ActorList.js';
import { CompleteCardButton } from './CompleteCardButton.js';

export interface GameStateWithDisplayedCard extends GameState {
  displayedCard: string;
}

interface PlayViewProps {
  gameState: GameStateWithDisplayedCard;
}

const PerformCard: React.FC<PlayViewProps> = ({ gameState }: PlayViewProps) => {
  const card = selectCardByRef(gameState, gameState.displayedCard);

  return (
    <>
      <DisplayedCard card={card} />
      <CompleteCardButton cardRef={gameState.displayedCard} />
    </>
  );
};


export const PlayView: React.FC<PlayViewProps> = ({ gameState }: PlayViewProps) => {
  let heading: string = "Truth or Dare";

  if (gameState.allocation?.length > 0 && gameState.allocation[0]) {
    heading += `, ${selectActorName(gameState, gameState.allocation[0])?.name}`;
  }

  heading += '?'

  let cardsByCategory: { [x: string]: any; } = {};

  if (gameState.template) {
    cardsByCategory = selectCardsByCategory(gameState);
  }

  const ChooseCategoryButtons = () => (
    <>
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
    </>
  );

  const OutOfCards: React.FC = () => {
    return (
      <div>
        {'All suitable cards in this game have been played. Want to play another game ?'}
      </div>
    );
  };


  return (
    <div className="obsidian-truth-or-dare-container">
      <h1>{heading}</h1>


      {gameState.displayedCard
        ? <PerformCard gameState={gameState} />
        : (
          <div>
            {getAvailableCards(gameState).length > 0
              ? <ChooseCategoryButtons />
              : <OutOfCards />
            }
          </div>
        )
      }

      <br />
      <br />

      {gameState.template && <ActorList actors={gameState.actors} />}
    </div>
  );
};
