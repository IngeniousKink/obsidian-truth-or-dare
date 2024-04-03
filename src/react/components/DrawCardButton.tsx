import React from 'react';
import { useApp } from "../../obsidian/hooks.js";
import { CardWithRef } from '../../parse/parse-template.js';
import { drawCard, timestampEvent } from '@obsidian-truth-or-dare/events.js';

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

  const handleClick = async () => {
    if (!activeFile) return;
    if (!nextCard) return;

    const event = timestampEvent(drawCard(nextCard.ref));

    await vault.process(activeFile, (data) => {
      return `${data}
\`\`\`truth-or-dare:event
type:${event.type}
timestamp:${event.timestamp}
cardRef: ${event.cardRef}
\`\`\`
`;
    });
  };

  const buttonText = nextCard
   ? `Draw a ${categoryLabel} card (${remainingCount})` 
   : `(No more ${categoryLabel} cards)`;

  return <button onClick={handleClick} disabled={!nextCard}>{buttonText}</button>;
};
