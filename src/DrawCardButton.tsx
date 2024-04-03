import React from 'react';
import { useApp } from "./hooks.js";
import { Card } from './parse-template.js';

interface DrawCardButtonProps {
  nextCard: Card | null;
}

export const DrawCardButton: React.FC<DrawCardButtonProps> = ({ nextCard }) => {
  const app = useApp();
  if (!app) return null;

  const { vault, workspace } = app;
  const activeFile = workspace.getActiveFile();

  const drawCard = async () => {
    if (!activeFile) return;
    if (!nextCard) return;

    await vault.process(activeFile, (data) => {
      return `${data}
\`\`\`truth-or-dare:event
type:card-draw
timestamp:${new Date().getTime()}
card: ${nextCard.ref}
\`\`\`
`;
    });
  };

  const buttonText = nextCard ? "Draw a card" : "(No more cards)";
  return <button onClick={drawCard} disabled={!nextCard}>{buttonText}</button>;
};
