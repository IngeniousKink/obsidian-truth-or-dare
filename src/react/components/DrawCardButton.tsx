import React from 'react';
import { useApp } from "../hooks.js";
import { CardWithRef } from '../../parse/parse-template.js';

interface DrawCardButtonProps {
  nextCard: CardWithRef | null;
  remainingCount: number;
  categoryLabel: string;
}

export const DrawCardButton: React.FC<DrawCardButtonProps> = (
  {
    nextCard,
    remainingCount,
    categoryLabel
  }) => {

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

  const buttonText = nextCard
   ? `Draw a ${categoryLabel} card (${remainingCount})` 
   : `(No more ${categoryLabel} cards)`;

  return <button onClick={drawCard} disabled={!nextCard}>{buttonText}</button>;
};
