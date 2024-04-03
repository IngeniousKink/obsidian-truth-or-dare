import React, { useCallback, useEffect, useState } from 'react';
import { Buffer } from 'buffer';

import { BIP32Factory, BIP32Interface } from 'bip32';
import ecc, { signSchnorr, verifySchnorr } from '@bitcoinerlab/secp256k1';

import { ECPairFactory, ECPairAPI, ECPairInterface } from 'ecpair';

import * as nobleSecp256k1 from '@noble/secp256k1';

import { useWebApp } from '../../../web/src/hooks.web.js';
import { sha256 } from 'bitcoinjs-lib/src/crypto.js';

type HandleEventFunction = (data: { content: string, id: string, kind: number}, pubKey: string) => void;

const ECPair: ECPairAPI = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

function getParamsFromHash(): {
  id: string | null,
  author: string | null,
  seed: string | null
} {
  const hashParams = new URLSearchParams(
    window.location.hash.slice(1) // remove the '#'
  );
  const id = hashParams.get('id');
  const author = hashParams.get('author');
  let seed = hashParams.get('seed');

  // If seed is not present, add it to the URL's hash part and call the function again
  if (!seed) {
    seed = Math.random().toString(36).substring(2, 10) +
           Math.random().toString(36).substring(2, 10);
    hashParams.set('seed', seed);
    window.location.hash = hashParams.toString();
    return getParamsFromHash();
  }

  return { id, author, seed };
}

function getSeed(): Buffer {
  const { seed } = getParamsFromHash();
  if (seed === null) {
      throw new Error('Seed is null');
  }
  return Buffer.from(seed);
}


function getNode(): BIP32Interface {
  return bip32.fromSeed(getSeed());
}

function getPath(): string {
  return "m/44'/1237'/0'/0/0";
}

function computeRawPrivkey(node: BIP32Interface): ECPairInterface | undefined {
  if (!node.privateKey) {
    throw new Error('Private key is undefined');
  }
  return ECPair.fromPrivateKey(node.privateKey);
}

function getPrivKeyHex(): string {
  const node = getNode();
  const path = getPath();
  const keyPair = computeRawPrivkey(node.derivePath(path));

  if (!keyPair || !keyPair.privateKey) {
    throw new Error('Unable to compute private key');
  }

  return keyPair.privateKey.toString('hex');
}

function getPubKey(privKey: string) : Uint8Array {
  return nobleSecp256k1.getPublicKey(privKey, true);
}

function getKeys(): [string, Uint8Array] {
  const privKey = getPrivKeyHex();
  const pubKey = getPubKey(privKey);
  return [privKey, pubKey];
}

let websockets: WebSocket[] = [];
const eventIds: { [key: string]: boolean } = {};


const relays = [
  'wss://relay.snort.social',
  'wss://nos.lol',
  'wss://relay.damus.io',
  'wss://offchain.pub',
]

function openWebsockets(pubKey: Uint8Array, handleEvent: HandleEventFunction): void {
  console.log('connecting...');
  for (const relay of relays) {
    const ws = new WebSocket(relay);
    websockets.push(ws);
    addEventListeners(ws, pubKey, handleEvent);
  }
}

function addEventListeners(ws: WebSocket, pubKey: Uint8Array, handleEvent: HandleEventFunction): void {
  ws.onerror = () => handleError(ws);
  ws.onopen = () => handleOpen(ws, pubKey);
  ws.onmessage = (event: MessageEvent) => handleMessage(event, pubKey, handleEvent);
}

function handleError(ws: WebSocket): void {
  console.log('HANDLE ERROR!');
  websockets = websockets.filter((w) => w.url !== ws.url);
}

function handleOpen(ws: WebSocket, pubKey: Uint8Array): void {
  const status = `${websockets.length}/${relays.length}`;
  console.log('#relay', `Connected to ${status} relays`);

  const { id, author } = getParamsFromHash();

  if (!id || !author) {
    throw new Error('Missing id or author in URL hash parameters');
  }

  ws.send(JSON.stringify(['REQ', 'kinds:30023', {
    "authors": [author],
    "#d": [id]
  }]));

  ws.send(JSON.stringify(['REQ', 'kinds:1', {
    "#a": [`30023:${author}:${id}`],
    "kinds": [1]
  }]));
}

function handleMessage(event: MessageEvent, pubKey: Uint8Array, handleEvent: HandleEventFunction): void {
  const [msgType, subscriptionId, data] = JSON.parse(event.data);

  if (msgType === 'EVENT') {
    handleEvent(data, subscriptionId);
  } else {
    console.log('Unknown EVENT', [msgType, subscriptionId, data])
  }
}

export const MultiplayerActiveFile = () => {
  const webAppContext = useWebApp();

  if (!webAppContext) {
    throw new Error('useWebApp must be used within a WebAppProvider');
  }

  const { setActiveFile, activeFile } = webAppContext;

  console.log('rendering...');

  const [status, setStatus] = useState('connecting');

  const handleEvent = (data: { content: string, id: string, kind: number}, pubKey: string): void => {
    const { content, id, kind } = data;
    if (eventIds[id]) return;
    eventIds[id] = true;

    console.log('From relay:', content);

    if (kind === 30023) {
      setActiveFile(content);
    } else if (kind === 1) {
      setActiveFile((prevState : string) => prevState.concat('\n').concat(content));
    } else {
      console.log('Unknown kind:', kind, data);
    }
  };

    // Wrap publish function in useCallback to prevent unnecessary re-renders
    const publish = useCallback(async () => {

      const node = getNode();
      const path = getPath();
      const keyPair = computeRawPrivkey(node.derivePath(path));


      if(!keyPair) { return; }
      if(!keyPair.privateKey) { return; }

      const pubKey = keyPair.publicKey;

      const content = activeFile;
      const created_at = Math.floor(Date.now() / 1000);
      const kind = 30023;
      const tags : string[] = [];
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
          console.log('Publishing to', ws.url);
          ws.send(serializedEvent);
        }
      }
    }, [activeFile]); // Add activeFile as a dependency
  

  useEffect(() => {
    const pubKey = getKeys()[1];
    openWebsockets(pubKey, handleEvent);
    setStatus('connected');
    
    return () => {
      console.log('Component unmounting');
      websockets.map((ws) => ws.close());
    };

  }, []);

  return (
    <>
      <button onClick={publish}>Publish</button>
      <span>{status}</span>
    </>
  );
};

export default MultiplayerActiveFile;

