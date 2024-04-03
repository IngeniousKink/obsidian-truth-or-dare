import React, { useEffect, useState, useCallback } from 'react';
import { useApp, useRegisterEvent } from "./hooks.js";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { convertMarkdownToGameTemplate } from './parse-template.js';
import type { GameTemplate } from './parse-template.js';
import { AppendTimeButton } from './AppendTimeButton.jsx';
import { StacksDisplay } from './StacksDisplay.jsx';
import { GameEvent, convertMarkdownToGameEvents } from './parse-events.js';
import { EventsDisplay } from './EventsDisplay.jsx';

type GameState = {
  template: GameTemplate,
  events: GameEvent[]
};

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

    const newGameState: GameState = {
      template: newGameTemplate,
      events: newGameEvents,
    };
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

  return (
    <div>
      <h1>{heading}</h1>
      <h2>Buttons</h2>
      <AppendTimeButton />
      {gameState.template && gameState.events && (
        <>
          <h2>Events</h2>
          <EventsDisplay events={gameState.events} />
        </>
      )}
      {gameState.template && gameState.template.stacks && (
        <>
          <h2>Template</h2>
          <StacksDisplay stacks={gameState.template.stacks} />
        </>
      )}
    </div >
  );
};

