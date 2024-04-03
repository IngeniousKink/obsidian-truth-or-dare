import React from 'react';
import { useApp } from "../hooks.js";
import { deleteActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';

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

  const buttonText = "❌";

  return <button onClick={deleteActorById}>{buttonText}</button>;
};
