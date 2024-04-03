import React from 'react';
import { deleteActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useDispatchGameEventHook } from '../dispatchEvent.js';

interface DeleteActorButtonProps {
  id: string;
}

export const DeleteActorButton: React.FC<DeleteActorButtonProps> = ({ id }) => {
  const useDispatchGameEvent = useDispatchGameEventHook();
  const dispatchGameEvent = useDispatchGameEvent();

  const handleDeleteActor = () => {
    const event = timestampEvent(deleteActor(id));
    dispatchGameEvent(event);
  };

  const buttonText = "❌";

  return <button onClick={handleDeleteActor}>{buttonText}</button>;
};
