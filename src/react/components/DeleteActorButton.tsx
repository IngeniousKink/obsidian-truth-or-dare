import React from 'react';
import { deleteActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useAppendGameEvent } from '@obsidian-truth-or-dare/hooks.js';

interface DeleteActorButtonProps {
  id: string;
}

export const DeleteActorButton: React.FC<DeleteActorButtonProps> = ({ id }) => {
  const appendEvent = useAppendGameEvent();
  
  const handleDeleteActor = () => {
    const event = timestampEvent(deleteActor(id));
    appendEvent(event);
  };

  const buttonText = "❌";

  return <button onClick={handleDeleteActor}>{buttonText}</button>;
};
