import React from 'react';
import { createActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useDispatchGameEventHook } from '../dispatchEvent.js';

export const AddActorButton: React.FC = () => {
  const useDispatchGameEvent = useDispatchGameEventHook();
  const dispatchGameEvent = useDispatchGameEvent();

  const handleAddActor = () => {
    const event = timestampEvent(createActor());
    dispatchGameEvent(event);
  };

  const buttonText = "➕ Add player";

  return <button onClick={handleAddActor}>{buttonText}</button>;
};
