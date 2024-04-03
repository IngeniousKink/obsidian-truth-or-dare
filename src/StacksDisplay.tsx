import React from 'react';
import type { Stack } from './parse-template.js';

export const StacksDisplay: React.FC<{ stacks: Stack[]; }> = ({ stacks }) => {
  return <pre>{JSON.stringify(stacks, undefined, 2)}</pre>;
};
