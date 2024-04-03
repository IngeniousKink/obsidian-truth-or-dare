import React, { useEffect, useState } from 'react';
import { useApp } from "./hooks";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { getCardsUnderHeading } from 'parse';


export const ReactView: React.FC = () => {
  const { vault, metadataCache, workspace } = useApp();
  const [text, setText] = useState<string>("");
  const [stacks, setStacks] = useState<any[]>([]); // replace 'any' with your data structure

  const update = async () => {
    console.log(new Date().getTime(), "Active leaf changed!");
    const activeFile = workspace.getActiveFile();

    if (!activeFile) {
      return;
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
    const updateOnFileChange = metadataCache.on("changed", async (file) => {
      console.log(new Date().getTime(), 'file changed!', file);
      return update();
    });

    const updateOnLeafChange = workspace.on("active-leaf-change", async () => { return update(); });

    update();

    return () => {
      updateOnFileChange.remove();
      updateOnLeafChange.remove();
    };
  }, []);

  return (
    <div>
      <h3>{text}</h3>
      <pre>{JSON.stringify(stacks, undefined, 2)}</pre>
    </div>
  );
};
