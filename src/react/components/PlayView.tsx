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
      <div className="grid_heading">
        <h1>{heading}</h1>
      </div>

      <div className='grid_display_or_choose'>
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

      <div className="grid_complete_or_skip">

        {
          gameState.displayedCard // TODO css transition to the bottom
          ? <CompleteCardButton cardRef={gameState.displayedCard} /> 
          : 'Please draw a card.'
        }
      </div>

      <div className="grid_players">
        {
          gameState.template !== undefined
            ? <ActorList actors={gameState.actors} />
            : <NoTemplateLoaded />
        }
      </div>
    </>
  );
};
