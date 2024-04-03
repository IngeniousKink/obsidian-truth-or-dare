import React, { useEffect, useState, useCallback } from 'react';
import { useApp, useRegisterEvent } from "./hooks.js";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { convertMarkdownToGameTemplate } from './parse-template.js';
import type { Card, GameTemplate } from './parse-template.js';
import { DrawCardButton } from './DrawCardButton.jsx';
import { StacksDisplay } from './StacksDisplay.jsx';
import { GameEvent, convertMarkdownToGameEvents } from './parse-events.js';
import { EventsDisplay } from './EventsDisplay.jsx';
import { GameState, createGameState, getAvailableCards, selectCardsByCategory, selectRandomAvailableCard, selectRandomCard } from './gamestate.jsx';


export const PreviousCards: React.FC<{ previousCards: string[]; }> = ({ previousCards }) => (
  <p>So far, {previousCards.length} cards have been played.</p>
);

export const RemainingCards: React.FC<{ remainingCards: Card[]; }> = ({ remainingCards }) => (
  <p>There are {remainingCards.length} cards remaining.</p>
);

export const DisplayedCard: React.FC<{ displayedCard: string | undefined; }> = ({ displayedCard }) => (
  displayedCard
    ? <p>The currently displayed card is {displayedCard}.</p>
    : <p>There is no card to display (yet).</p>
);

export const ReactBaseView: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({} as GameState);
  const app = useApp();
  const registerEvent = useRegisterEvent();

  if (!app || !registerEvent) return null;

  const { vault, metadataCache, workspace } = app;

  const heading: string = vault.getName() + 'xxx';

  const update = useCallback(async () => {
    console.log(new Date().getTime(), 'updating');
    const activeFile = workspace.getActiveFile();

    if (!activeFile) {
      return null;
    }

    const fileContents: string = await vault.cachedRead(activeFile);

    const mast = fromMarkdown(fileContents);
    const newGameTemplate = convertMarkdownToGameTemplate(mast);
    const newGameEvents = convertMarkdownToGameEvents(mast);

    const newGameState = createGameState(newGameTemplate, newGameEvents);

    console.log('gameState', newGameState);

    setGameState(newGameState);
  }, [vault, workspace]);

  useEffect(() => {
    registerEvent(
      metadataCache.on("changed", async (file) => {
        console.log(new Date().getTime(), 'file changed!', file);
        return update();
      })
    );

    registerEvent(
      workspace.on("active-leaf-change", async () => {
        console.log(new Date().getTime(), "Active leaf changed!");
        return update();
      })
    );

    update();
  }, [registerEvent, metadataCache, workspace, update]);


  let cardsByCategory: { [x: string]: any; } = {};

  if (gameState.template) {
    cardsByCategory = selectCardsByCategory(gameState);
    console.log({cardsByCategory});
  }

  return (
    <div>
      <h1>{heading}</h1>
      <DisplayedCard displayedCard={gameState.displayedCard} />
      {gameState.previousCards && (
        <PreviousCards previousCards={gameState.previousCards} />
      )}

      {gameState.template && (<>
        <RemainingCards remainingCards={getAvailableCards(gameState)} />

        <h2>Buttons</h2>

        <DrawCardButton
          categoryLabel='random'
          remainingCount={getAvailableCards(gameState).length}
          nextCard={selectRandomAvailableCard(gameState)}
        />

        {Object.keys(cardsByCategory).map(key => {
            const value: Card[] = cardsByCategory[key];
            const nextCard = selectRandomCard(value, gameState);
            console.log({key, value, nextCard})
            return (
                <DrawCardButton 
                    key={key}
                    categoryLabel={key} 
                    remainingCount={value.length} 
                    nextCard={nextCard}
                />
            )
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
    </div >
  );
};
