
import React from 'react';
import { useMultiplayer } from './useMultiplayer.js';

export const MultiplayerActiveFile = () => {
  const {
    publishTemplate,
    loadEvents,
    websockets,
    WEBSOCKET_STATES,
    loadValue,
    setLoadValue,
    seedValue,
    setSeedValue,
  } = useMultiplayer();

  return (
    <>
      <fieldset>
        <legend>Multiplayer</legend>

        <label>
          Load:
          <input
            type="text"
            value={loadValue || ''}
            onChange={(e) => setLoadValue(e.target.value)}
          />
        </label>
        <br />
        <label>
          Seed:
          <input
            type="text"
            disabled
            value={seedValue || ''}
            onChange={(e) => setSeedValue(e.target.value)}
          />
        </label>
        <br />
        <br />
        <button onClick={publishTemplate}>Publish Template</button>
        <button onClick={loadEvents}>Load Template</button>
        <br />
        <br />
        <span>Connection status</span>
        <ul>
          {websockets.map((ws, index) => (
            <li key={index}>{ws.url} {WEBSOCKET_STATES[ws.readyState] || 'UNKNOWN'}</li>
          ))}
        </ul>
      </fieldset>
    </>
  );
};

export default MultiplayerActiveFile;
