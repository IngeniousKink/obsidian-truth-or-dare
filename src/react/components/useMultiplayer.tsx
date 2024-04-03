
import React, { useCallback, useEffect, useContext } from 'react';
import { Buffer } from 'buffer';

import { BIP32Factory, BIP32Interface } from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';

import * as nip19 from 'nostr-tools/nip19'

import { ECPairFactory, ECPairAPI, ECPairInterface } from 'ecpair';

import * as nobleSecp256k1 from '@noble/secp256k1';
import { useWebApp } from '../../../web/src/hooks.web.js';
import { sha256 } from 'bitcoinjs-lib/src/crypto.js';
import { MultiplayerContext } from './MultiplayerContext.js';

type HandleEventFunction = (data: { content: string, id: string, kind: number }, pubKey: string) => void;

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

export const useMultiplayer = () => {
  const multiplayerContext = useContext(MultiplayerContext);

  if (!multiplayerContext) {
    throw new Error('useMultiplayer must be used within a MultiplayerProvider');
  }

  const { websockets, setWebsockets, eventIds, setEventIds, loadValue, setLoadValue, seedValue, setSeedValue } = multiplayerContext;

  const webAppContext = useWebApp();

  if (!webAppContext) {
    throw new Error('useWebApp must be used within a WebAppProvider');
  }

  const { templateFileContent, setTemplateFileContent, setEventsFileContent } = webAppContext;

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
    ws.onopen = () => console.log(`Connected to relay ${ws.url}`);
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
      setEventsFileContent((prevState: string) => (prevState || "").concat('\n').concat(content));
    } else {
      console.log('Unknown kind:', kind, data);
    }
  };

  const loadEvents = useCallback(() => {
    if (!loadValue) {
      throw new Error('Missing load in URL hash parameters');
    }

    const decoded = nip19.decode(loadValue);

    if (decoded.type != 'naddr') { return; }

    for (const ws of websockets) {
      ws.send(JSON.stringify(['REQ', 'kinds:30023', {
        "authors": [decoded.data.pubkey],
        "#d": [decoded.data.identifier]
      }]));

      ws.send(JSON.stringify(['REQ', 'kinds:1', {
        "#a": [`30023:${decoded.data.pubkey}:${decoded.data.identifier}`],
        "kinds": [1]
      }]));
    }
  }, [loadValue]);

  const publish = useCallback(async () => {
    if (!seedValue) { return; }

    const node = bip32.fromSeed(Buffer.from(seedValue));
    const path = "m/44'/1237'/0'/0/0";

    const privKey = node.derivePath(path).privateKey

    if (!privKey) { return; }

    const keyPair = ECPair.fromPrivateKey(privKey);

    if (!keyPair) { return; }
    if (!keyPair.privateKey) { return; }

    const pubKey = keyPair.publicKey;

    const content = templateFileContent;
    const created_at = Math.floor(Date.now() / 1000);
    const kind = 30023;
    const tags: string[] = [];
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

  useEffect(() => {
    if (websockets.length < 1) {
      openWebsockets();
    }

    return () => {
      console.log('Component unmounting');
      websockets.map((ws) => ws.close());
      setWebsockets([]);
      setEventIds({});
    };
  }, []);

  return {
    publish,
    loadEvents,
    websockets,
    WEBSOCKET_STATES,
    loadValue,
    setLoadValue,
    seedValue,
    setSeedValue,
  };
};
