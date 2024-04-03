import React from 'react';
import { GameEvent } from '../../parse/parse-events.js';

export const EventsDisplay: React.FC<{ events: GameEvent[]; }> = ({ events }) => (
  <p>In this game there are {events.length} events played so far.</p>
);
