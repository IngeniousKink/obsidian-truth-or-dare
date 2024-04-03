
import { useCallback, useEffect, useContext } from 'react';
import { Buffer } from 'buffer';

import { BIP32Factory } from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';

import * as nip19 from 'nostr-tools/nip19'

import { ECPairFactory, ECPairAPI } from 'ecpair';

import { sha256 } from 'bitcoinjs-lib/src/crypto.js';
import { MultiplayerContext } from './MultiplayerContext.js';
import { useInMemoryTemplate } from '@obsidian-truth-or-dare/InMemoryTemplateContext.js';

const ECPair: ECPairAPI = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

type WebSocketStates = {
  [key: number]: string;
};

const WEBSOCKET_STATES: WebSocketStates = {
  0: '🟡 CONNECTING',
  1: '🟢 OPEN',
  2: '🟠 CLOSING',
  3: '🔴 CLOSED',
};

const relays = [
  'wss://relay.snort.social',
  'wss://nos.lol',
  'wss://relay.damus.io',
  'wss://offchain.pub',
]

const messagesToSendOnEstablishedConnection: string[] = [];

export const useMultiplayer = () => {
  const multiplayerContext = useContext(MultiplayerContext);

  if (!multiplayerContext) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }

  const { websockets, setWebsockets, eventIds, setEventIds, loadValue, setLoadValue, seedValue, setSeedValue } = multiplayerContext;

  const templateValue = useInMemoryTemplate();

  if (!templateValue) {
    throw new Error('useMultiplayer must be used within a InMemoryTemplateProvider');
  }

  const { templateFileContent, setTemplateFileContent, setEventsFileContent } = templateValue;

  const handleMessage = (event: MessageEvent): void => {
    const [msgType, subscriptionId, data] = JSON.parse(event.data);

    if (msgType === 'EVENT') {
      handleEvent(data);
    } else {
      console.log('Unknown EVENT', [msgType, subscriptionId, data])
    }
  }

  const openWebsockets = (): void => {
    console.log('connecting...');
    for (const relay of relays) {
      const ws = new WebSocket(relay);
      websockets.push(ws);
      addEventListeners(ws);
    }
  };

  const addEventListeners = (ws: WebSocket): void => {
    ws.onerror = (error: ErrorEvent) => {
      console.log('HANDLE ERROR! Error occurred:', error.message);
      setWebsockets(websockets.filter((w) => w.url !== ws.url));
    };
    ws.onopen = () => {
      console.log(`Connected to relay ${ws.url}`);

      messagesToSendOnEstablishedConnection.forEach((message) => {
        ws.send(message);
      });
    };
    ws.onmessage = (event: MessageEvent) => handleMessage(event);
    ws.onclose = (event: CloseEvent) => {
      console.log(`Socket closed. Reason: ${event.reason ? event.reason : 'None provided'}. Code: ${event.code}`);
    };
  };


  const handleEvent = (data: { content: string, id: string, kind: number, pubkey: string }): void => {
    const { content, id, kind } = data;

    if (eventIds[id]) return;
    eventIds[id] = true;

    console.log('From relay:', content);

    if (kind === 30023) {
      setTemplateFileContent(content);
    } else if (kind === 1) {
      setEventsFileContent((data: string) => `${data}\n${content}`);
    } else {
      console.log('Unknown kind:', kind, data);
    }
  };

  const loadEvents = useCallback(() => {
    if (!loadValue) {
      throw new Error('Invalid entity to load');
    }

    const decoded = nip19.decode(loadValue);

    if (decoded.type != 'naddr') { return; }

    if (websockets.length < 1) {
      openWebsockets();
    }

    messagesToSendOnEstablishedConnection.push(
      JSON.stringify(['REQ', 'kinds:30023', {
        "authors": [decoded.data.pubkey],
        "#d": [decoded.data.identifier]
      }])
    );

    messagesToSendOnEstablishedConnection.push(
      JSON.stringify(['REQ', 'kinds:1', {
        "#a": [`30023:${decoded.data.pubkey}:${decoded.data.identifier}`],
        "kinds": [1]
      }])
    );
  }, [loadValue]);

  const publishMultiplayerData = useCallback(async (kind: number, content: string, tags: string[][] = []) => {
    if (!seedValue) { return; }

    const node = bip32.fromSeed(Buffer.from(seedValue));
    const path = "m/44'/1237'/0'/0/0";

    const privKey = node.derivePath(path).privateKey

    if (!privKey) { return; }

    const keyPair = ECPair.fromPrivateKey(privKey);

    if (!keyPair) { return; }
    if (!keyPair.privateKey) { return; }

    const pubKey = keyPair.publicKey;

    const created_at = Math.floor(Date.now() / 1000);
    const event = [
      0,
      pubKey.toString('hex').substring(2),
      created_at,
      kind,
      tags,
      content
    ];
    const message = JSON.stringify(event);
    console.log('signing', message)

    const hash = sha256(Buffer.from(message));

    const sig = keyPair.signSchnorr(hash);
    const isValidSig = keyPair.verifySchnorr(hash, sig);

    if (isValidSig) {
      const fullevent = {
        id: hash.toString('hex'),
        pubkey: pubKey.toString('hex').substring(2),
        created_at,
        kind,
        tags,
        content,
        sig: sig.toString('hex')
      };
      const serializedEvent = JSON.stringify(['EVENT', fullevent]);
      console.log(`Publishing event to ${websockets.length} relays.`, serializedEvent);
      for (const ws of websockets) {
        ws.send(serializedEvent);
      }
    } else {
      console.error('Signature is invalid!');
    }
  }, [templateFileContent, websockets]);

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

    const decoded = nip19.decode(loadValue);

    if (decoded.type != 'naddr') { return; }

    publishMultiplayerData(
      kind,
      content,
      [
        ["a", `30023:${decoded.data.pubkey}:${decoded.data.identifier}`]
      ]
    );
  }, [loadValue, publishMultiplayerData]);

  useEffect(() => {
    return () => {
      console.log('Component with useMultiplayer unmounting');
    };
  }, []);

  return {
    publishTemplate,
    publishGameEvent,
    loadEvents,
    websockets,
    WEBSOCKET_STATES,
    loadValue,
    setLoadValue,
    seedValue,
    setSeedValue,
  };
};
