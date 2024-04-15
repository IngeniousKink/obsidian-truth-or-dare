// @vitest-environment jsdom

import * as React from 'react'
import * as renderer from 'react-test-renderer';

import { CardWithRef } from '@obsidian-truth-or-dare/parse/parse-template.js';

import { NoCard, DisplayedCard } from '@obsidian-truth-or-dare/react/components/DisplayedCard.js'
import { GameStateWithDisplayedCard, PlayView } from '@obsidian-truth-or-dare/react/components/PlayView.js';
import { InspectorView } from '@obsidian-truth-or-dare/react/components/InspectorView.js';
import CurrentCard from '@obsidian-truth-or-dare/react/components/CurrentCard.js';
import { expect, test } from 'vitest';

const testCard : CardWithRef = {
   text: 'Do something.',
   ref: 'ref1',
   annotations: [],
};

test('renders NoCard', () => {
  const tree = renderer
    .create(<NoCard />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});


test('renders CurrentCard', () => {
  const tree = renderer
    .create(<CurrentCard card={testCard} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders DisplayedCard = card', () => {
  const tree = renderer
    .create(<DisplayedCard card={testCard} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders DisplayedCard = null', () => {
  const tree = renderer
    .create(<DisplayedCard card={null} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

const testGameState : GameStateWithDisplayedCard = {
  "actors": [],
  "allocation": [],
  "preview": {
    "allocation": [],
  },
  "template": {
      "stacks": [
          {
              "name": "first stack",
              "ref": "#first stack",
              "cards": [
                  {
                      "ref": "#first stack^0",
                      "text": "one card",
                      "annotations": [],
                  }
              ]
          },
          {
              "name": "second stack",
              "ref": "#second stack",
              "cards": [
                  {
                      "ref": "#second stack^0",
                      "text": "first of two cards",
                      "annotations": [],
                  },
                  {
                      "ref": "#second stack^1",
                      "text": "second of two cards",
                      "annotations": [],
                  }
              ]
          }
      ]
  },
  "events": [
      {
          "type": "draw_card",
          "timestamp": 1706983496470,
          "cardRef": "#first stack^0"
      }
  ],
  "previousCards": [],
  "seed": "{\"stacks\":[{\"name\":\"first stack\",\"ref\":\"#first stack\",\"cards\":[{\"ref\":\"#first stack^0\",\"text\":\"one card\"}]},{\"name\":\"second stack\",\"ref\":\"#second stack\",\"cards\":[{\"ref\":\"#second stack^0\",\"text\":\"first of two cards\"},{\"ref\":\"#second stack^1\",\"text\":\"second of two cards\"}]}]}[{\"type\":\"card-draw\",\"timestamp\":1706983496470,\"card\":\"#first stack^0\"}]",
  "displayedCard": "#first stack^0"
};

test('renders PlayView', () => {

  const tree = renderer
    .create(<PlayView gameState={testGameState} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders InspectorView', () => {
  const tree = renderer
    .create(<InspectorView gameState={testGameState} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});