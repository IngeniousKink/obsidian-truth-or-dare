import React from 'react';
import type { CardMap } from 'parse';

export const StacksDisplay: React.FC<{ stacks: CardMap; }> = ({ stacks }) => {
  return <pre>{JSON.stringify(stacks, undefined, 2)}</pre>;
};
