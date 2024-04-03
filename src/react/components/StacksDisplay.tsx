import React from 'react';
import type { Stack } from '../../parse/parse-template.js';

export const StacksDisplay: React.FC<{ stacks: Stack[]; }> = ({ stacks }) => {
  return <>
    <pre style={{ fontSize: "80%" }}>{JSON.stringify(stacks, undefined, 2)}</pre>;
  </>
}
