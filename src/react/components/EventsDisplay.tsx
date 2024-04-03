import { GameEvent } from '@obsidian-truth-or-dare/events.js';
import React from 'react';

export const EventsDisplay: React.FC<{ events: GameEvent[]; }> = ({ events }) => (
  <p>In this game there are {events.length} events played so far.</p>
);
