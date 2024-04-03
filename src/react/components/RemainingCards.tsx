import React from 'react';
import type { CardWithRef } from '../../parse/parse-template.js';


export const RemainingCards: React.FC<{ remainingCards: CardWithRef[]; }> = ({ remainingCards }) => (
  <p>There are {remainingCards.length} cards remaining.</p>
);
