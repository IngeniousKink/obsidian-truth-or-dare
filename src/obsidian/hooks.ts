import { useContext, useEffect, useState } from "react";
import type { App } from "obsidian";
import { EventRegistryContext, EventRegistryFunction, AppContext } from "../react/context.js";
import { GameState, createGameState } from "@obsidian-truth-or-dare/gamestate.js";
import { fromMarkdown } from "mdast-util-from-markdown";
import { convertMarkdownToGameTemplate } from "@obsidian-truth-or-dare/parse/parse-template.js";
import { convertMarkdownToGameEvents } from "@obsidian-truth-or-dare/parse/parse-events.js";
import { GameEvent, timestampEvent } from "@obsidian-truth-or-dare/events.js";
import { appendEventToActiveFile } from "./appendEventToActiveFile.js";

export const useApp = (): App | undefined => {
  return useContext(AppContext);
};

export const useRegisterEvent = (): EventRegistryFunction | undefined => {
  return useContext(EventRegistryContext);
};

export const useActiveFileContent = () => {
  const app = useContext(AppContext);
  const registerEvent = useContext(EventRegistryContext);
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!app || !registerEvent) return;

    const fetchFileContents = async () => {
      const activeFile = app.workspace.getActiveFile();
      if (!activeFile) return;
      const fileContents: string = await app.vault.cachedRead(activeFile);
      setContent(fileContents);
    };

    registerEvent(app.metadataCache.on('changed', fetchFileContents));
    registerEvent(app.workspace.on('active-leaf-change', fetchFileContents));

    fetchFileContents();
  }, [app, registerEvent]);

  return content;
};

export const useAppendEventToActiveFile = (eventAction : GameEvent) => {
  const app = useApp();

  if (!app) return () => null;

  const { vault, workspace } = app;
  const activeFile = workspace.getActiveFile();

  const appendEvent = async () => {
    if (!activeFile) return;

    const event = timestampEvent(eventAction);

    await appendEventToActiveFile(vault, activeFile, event);
  };

  return appendEvent;
};



export const useGameState = (): GameState => {
  const [gameState, setGameState] = useState<GameState>({} as GameState);
  const fileContents = useActiveFileContent();

  useEffect(() => {
    if (!fileContents) {
      return;
    }

    const mast = fromMarkdown(fileContents);
    const newGameTemplate = convertMarkdownToGameTemplate(mast);
    const newGameEvents = convertMarkdownToGameEvents(mast);

    const newGameState = createGameState(newGameTemplate, newGameEvents);

    setGameState(newGameState);
  }, [fileContents]);

  return gameState;
};