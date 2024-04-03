import { useCallback, useContext } from 'react';
import { MultiplayerContext } from './MultiplayerContext.js';
import { useInMemoryTemplate } from '@obsidian-truth-or-dare/InMemoryTemplateContext.js';
import NDK, { NDKEvent, NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { decode } from 'nostr-tools/nip19';

const explicitRelayUrls = [
  'wss://nos.lol',
  'wss://relay.damus.io',
]

const client = new NDK({
  explicitRelayUrls,
  signer: NDKPrivateKeySigner.generate()
});

export const useMultiplayer = () => {
  const multiplayerContext = useContext(MultiplayerContext);

  if (!multiplayerContext) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }

  const { loadValue, setLoadValue, seedValue, setSeedValue } = multiplayerContext;

  const templateValue = useInMemoryTemplate();

  if (!templateValue) {
    throw new Error('useMultiplayer must be used within a InMemoryTemplateProvider');
  }

  const {
    templateFileContent,
    setTemplateFileContent,
    setEventsFileContent
  } = templateValue;

  const loadEvents = useCallback(async () => {
    if (!loadValue) {
      throw new Error('Invalid entity to load');
    }
    if (!client.signer) {
      throw new Error('No signer!');
    }

    const decoded = decode(loadValue);

    if (decoded.type != 'naddr') { return; }

    await ensureConnection();

    client.subscribe({
      kinds: [30023],
      authors: [decoded.data.pubkey],
      '#d': [decoded.data.identifier]
    }).on('event', ((event: NDKEvent) => {
      setTemplateFileContent(event.content);
    }))

    client.subscribe({
      kinds: [1],
      '#a': [`30023:${decoded.data.pubkey}:${decoded.data.identifier}`]
    }).on('event', ((event: NDKEvent) => {
      setEventsFileContent((data: string) => `${data}\n${event.content}`);
    }))

  }, [loadValue]);

  const publishTemplate = useCallback(async () => {
    if (!templateFileContent) {
      throw new Error('No template content');
    }

    await ensureConnection();

    const event = new NDKEvent(client);
    event.kind = 30023;
    event.tags = [];
    event.content = templateFileContent;

    await event.sign();
    await event.publish();

    setLoadValue(event.encode());
  }, [templateFileContent]);

  const publishGameEvent = useCallback(async (content: string) => {
    if (!loadValue) {
      throw new Error('No entity');
    }

    const decoded = decode(loadValue);

    if (decoded.type != 'naddr') {
      throw new Error('Could not decode entity as naddr')
    }

    await ensureConnection();

    const event = new NDKEvent(client);
    event.kind = 1;
    event.tags = [
      ["a", `30023:${decoded.data.pubkey}:${decoded.data.identifier}`]
    ];
    event.content = content;

    await event.sign();
    await event.publish();

  }, [loadValue]);

  return {
    publishTemplate,
    publishGameEvent,
    loadEvents,
    loadValue,
    setLoadValue,
    seedValue,
    setSeedValue,
    relays: client.pool?.relays
  };
};

async function ensureConnection() {
  if (!client.signer) {
    throw new Error('No signer!');
  }
  const user = await client.signer.user();
  client.activeUser = user;
  await client.connect();
}

