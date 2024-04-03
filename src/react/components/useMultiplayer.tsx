import { useCallback, useEffect, useContext } from 'react';
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

  const { templateFileContent, setTemplateFileContent, setEventsFileContent } = templateValue;


  const loadEvents = useCallback(async () => {
    if (!loadValue) {
      throw new Error('Invalid entity to load');
    }
    if (!client.signer) {
      throw new Error('No signer!');
    }

    const decoded = decode(loadValue);

    if (decoded.type != 'naddr') { return; }

    const user = await client.signer.user();
    client.activeUser = user;

    await client.connect();

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

  const publishMultiplayerData = useCallback(async (kind: number, content: string, tags: string[][] = []) => {

    if (!client.signer) {
      return;
    }

    const event = new NDKEvent(client);
    event.kind = kind;
    event.tags = tags;
    event.content = content;

    await event.sign();
    await event.publish();

  }, [templateFileContent]);

  const publishTemplate = useCallback(async () => {
    const kind = 30023;
    if (!templateFileContent) return;

    publishMultiplayerData(kind, templateFileContent);
  }, [templateFileContent, publishMultiplayerData]);

  const publishGameEvent = useCallback(async (content: string) => {
    const kind = 1;

    if (!loadValue) {
      throw new Error('Unknown entity, unable to publish gameEvent');
    }

    const decoded = decode(loadValue);

    if (decoded.type != 'naddr') { return; }

    publishMultiplayerData(
      kind,
      content,
      [
        ["a", `30023:${decoded.data.pubkey}:${decoded.data.identifier}`]
      ]
    );
  }, [loadValue, publishMultiplayerData]);

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
