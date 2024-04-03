import React from 'react';
import { completeCard, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useAppendEventToActiveFile } from '@obsidian-truth-or-dare/hooks.js';

interface CompleteCardButtonProps {
  cardRef: string;
}

export const CompleteCardButton: React.FC<CompleteCardButtonProps> = ({ cardRef }) => {
  const event = timestampEvent(completeCard(cardRef));
  const completeCardByRef = useAppendEventToActiveFile(event);

  const buttonText = "✅ Card completed";

  return <button onClick={completeCardByRef}>{buttonText}</button>;
};
