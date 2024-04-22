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
import AnimatedContent from './AnimatedContent.js';

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
      <div className='max-w-40'>
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
      <div className="row-start-1 col-start-3 col-end-4 row-end-2">

        <AnimatedContent direction="top" showFirstChild={!gameState.displayedCard}>
          <h1 className="text-3xl font-bold m-auto align-middle">
            {heading}
          </h1>
          <br />
        </AnimatedContent>
      </div>

      <div className='row-start-2 col-start-3 row-end-3 col-end-4 overflow-hidden'>
        <AnimatedContent direction="right" showFirstChild={!!gameState.displayedCard}>
          <DisplayedCard card={card} />
          {
            getAvailableCards(gameState).length > 0
              ? <ChooseCategoryButtons />
              : <OutOfCards />
          }
        </AnimatedContent>
      </div>

      <div className="row-start-3 col-start-3 row-end-4 col-end-4">
        <AnimatedContent direction="bottom" showFirstChild={!!gameState.displayedCard}>
          <CompleteCardButton cardRef={gameState.displayedCard} />
          <p>Please draw a card.</p>
        </AnimatedContent>
      </div>


      <div className="row-start-2 col-start-2 row-end-4 col-end-3 ml-4 flex overflow-hidden">
        <div className="m-auto align-middle">
          {
            gameState.template !== undefined
              ? <ActorList actors={gameState.actors} />
              : <NoTemplateLoaded />
          }
        </div>
      </div>
    </>
  );
};
