import { TimestampedEvent, serializeEventToCodeBlock } from "@obsidian-truth-or-dare/events.js";
import React, { useContext, useEffect, useState, useCallback } from "react";

const initialFileContents = `# game

* a truth <span data-category="truth" />
* a dare! <span data-category="dare" />

even here is text`;

interface App {
  activeFile: string | null;
  setActiveFile: React.Dispatch<React.SetStateAction<string | null>>;
}

const WebAppContext = React.createContext<App | undefined>(undefined);

interface WebAppProviderProps {
  children: React.ReactNode;
}

export const WebAppProvider: React.FC<WebAppProviderProps> = ({ children }) => {
  const [activeFile, setActiveFile] = useState<string | null>(initialFileContents);

  const value = {
    activeFile,
    setActiveFile
  };

  return <WebAppContext.Provider value={value}>{children}</WebAppContext.Provider>;
};

export const useWebApp = (): App | undefined => {
  return useContext(WebAppContext);
};

export const useActiveFileContent = () => {
  const app = useWebApp();
  const [content, setContent] = useState<string | null>(initialFileContents);

  useEffect(() => {
    if (!app) return;

    setContent(app.activeFile);
  }, [app]);

  return content;
};

export const useAppendEventToActiveFile = () => {
  const app = useWebApp();

  if (!app) return () => null;

  const appendEvent = useCallback(async (eventAction: TimestampedEvent) => {
    app.setActiveFile(data => `${data}\n${serializeEventToCodeBlock(eventAction)}`);
  }, [app]);

  return appendEvent;
};

export const useMediaResource = () => {
  return (url: string) => {
    let mediaResource = null;

    if (url.startsWith('http')) {
      mediaResource = url;
    }

    return mediaResource;
  }
}
