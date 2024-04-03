import React from 'react';
import { CardWithRef } from '../../parse/parse-template.js';
import { drawCard, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useDispatchGameEventHook } from '@obsidian-truth-or-dare/react/dispatchEvent.js';

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


  if (!nextCard) {
    const buttonText = `(No more ${categoryLabel} cards)`;
    return <button disabled>{buttonText}</button>;
  }

  const useDispatchGameEvent = useDispatchGameEventHook();
  const dispatchGameEvent = useDispatchGameEvent();

  const handleDrawCard = () => {
    const event = timestampEvent(drawCard(nextCard.ref));
    dispatchGameEvent(event);
  };

  const buttonText = `Draw a ${categoryLabel} card (${remainingCount})`;

  return <button onClick={handleDrawCard}>{buttonText}</button>;
};