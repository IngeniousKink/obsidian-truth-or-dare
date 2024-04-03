import React from 'react';
import { Buffer } from 'buffer';

import { BIP32Factory, BIP32Interface } from 'bip32';
import ecc from '@bitcoinerlab/secp256k1';

import { ECPairFactory, ECPairAPI, ECPairInterface } from 'ecpair';

// You need to provide the ECC library. The ECC library must implement 
// all the methods of the `TinySecp256k1Interface` interface.
const ECPair: ECPairAPI = ECPairFactory(ecc);

const bip32 = BIP32Factory(ecc);

const existingEvent = {
  "id": "1c7ea8500d565900fa5c0a0cc87c2b33d51a12dd59ab3c4239cf8e6e31bc7d4d",
  "pubkey": "aab1c430d0505289522ce0f28378d88f143bd3a2252ac3193d3c1f23e3b58632",
  "created_at": 1710305239,
  "kind": 30023,
  "tags": [
    [
      "d",
      "1710305134263"
    ],
    [
      "title",
      "A game"
    ],
    [
      "summary",
      ""
    ],
    [
      "published_at",
      "1710305239"
    ],
    [
      "alt",
      "This is a long form article, you can read it in https://habla.news/a/naddr1qqxnzde3xqenqdf3xv6ryd3nqgs24vwyxrg9q55f2gkwpu5r0rvg79pm6w3z22krry7nc8eruw6cvvsrqsqqqa28j95fz9"
    ]
  ],
  "content": "This is your new *vault*.\n\nMake a note of something, [[create a link]], or try [the Importer](https://help.obsidian.md/Plugins/Importer)!\n\nWhen you're ready, delete this note and make the vault your own.\n\n* How about this external image ? ![Bondage|200](https://64.media.tumblr.com/998a6bddbab5b819bc82004fb4f64ae8/bbbd6aed813d8a59-67/s1280x1920/88d703d548d0c24ca8315259fc370355780c900f.jpg)\n\n\n```truth-or-dare:event\ntype:card-draw\ntimestamp:1708255295499\ncard: ^0\n```\n",
  "sig": "d3308a56a92070a4b9682dc12554d3b2cb670d362b6f431d300e9d9afdad2d8dc98648b0f4a3f7a5ad88eea42742dfada3b1f1f9bf9b1e73b830f4af61a2caa8"
}

import * as nobleSecp256k1 from 'noble-secp256k1';

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

function openWebsockets(relays: string[], pubKey: string): void {
  for (const relay of relays) {
    const ws = new WebSocket(relay);
    websockets.push(ws);
    addEventListeners(ws, pubKey);
  }
}

function addEventListeners(ws: WebSocket, pubKey: string): void {
  ws.onerror = () => handleError(ws);
  ws.onopen = () => handleOpen(ws, pubKey);
  ws.onmessage = (event: MessageEvent) => handleMessage(event, pubKey);
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

function handleMessage(event: MessageEvent, pubKey: string): void {
  const [msgType, subscriptionId, data] = JSON.parse(event.data);

  if (msgType === 'EVENT' && subscriptionId === 'with-item') {
    handleEvent(data, pubKey);
  }
}

function handleEvent(data: any, pubKey: string): void {
  const { content, id, sig } = data;
  if (eventIds[id]) return;
  eventIds[id] = true;
  // nobleSecp256k1.schnorr.verify(sig, id, pubKey).then((validSig) => {
  //   if (validSig) {
      onNostr(content);
  //   }
  // });
}

function sendPing(ws: WebSocket): void {
  setInterval(() => ws.send(JSON.stringify({ event: 'ping' })), 10000);
}

function onDragStart(source: string, piece: string): void {
  console.log('Event: onDragStart', 'Source:', source, 'Piece:', piece);
  // Your existing code here...
}

function onDrop(source: string, target: string): void {
  console.log('Event: onDrop', 'Source:', source, 'Target:', target);
  // Your existing code here...
}

function onSnapEnd(): void {
  console.log('Event: onSnapEnd');
  // Your existing code here...
}

function onNostr(data: any): void {
  console.log('Event: onNostr', data);
  // Your existing code here...
}

function onFen(): void {
  console.log('Event: onFen');
  // Your existing code here...
}

// Initialize
const [privKey, pubKey] = getKeys();
const relays = [
  'wss://relay.snort.social',
  'wss://nostr.wine/',
  'wss://nos.lol',
]

export const MultiplayerActiveFile = () => {

  openWebsockets(relays, pubKey);

  return (
    <span>connecting</span>
  );
};
