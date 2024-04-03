import { useEffect, useState } from "react";
import { GameState, createGameState } from "@obsidian-truth-or-dare/gamestate.js";
import { fromMarkdown } from "mdast-util-from-markdown";
import { convertMarkdownToGameTemplate } from "@obsidian-truth-or-dare/parse/parse-template.js";
import { convertMarkdownToGameEvents } from "@obsidian-truth-or-dare/parse/parse-events.js";
import { useActiveFileContent } from "@obsidian-truth-or-dare/hooks.js";

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
