import React, { useEffect, useState, useCallback } from 'react';
import { useApp, useRegisterEvent } from "./hooks.js";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { convertMarkdownToGameTemplate } from './parse.js';
import type { CardMap } from './parse.js';
import { AppendTimeButton } from './AppendTimeButton.jsx';
import { StacksDisplay } from './StacksDisplay.jsx';

export const ReactBaseView: React.FC = () => {
  const [stacks, setStacks] = useState<CardMap>({} as CardMap);
  const app = useApp();
  const registerEvent = useRegisterEvent();

  if (!app || !registerEvent) return null;

  const { vault, metadataCache, workspace } = app;

  const heading: string = vault.getName() + 'xxx';

  const update = useCallback(async () => {
    console.log(new Date().getTime(), 'updating');
    const activeFile = workspace.getActiveFile();

    if (!activeFile) {
      return null;
    }

    const fileContents: string = await vault.cachedRead(activeFile);
    console.log(fileContents);

    const mast = fromMarkdown(fileContents);
    const newStacks = convertMarkdownToGameTemplate(mast);
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
      <h1>{heading}</h1>
      <StacksDisplay stacks={stacks} />
      <AppendTimeButton />
    </div >
  );
};