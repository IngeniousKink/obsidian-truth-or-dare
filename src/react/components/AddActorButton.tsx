import React from 'react';
import { useApp } from "../hooks.js";
import { createActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';

export const AddActorButton: React.FC = () => {
  const app = useApp();
  if (!app) return null;

  const { vault, workspace } = app;
  const activeFile = workspace.getActiveFile();

  const addActor = async () => {
    if (!activeFile) return;

    const event = timestampEvent(createActor());

    await vault.process(activeFile, (data) => {
      return `${data}
\`\`\`truth-or-dare:event
type:${event.type}
timestamp:${event.timestamp}
actorId:${event.actorId}
\`\`\`
`;
    });
  };

  const buttonText = "➕ Add player";

  return <button onClick={addActor}>{buttonText}</button>;
};
