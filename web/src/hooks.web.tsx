import { TimestampedEvent, serializeEventToCodeBlock } from "@obsidian-truth-or-dare/events.js";
import React, { useContext, useEffect, useState, useCallback } from "react";

interface WebAppContextValue {
  templateFileContent: string | null;
  setTemplateFileContent: React.Dispatch<React.SetStateAction<string | null>>;
  eventsFileContent: string | null;
  setEventsFileContent: React.Dispatch<React.SetStateAction<string | null>>;
  appendEventTarget: 'template' | 'events';
  setAppendEventTarget: React.Dispatch<React.SetStateAction<'template' | 'events'>>;
}

const WebAppContext = React.createContext<WebAppContextValue | undefined>(undefined);

interface WebAppProviderProps {
  children: React.ReactNode;
}

export const WebAppProvider: React.FC<WebAppProviderProps> = ({ children }) => {
  const [templateFileContent, setTemplateFileContent] = useState<string | null>(null);
  const [eventsFileContent, setEventsFileContent] = useState<string | null>(null);
  const [appendEventTarget, setAppendEventTarget] = useState<'template' | 'events'>('template');

  const value = {
    templateFileContent,
    setTemplateFileContent,
    eventsFileContent,
    setEventsFileContent,
    appendEventTarget,
    setAppendEventTarget,
  };

  return <WebAppContext.Provider value={value}>{children}</WebAppContext.Provider>;
};

export const useWebApp = (): WebAppContextValue | undefined => {
  return useContext(WebAppContext);
};

export const useTemplateFileContent = () => {
  const app = useWebApp();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!app) return;

    setContent(app.templateFileContent);
  }, [app]);

  return content;
};

export const useCombinedTemplateAndEventFileContent = () => {
  const app = useWebApp();
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (!app) return;
    if (!app.templateFileContent) return;

    setContent(app.templateFileContent + app.eventsFileContent);
  }, [app]);

  return content;
};

type AppendGameEventFunction = (eventAction: TimestampedEvent) => Promise<void> | null;

export const useAppendGameEvent = (): AppendGameEventFunction => {
  const app = useWebApp();

  if (!app) return () => null;

  const appendEvent = useCallback(async (eventAction: TimestampedEvent) => {
    if (app.appendEventTarget === 'events') {
      app.setEventsFileContent(data => `${data}\n${serializeEventToCodeBlock(eventAction)}`);
    } else {
      app.setTemplateFileContent(data => `${data}\n${serializeEventToCodeBlock(eventAction)}`);
    }
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
