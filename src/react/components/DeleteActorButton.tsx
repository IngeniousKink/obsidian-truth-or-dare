import React from 'react';
import { useApp } from "../hooks.js";
import { deleteActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { appendEventToActiveFile } from '@obsidian-truth-or-dare/obsidian/appendEventToActiveFile.js';

interface DeleteActorButtonProps {
  id: string;
}

export const DeleteActorButton: React.FC<DeleteActorButtonProps> = ({ id }) => {
  const app = useApp();
  if (!app) return null;

  const { vault, workspace } = app;
  const activeFile = workspace.getActiveFile();

  const deleteActorById = async () => {
    if (!activeFile) return;

    const event = timestampEvent(deleteActor(id));

    await appendEventToActiveFile(vault, activeFile, event);
  };

  const buttonText = "❌";

  return <button onClick={deleteActorById}>{buttonText}</button>;
};
