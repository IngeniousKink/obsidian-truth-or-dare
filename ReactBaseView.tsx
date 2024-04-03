import React, { useEffect, useState, useCallback } from 'react';
import { useApp, useRegisterEvent } from "./hooks";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { getCardsUnderHeading } from 'parse';
import type { CardMap } from 'parse';
import { AppendTimeButton } from 'AppendTimeButton';

const StacksDisplay: React.FC = () => {
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

  return <pre>{JSON.stringify(stacks, undefined, 2)}</pre>;
};

export const ReactBaseView: React.FC = () => {
  const [text, setText] = useState<string>("");
  const app = useApp();

  if (!app) return null;

  const { vault } = app;

  const newText: string = vault.getName() + 'xxx';
  setText(newText);

  return (
    <div>
      <h3>{text}</h3>
      <StacksDisplay />
      <AppendTimeButton />
    </div >
  );
};