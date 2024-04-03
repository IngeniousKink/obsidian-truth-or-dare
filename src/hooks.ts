import { useContext, useEffect, useState } from "react";

import { createContext } from "react";
import { App, EventRef } from "obsidian";

export const ObsidianAppContext = createContext<App | undefined>(undefined);

export type EventRegistryFunction = (eventRef: EventRef) => void;
export const ObsidianEventRegistryContext = createContext<EventRegistryFunction | undefined>(undefined);

const useApp = (): App | undefined => {
  return useContext(ObsidianAppContext);
};

export const useCombinedTemplateAndEventFileContent = () => {
  const app = useContext(ObsidianAppContext);
  const registerEvent = useContext(ObsidianEventRegistryContext);

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


