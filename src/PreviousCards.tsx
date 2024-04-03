import React from 'react';


export const PreviousCards: React.FC<{ previousCards: string[]; }> = ({ previousCards }) => (
  <p>So far, {previousCards.length} cards have been played.</p>
);
