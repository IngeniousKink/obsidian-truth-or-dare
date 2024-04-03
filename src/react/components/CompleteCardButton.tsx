import React from 'react';
import { completeCard, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useAppendGameEvent } from '@obsidian-truth-or-dare/hooks.js';

interface CompleteCardButtonProps {
  cardRef: string;
}

export const CompleteCardButton: React.FC<CompleteCardButtonProps> = ({ cardRef }) => {
  const appendEvent = useAppendGameEvent();

  const handleCompleteCard = () => {
    const event = timestampEvent(completeCard(cardRef));
    appendEvent(event);
  };

  const buttonText = "✅ Card completed";

  return <button onClick={handleCompleteCard}>{buttonText}</button>;
};

