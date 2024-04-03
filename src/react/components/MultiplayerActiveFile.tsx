import React from 'react';
import { useMultiplayer } from './useMultiplayer.js';
import NDK, { NDKRelay } from "@nostr-dev-kit/ndk";

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


const CONNECTION_STATES = {
  0: '🟡 CONNECTING',
  1: '🟢 CONNECTED',
  2: '🟠 DISCONNECTING',
  3: '🔴 DISCONNECTED',
  4: '🟡 RECONNECTING',
  5: '🔵 FLAPPING',
  6: '🔓 AUTH_REQUIRED',
  7: '🔐 AUTHENTICATING',
};

// declare enum NDKRelayStatus {
//   CONNECTING = 0,
//   CONNECTED = 1,
//   DISCONNECTING = 2,
//   DISCONNECTED = 3,
//   RECONNECTING = 4,
//   FLAPPING = 5,
//   AUTH_REQUIRED = 6,
//   AUTHENTICATING = 7
// }

export const ConnectionStatus = () => {
  const { relays } = useMultiplayer();

  if (!relays) {
    return 'connecting ...';
  }

  return (
    <ul>
      {Array.from(relays.entries()).map(([name, relay]: [string, NDKRelay]) => (
        <li key={name}>
          {relay.url}
          {CONNECTION_STATES[relay.connectivity.status] || 'UNKNOWN'}
        </li>
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
