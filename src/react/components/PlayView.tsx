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


export const PlayView: React.FC<PlayViewProps> = ({ gameState }: PlayViewProps) => {
  let heading = "Truth or Dare";

  if (gameState.allocation?.length > 0 && gameState.allocation[0]) {
    heading += `, ${selectActorName(gameState, gameState.allocation[0])?.name}`;
  }

  heading += '?'

  let cardsByCategory: { [x: string]: CardWithRef[]; } = {};

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

  const NoTemplateLoaded: React.FC = () => {
    return (
      <div>
        <h2>Players</h2>
        {'Load a template first, then you can add players.'}
      </div>
    );
  };

  const card = selectCardByRef(gameState, gameState.displayedCard);

  return (
    <>
      <div className="row-start-1 col-start-3 col-end-4 row-end-2 text-center align-middle">
        <h1 className="text-3xl font-bold size-full">
          {heading}
        </h1>
      </div>

      <div className='row-start-2 col-start-3 row-end-3 col-end-4 text-center'>
        { 
          gameState.displayedCard // TODO css transition to the right
          ? <DisplayedCard card={card} />
          : (
            getAvailableCards(gameState).length > 0
            ? <ChooseCategoryButtons />
            : <OutOfCards />
          )
        }

      </div>

      <div className="row-start-3 col-start-3 row-end-4 col-end-4 text-center">
        {
          gameState.displayedCard // TODO css transition to the bottom
          ? <CompleteCardButton cardRef={gameState.displayedCard} /> 
          : 'Please draw a card.'
        }
      </div>

      <div className="row-start-2 col-start-2 row-end-4 col-end-3">
        {
          gameState.template !== undefined
            ? <ActorList actors={gameState.actors} />
            : <NoTemplateLoaded />
        }
      </div>
    </>
  );
};
