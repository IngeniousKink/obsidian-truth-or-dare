import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';

import { BIP32Factory, BIP32Interface } from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';

import { ECPairFactory, ECPairAPI, ECPairInterface } from 'ecpair';

import * as nobleSecp256k1 from 'noble-secp256k1';

import { useWebApp } from '../../../web/src/hooks.web.js';

const ECPair: ECPairAPI = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);


function getSeed(): Buffer {
  return Buffer.from(window.location.toString());
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
  'wss://relay.snort.social',
  'wss://nostr.wine/',
  'wss://nos.lol',
]

function openWebsockets(pubKey: string, handleEvent: Function): void {
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
  const filter = {
    "authors": [
      "aab1c430d0505289522ce0f28378d88f143bd3a2252ac3193d3c1f23e3b58632"
    ],
    "#d": [
      "1710305134263"
    ]
  };
  ws.send(JSON.stringify(['REQ', 'with-item', filter]));
  sendPing(ws);
}

function handleMessage(event: MessageEvent, pubKey: string, handleEvent: Function): void {
  const [msgType, subscriptionId, data] = JSON.parse(event.data);

  if (msgType === 'EVENT' && subscriptionId === 'with-item') {
    handleEvent(data, pubKey);
  }
}

function sendPing(ws: WebSocket): void {
  setInterval(() => ws.send(JSON.stringify({ event: 'ping' })), 10000);
}

export const MultiplayerActiveFile = () => {
  const [status, setStatus] = useState('connecting');
  const { setActiveFile } = useWebApp();

  const handleEvent = (data: any, pubKey: string): void => {
    const { content, id, sig } = data;
    if (eventIds[id]) return;
    eventIds[id] = true;
    onNostr(content);
  };

  const onNostr = (data: any): void => {
    console.log('Event: onNostr', data);
    setActiveFile(data);
  };

  useEffect(() => {
    const [privKey, pubKey] = getKeys();
    openWebsockets(pubKey, handleEvent);
    setStatus('connected');
  }, []);

  return (
    <span>{status}</span>
  );
};

export default MultiplayerActiveFile;

