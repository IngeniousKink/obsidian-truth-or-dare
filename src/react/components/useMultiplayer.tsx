import { useCallback, useContext } from 'react';
import { MultiplayerContext } from './MultiplayerContext.js';
import { useInMemoryTemplate } from '@obsidian-truth-or-dare/InMemoryTemplateContext.js';
import NDK, { NDKEvent, NDKTag, NDKKind, NDKPrivateKeySigner, filterFromId } from "@nostr-dev-kit/ndk";

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

    await ensureConnection();

    const filter = filterFromId(loadValue);

    if (!filter.authors) { throw new Error('No author!'); }
    if (!filter['#d']) { throw new Error('No #d!'); }
    if (!filter.kinds) { throw new Error('No kinds!'); }

    client.subscribe(
      filter
    ).on('event', ((event: NDKEvent) => {
      setTemplateFileContent(event.content);
    }))

    client.subscribe({
      kinds: [1],
      '#a': [`${filter.kinds[0]}:${filter.authors[0]}:${filter['#d'][0]}`]
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
    event.kind = NDKKind.Article;
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

    await ensureConnection();

    const filter = filterFromId(loadValue);

    if (!filter.authors) { throw new Error('No author!'); }
    if (!filter['#d']) { throw new Error('No #d!'); }
    if (!filter.kinds) { throw new Error('No kinds!'); }

    const event = new NDKEvent(client);
    event.kind = NDKKind.Text;
    event.tags = [
      ["a", `${filter.kinds[0]}:${filter.authors[0]}:${filter['#d'][0]}`] as NDKTag
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

