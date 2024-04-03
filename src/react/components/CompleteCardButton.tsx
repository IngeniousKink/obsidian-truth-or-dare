import React from 'react';
import { useApp } from "../hooks.js";
import { completeCard, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { appendEventToActiveFile } from '@obsidian-truth-or-dare/obsidian/appendEventToActiveFile.js';

interface CompleteCardButtonProps {
  cardRef: string;
}

export const CompleteCardButton: React.FC<CompleteCardButtonProps> = ({ cardRef }) => {
  const app = useApp();
  if (!app) return null;

  const { vault, workspace } = app;
  const activeFile = workspace.getActiveFile();

  const completeCardByRef = async () => {
    if (!activeFile) return;

    const event = timestampEvent(completeCard(cardRef));

    await appendEventToActiveFile(vault, activeFile, event);
  };

  const buttonText = "✅ Card completed";

  return <button onClick={completeCardByRef}>{buttonText}</button>;
};
