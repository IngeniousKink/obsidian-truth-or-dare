
import React, { useState } from 'react';
import { useApp } from "../../obsidian/hooks.js";
import { changeActorName, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { appendEventToActiveFile } from '@obsidian-truth-or-dare/obsidian/appendEventToActiveFile.js';

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

    if (!activeFile || !actorId || name === newName) return;

    const gameEvent = timestampEvent(changeActorName(actorId, newName));

    await appendEventToActiveFile(vault, activeFile, gameEvent);
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
