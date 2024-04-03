import React, { useEffect, useState, useCallback } from 'react';
import { useApp, useRegisterEvent } from "./hooks.js";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { convertMarkdownToGameTemplate } from '../parse/parse-template.js';
import { convertMarkdownToGameEvents } from '../parse/parse-events.js';
import { GameState, createGameState } from '../gamestate.js';

interface ReactBaseViewProps {
  GameView: React.ComponentType<{ gameState: GameState }>;
}

export const ReactBaseView: React.FC<ReactBaseViewProps> = ({ GameView }) => {
  const [gameState, setGameState] = useState<GameState>({} as GameState);
  const app = useApp();
  const registerEvent = useRegisterEvent();

  if (!app || !registerEvent) return null;
  const { vault, metadataCache, workspace } = app;

  const update = useCallback(async () => {
    const activeFile = workspace.getActiveFile();

    if (!activeFile) {
      return null;
    }

    const fileContents: string = await vault.cachedRead(activeFile);

    const mast = fromMarkdown(fileContents);
    const newGameTemplate = convertMarkdownToGameTemplate(mast);
    const newGameEvents = convertMarkdownToGameEvents(mast);

    const newGameState = createGameState(newGameTemplate, newGameEvents);

    setGameState(newGameState);
  }, [vault, workspace]);

  useEffect(() => {
    registerEvent(
      metadataCache.on("changed", async (file) => {
        return update();
      })
    );

    registerEvent(
      workspace.on("active-leaf-change", async () => {
        return update();
      })
    );

    update();
  }, [registerEvent, metadataCache, workspace, update]);

  return <GameView gameState={gameState} />;
};