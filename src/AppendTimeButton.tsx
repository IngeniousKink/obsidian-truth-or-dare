import React from 'react';
import { useApp } from "./hooks.js";

export const AppendTimeButton: React.FC = () => {
  const app = useApp();
  if (!app) return null;

  const { vault, workspace } = app;
  const activeFile = workspace.getActiveFile();

  const appendTime = async () => {
    if (!activeFile) {
      return;
    }

    await vault.process(activeFile, (data) => {
      return `${data}\n\`\`\`truth-or-dare:event\ntype:card-draw\ntimestamp:${new Date().getTime()}\nx: 2\n\`\`\`\n`;
    });
  };

  return <button onClick={appendTime}>Append Time</button>;
};
