import React, { useState } from 'react';
import { MultiplayerContext, MultiplayerContextType } from './MultiplayerContext.js';

export type MultiplayerProviderProps = {
  children: React.ReactNode;
};

export const MultiplayerProvider: React.FC<MultiplayerProviderProps> = ({ children }) => {
  const [websockets, setWebsockets] = useState<WebSocket[]>([]);
  const [eventIds, setEventIds] = useState<{ [key: string]: boolean; }>({});
  const [loadValue, setLoadValue] = useState<string | null>(null);
  const [seedValue, setSeedValue] = useState<string | null>(null);

  const multiplayerValue: MultiplayerContextType = {
    websockets,
    setWebsockets,
    eventIds,
    setEventIds,
    loadValue,
    setLoadValue,
    seedValue,
    setSeedValue,
  };

  return (
    <MultiplayerContext.Provider value={multiplayerValue}>
      {children}
    </MultiplayerContext.Provider>
  );
};
