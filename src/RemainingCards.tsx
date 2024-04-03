import React from 'react';
import type { Card } from './parse-template.js';


export const RemainingCards: React.FC<{ remainingCards: Card[]; }> = ({ remainingCards }) => (
  <p>There are {remainingCards.length} cards remaining.</p>
);
