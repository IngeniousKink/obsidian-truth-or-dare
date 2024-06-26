import React, { useContext, useState } from "react";

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
  const [templateFileContent, setTemplateFileContent] = useState<string | null>('');
  const [eventsFileContent, setEventsFileContent] = useState<string | null>('');

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
