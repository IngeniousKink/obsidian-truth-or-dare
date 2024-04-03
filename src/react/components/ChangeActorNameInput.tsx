import React from 'react';
import { changeActorName, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useDispatchGameEventHook } from '../dispatchEvent.js';

interface ChangeActorNameInputProps {
  actorId: string;
  name: string;
}

export const ChangeActorNameInput: React.FC<ChangeActorNameInputProps> = ({ actorId, name }) => {
  const useDispatchGameEvent = useDispatchGameEventHook();
  const dispatchGameEvent = useDispatchGameEvent();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;

    if (!actorId || name === newName) return;

    const gameEvent = timestampEvent(changeActorName(actorId, newName));
    dispatchGameEvent(gameEvent);
  };

  return (
    <input
      type="text"
      placeholder="Enter new name"
      value={name}
      onChange={handleNameChange}
      onBlur={handleNameChange}
    />
  );
};
