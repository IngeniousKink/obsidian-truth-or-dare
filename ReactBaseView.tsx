import React, { useEffect, useState, useCallback } from 'react';
import { useApp, useRegisterEvent } from "./hooks";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { getCardsUnderHeading } from 'parse';
import type { CardMap } from 'parse';

const AppendTimeButton: React.FC = () => {
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

export const ReactBaseView: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [stacks, setStacks] = useState<CardMap>({} as CardMap);
  const app = useApp();
  const registerEvent = useRegisterEvent();

  if (!app) return null;
  if (!registerEvent) return null;

  const { vault, metadataCache, workspace } = app;

  const update = useCallback(async () => {
    console.log(new Date().getTime(), 'updating');
    const activeFile = workspace.getActiveFile();

    if (!activeFile) {
      return null;
    }

    const fileContents: string = await vault.cachedRead(activeFile);
    console.log(fileContents);

    const newText: string = vault.getName() + 'xxx';
    setText(newText);

    const mast = fromMarkdown(fileContents);
    const newStacks = getCardsUnderHeading(mast);
    console.log(newStacks);
    setStacks(newStacks);
  }, [vault, workspace]);

  useEffect(() => {
    registerEvent(
      metadataCache.on("changed", async (file) => {
        console.log(new Date().getTime(), 'file changed!', file);
        return update();
      })
    );

    registerEvent(
      workspace.on("active-leaf-change", async () => {
        console.log(new Date().getTime(), "Active leaf changed!");
        return update();
      })
    );

    update();
  }, [registerEvent, metadataCache, workspace, update]);

  return (
    <div>
      <pre>{JSON.stringify(stacks, undefined, 2)}</pre>
      <h3>{text}</h3>
      <AppendTimeButton />
    </div >
  );
};