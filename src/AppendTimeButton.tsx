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
      return `${data}
\`\`\`truth-or-dare:event
type:card-draw
timestamp:${new Date().getTime()}
x: 2
\`\`\`
`;
    });
  };

  return <button onClick={appendTime}>Append Time</button>;
};
