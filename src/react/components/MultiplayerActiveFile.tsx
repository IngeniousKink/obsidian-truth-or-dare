import React from 'react';
import { useMultiplayer } from './useMultiplayer.js';

export const LoadEntityInput = () => {
  const { loadValue, setLoadValue } = useMultiplayer();

  return (
    <label>
      Load:
      <input
        type="text"
        value={loadValue || ''}
        onChange={(e) => setLoadValue(e.target.value)}
      />
    </label>
  );
};

export const SeedInput = () => {
  const { seedValue, setSeedValue } = useMultiplayer();

  return (
    <label>
      Seed:
      <input
        type="text"
        disabled
        value={seedValue || ''}
        onChange={(e) => setSeedValue(e.target.value)}
      />
    </label>
  );
};

export const PublishButton = () => {
  const { publishTemplate } = useMultiplayer();

  return (
    <button onClick={publishTemplate}>Publish Template</button>
  );
};

export const LoadButton = () => {
  const { loadEvents } = useMultiplayer();

  return (
    <button onClick={loadEvents}>Load Template</button>
  );
};

export const ConnectionStatus = () => {
  const { websockets, WEBSOCKET_STATES } = useMultiplayer();

  return (
    <ul>
      {websockets.map((ws, index) => (
        <li key={index}>{ws.url} {WEBSOCKET_STATES[ws.readyState] || 'UNKNOWN'}</li>
      ))}
    </ul>
  );
};

export const MultiplayerActiveFile = () => {
  return (
    <>
      <fieldset>
        <legend>Multiplayer</legend>
        <LoadEntityInput />
        <br />
        <SeedInput />
        <br />
        <br />
        <PublishButton />
        <LoadButton />
        <br />
        <br />
        <span>Connection status</span>
        <ConnectionStatus />
      </fieldset>
    </>
  );
};

export default MultiplayerActiveFile;
