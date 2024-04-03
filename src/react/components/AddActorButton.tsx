import React from 'react';
import { useApp } from "../../obsidian/hooks.js";
import { createActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { appendEventToActiveFile } from "@obsidian-truth-or-dare/obsidian/appendEventToActiveFile.js";

export const AddActorButton: React.FC = () => {
  const app = useApp();
  if (!app) return null;

  const { vault, workspace } = app;
  const activeFile = workspace.getActiveFile();

  const addActor = async () => {
    if (!activeFile) return;

    const event = timestampEvent(createActor());

    await appendEventToActiveFile(vault, activeFile, event);
  };

  const buttonText = "➕ Add player";

  return <button onClick={addActor}>{buttonText}</button>;
};
