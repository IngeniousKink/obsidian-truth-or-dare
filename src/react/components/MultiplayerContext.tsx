import { createContext } from 'react';

export type MultiplayerContextType = {
    websockets: WebSocket[];
    setWebsockets: React.Dispatch<React.SetStateAction<WebSocket[]>>;
    eventIds: { [key: string]: boolean };
    setEventIds: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    loadValue: string | null;
    setLoadValue: React.Dispatch<React.SetStateAction<string | null>>;
    seedValue: string | null;
    setSeedValue: React.Dispatch<React.SetStateAction<string | null>>;
  };

export const MultiplayerContext = createContext<MultiplayerContextType | undefined>(undefined);
