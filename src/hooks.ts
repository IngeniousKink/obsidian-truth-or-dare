import { useContext, useEffect, useState } from "react";
import type { App } from "obsidian";
import { EventRegistryContext, EventRegistryFunction, AppContext } from "./react/context.js";
import { GameEvent, TimestampedEvent, timestampEvent } from "@obsidian-truth-or-dare/events.js";
import { appendEventToActiveFile } from "./obsidian/appendEventToActiveFile.js";

export const useApp = (): App | undefined => {
  return useContext(AppContext);
};

export const useRegisterEvent = (): EventRegistryFunction | undefined => {
  return useContext(EventRegistryContext);
};

export const useActiveFileContent = () => {
  const app = useContext(AppContext);
  const registerEvent = useContext(EventRegistryContext);
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!app || !registerEvent) return;

    const fetchFileContents = async () => {
      const activeFile = app.workspace.getActiveFile();
      if (!activeFile) return;
      const fileContents: string = await app.vault.cachedRead(activeFile);
      setContent(fileContents);
    };

    registerEvent(app.metadataCache.on('changed', fetchFileContents));
    registerEvent(app.workspace.on('active-leaf-change', fetchFileContents));

    fetchFileContents();
  }, [app, registerEvent]);

  return content;
};

export const useAppendEventToActiveFile = () => {
  const app = useApp();
  if (!app) return () => null;
  const { vault, workspace } = app;
  const activeFile = workspace.getActiveFile();
  
  return async (eventAction: TimestampedEvent) => {
    if (!activeFile) return;
    await appendEventToActiveFile(vault, activeFile, eventAction);
  };
};

export const useMediaResource = () => {
  const app = useApp();

  return (url: string) => {
    let mediaResource = null;

    if (url.startsWith('http')) {
      mediaResource = url;
    } else if (app) {
      const mediaPath = app.metadataCache.getFirstLinkpathDest(url, ".")?.path;
      if (mediaPath) {
        mediaResource = app.vault.adapter.getResourcePath(mediaPath);
      }
    }

    return mediaResource;
  }
}


