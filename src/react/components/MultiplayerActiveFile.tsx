import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';

import { BIP32Factory, BIP32Interface } from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';

import { ECPairFactory, ECPairAPI, ECPairInterface } from 'ecpair';

import * as nobleSecp256k1 from 'noble-secp256k1';

import { useWebApp } from '../../../web/src/hooks.web.js';

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

function getPubKey(privKey: string): string {
  return nobleSecp256k1.getPublicKey(privKey, true).substring(2);
}

function getKeys(): [string, string] {
  const privKey = getPrivKeyHex();
  const pubKey = getPubKey(privKey);
  return [privKey, pubKey];
}

let websockets: WebSocket[] = [];
const eventIds: { [key: string]: boolean } = {};


const relays = [
  // 'wss://relay.snort.social',
  // 'wss://nos.lol',
  'wss://relay.damus.io'
]

function openWebsockets(pubKey: string, handleEvent: Function): void {
  console.log('connecting...');
  for (const relay of relays) {
    const ws = new WebSocket(relay);
    websockets.push(ws);
    addEventListeners(ws, pubKey, handleEvent);
  }
}

function addEventListeners(ws: WebSocket, pubKey: string, handleEvent: Function): void {
  ws.onerror = () => handleError(ws);
  ws.onopen = () => handleOpen(ws, pubKey);
  ws.onmessage = (event: MessageEvent) => handleMessage(event, pubKey, handleEvent);
}

function handleError(ws: WebSocket): void {
  websockets = websockets.filter((w) => w.url !== ws.url);
}

function handleOpen(ws: WebSocket, pubKey: string): void {
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

function handleMessage(event: MessageEvent, pubKey: string, handleEvent: Function): void {
  const [msgType, subscriptionId, data] = JSON.parse(event.data);

  if (msgType === 'EVENT') {
    handleEvent(data, subscriptionId, pubKey);
  } else {
    console.log('Unknown EVENT', event)
  }
}

export const MultiplayerActiveFile = () => {
  const webAppContext = useWebApp();

  if (!webAppContext) {
    throw new Error('useWebApp must be used within a WebAppProvider');
  }

  const { setActiveFile } = webAppContext;

  console.log('rendering...');

  const [status, setStatus] = useState('connecting');

  const handleEvent = (data: any, pubKey: string): void => {
    const { content, id, sig, kind} = data;
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

  useEffect(() => {
    const [privKey, pubKey] = getKeys();
    openWebsockets(pubKey, handleEvent);
    setStatus('connected');
    
    return () => {
      console.log('Component unmounting');
      websockets.map((ws) => ws.close());
    };

  }, []);

  return (
    <span>{status}</span>
  );
};

export default MultiplayerActiveFile;

