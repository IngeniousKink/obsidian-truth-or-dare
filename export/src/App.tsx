import React from 'react'

import '../../styles.css'

import { fromMarkdown } from 'mdast-util-from-markdown';

import { GameStateWithDisplayedCard, PlayView } from '@obsidian-truth-or-dare/react/components/PlayView.js';
import { convertMarkdownToGameTemplate } from '@obsidian-truth-or-dare/parse/parse-template.js';
import { convertMarkdownToGameEvents } from '@obsidian-truth-or-dare/parse/parse-events.js';
import { createGameState } from '@obsidian-truth-or-dare/gamestate.js';

const fileContents = `# game

* xx <span data-category="truth" />
* dare! <span data-category="dare" />

even here is text`;

function createNewGameState(fileContents: string): GameStateWithDisplayedCard {
  const mast = fromMarkdown(fileContents);
  const newGameTemplate = convertMarkdownToGameTemplate(mast);
  const newGameEvents = convertMarkdownToGameEvents(mast);

  const newGameState = createGameState(newGameTemplate, newGameEvents);

  return {
    ...newGameState,
    displayedCard: '#game^0'
  }
}

function App() {
  const newGameState = createNewGameState(fileContents);
  return (
    <>
      <PlayView gameState={newGameState} />
    </>
  )
}

export default App
