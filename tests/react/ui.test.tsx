import * as React from 'react'
import * as renderer from 'react-test-renderer';

import { Card } from 'src/parse-template.js';

import { NoCard, CurrentCard, DisplayedCard } from '@obsidian-truth-or-dare/DisplayedCard.js'
import { PlayView } from '@obsidian-truth-or-dare/PlayView.js';
import { InspectorView } from '@obsidian-truth-or-dare/InspectorView.js';

const testCard : Card = { text: 'Do something.', ref: 'ref1'};

it('renders NoCard', () => {
  const tree = renderer
    .create(<NoCard />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});


it('renders CurrentCard', () => {
  const tree = renderer
    .create(<CurrentCard card={testCard} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders DisplayedCard = card', () => {
  const tree = renderer
    .create(<DisplayedCard card={testCard} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders DisplayedCard = null', () => {
  const tree = renderer
    .create(<DisplayedCard card={null} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

const testGameState = {
  "template": {
      "stacks": [
          {
              "name": "first stack",
              "ref": "#first stack",
              "cards": [
                  {
                      "ref": "#first stack^0",
                      "text": "one card"
                  }
              ]
          },
          {
              "name": "second stack",
              "ref": "#second stack",
              "cards": [
                  {
                      "ref": "#second stack^0",
                      "text": "first of two cards"
                  },
                  {
                      "ref": "#second stack^1",
                      "text": "second of two cards"
                  }
              ]
          }
      ]
  },
  "events": [
      {
          "type": "card-draw",
          "timestamp": 1706983496470,
          "card": "#first stack^0"
      }
  ],
  "previousCards": [],
  "seed": "{\"stacks\":[{\"name\":\"first stack\",\"ref\":\"#first stack\",\"cards\":[{\"ref\":\"#first stack^0\",\"text\":\"one card\"}]},{\"name\":\"second stack\",\"ref\":\"#second stack\",\"cards\":[{\"ref\":\"#second stack^0\",\"text\":\"first of two cards\"},{\"ref\":\"#second stack^1\",\"text\":\"second of two cards\"}]}]}[{\"type\":\"card-draw\",\"timestamp\":1706983496470,\"card\":\"#first stack^0\"}]",
  "displayedCard": "#first stack^0"
};

it('renders PlayView', () => {
  const tree = renderer
    .create(<PlayView gameState={testGameState} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders InspectorView', () => {
  const tree = renderer
    .create(<InspectorView gameState={testGameState} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});