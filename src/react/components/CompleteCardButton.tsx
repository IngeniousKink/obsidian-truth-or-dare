import React from 'react';
import { completeCard, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useDispatchGameEventHook } from '../dispatchEvent.js';

interface CompleteCardButtonProps {
  cardRef: string;
}

export const CompleteCardButton: React.FC<CompleteCardButtonProps> = ({ cardRef }) => {
  const useDispatchGameEvent = useDispatchGameEventHook();
  const dispatchGameEvent = useDispatchGameEvent();

  const handleCompleteCard = () => {
    const event = timestampEvent(completeCard(cardRef));
    dispatchGameEvent(event);
  };

  const buttonText = "✅ Card completed";

  return <button onClick={handleCompleteCard}>{buttonText}</button>;
};

