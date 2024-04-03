import React, { useState } from 'react';
import { useApp } from "../hooks.js";
import { changeActorName, timestampEvent } from '@obsidian-truth-or-dare/events.js';

interface ChangeActorNameInputProps {
  actorId: string;
  name: string;
}

export const ChangeActorNameInput: React.FC<ChangeActorNameInputProps> = ({ actorId, name }) => {
  const app = useApp();
  if (!app) return null;

  const { vault, workspace } = app;
  const activeFile = workspace.getActiveFile();

  const handleNameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;

    if (!activeFile || !actorId || !newName || name === newName) return;

    const gameEvent = timestampEvent(changeActorName(actorId, newName));

    await vault.process(activeFile, (data) => {
      return `${data}
\`\`\`truth-or-dare:event
type:${gameEvent.type}
timestamp:${gameEvent.timestamp}
actorId:${gameEvent.actorId}
value:${gameEvent.value}
\`\`\`
`;
    });
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
