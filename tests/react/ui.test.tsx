import * as React from 'react'
import * as renderer from 'react-test-renderer';

import { Card } from '../../src/parse-template';

import { NoCard, CurrentCard, DisplayedCard } from '../../src/DisplayedCard'

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