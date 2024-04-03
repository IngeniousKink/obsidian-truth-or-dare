import React from 'react';
import { CardWithRef } from '../../parse/parse-template.js';
import { drawCard, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useAppendEventToActiveFile } from '@obsidian-truth-or-dare/hooks.js';

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

  const appendEvent = useAppendEventToActiveFile();

  if (!nextCard) {
    const buttonText = `(No more ${categoryLabel} cards)`;
    return <button disabled>{buttonText}</button>;
  }

  const handleDrawCard = () => {
    const event = timestampEvent(drawCard(nextCard.ref));
    appendEvent(event);
  };

  const buttonText = `Draw a ${categoryLabel} card (${remainingCount})`;

  return <button onClick={handleDrawCard}>{buttonText}</button>;
};