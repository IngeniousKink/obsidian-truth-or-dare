import React, { useEffect, useState } from 'react';
import { useApp, useRegisterEvent } from "./hooks";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { getCardsUnderHeading } from 'parse';
import type { CardMap } from 'parse';

export const ReactView: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [stacks, setStacks] = useState<CardMap>({} as CardMap);
  const app = useApp();
  const registerEvent = useRegisterEvent();

  if (!app) return null;
  if (!registerEvent) return null;

  const { vault, metadataCache, workspace } = app;

  const update = async () => {
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
  };

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
  }, []);

  return (
    <div>
      <h3>{text}</h3>
      <pre>{JSON.stringify(stacks, undefined, 2)}</pre>
    </div>
  );
};

