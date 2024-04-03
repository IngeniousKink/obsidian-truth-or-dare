
import React, { useEffect } from 'react';
import { useMultiplayer } from './useMultiplayer.js';

export const WindowLocationHashManager = () => {
  const {
    loadValue,
    setLoadValue,
    seedValue,
    setSeedValue,
  } = useMultiplayer();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));

    const loadValue = hashParams.get('load');
    let seed = hashParams.get('seed');

    // If seed is not present, add it to the URL's hash part
    if (!seed) {
      seed = Math.random().toString(36).substring(2, 10) +
        Math.random().toString(36).substring(2, 10);
      hashParams.set('seed', seed);
      window.location.hash = hashParams.toString();
    }

    setLoadValue(loadValue);
    console.log('setting load value from hash', loadValue);
    setSeedValue(seed);
  }, []);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    if (loadValue) {
      hashParams.set('load', loadValue);
    }
    if (seedValue) {
     hashParams.set('seed', seedValue);
    }
    window.location.hash = hashParams.toString();
  }, [loadValue, seedValue]);

  return null;
};

export const MultiplayerActiveFile = () => {
  const {
    publish,
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
      <WindowLocationHashManager />
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
        <button onClick={publish}>Publish Template</button>
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
