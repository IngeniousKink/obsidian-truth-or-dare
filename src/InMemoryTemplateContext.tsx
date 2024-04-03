import { TimestampedEvent, serializeEventToCodeBlock } from "@obsidian-truth-or-dare/events.js";
import React, { useContext, useEffect, useState, useCallback } from "react";

interface InMemoryTemplateContextValue {
  templateFileContent: string | null;
  setTemplateFileContent: React.Dispatch<React.SetStateAction<string | null>>;
  eventsFileContent: string | null;
  setEventsFileContent: React.Dispatch<React.SetStateAction<string | null>>;
}

const InMemoryTemplateContext = React.createContext<InMemoryTemplateContextValue | undefined>(undefined);

interface InMemoryTemplateProviderProps {
  children: React.ReactNode;
}

export const InMemoryTemplateProvider: React.FC<InMemoryTemplateProviderProps> = ({ children }) => {
  const [templateFileContent, setTemplateFileContent] = useState<string | null>(null);
  const [eventsFileContent, setEventsFileContent] = useState<string | null>(null);

  const value = {
    templateFileContent,
    setTemplateFileContent,
    eventsFileContent,
    setEventsFileContent,
  };

  return <InMemoryTemplateContext.Provider value={value}>{children}</InMemoryTemplateContext.Provider>;
};

export const useInMemoryTemplate = (): InMemoryTemplateContextValue | undefined => {
  return useContext(InMemoryTemplateContext);
};

// export const useTemplateFileContent = () => {
//   const value = useInMemoryTemplate();
//   const [content, setContent] = useState<string | null>(null);

//   useEffect(() => {
//     if (!value) return;

//     setContent(value.templateFileContent);
//   }, [value]);

//   return content;
// };
