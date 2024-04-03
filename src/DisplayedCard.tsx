import * as React from 'react'
import CurrentCard from './CurrentCard.js';
import { ParsedCard } from './parse-card.js';

export const NoCard: React.FC = () => (
  <p>There is no card to display (yet).</p>
);

export const DisplayedCard: React.FC<{ card: ParsedCard | null; }> = ({ card }) => (
  card ? <CurrentCard card={card}/> : <NoCard/>
);