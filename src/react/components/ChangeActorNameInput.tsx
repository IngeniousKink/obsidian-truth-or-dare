import React from 'react';
import { changeActorName, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useAppendEventToActiveFile } from '@obsidian-truth-or-dare/hooks.js';

interface ChangeActorNameInputProps {
  actorId: string;
  name: string;
}

export const ChangeActorNameInput: React.FC<ChangeActorNameInputProps> = ({ actorId, name }) => {
  const appendEvent = useAppendEventToActiveFile();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;

    if (!actorId || name === newName) return;

    const gameEvent = timestampEvent(changeActorName(actorId, newName));
    appendEvent(gameEvent);
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
