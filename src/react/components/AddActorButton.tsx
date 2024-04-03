import React from 'react';
import { createActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useAppendEventToActiveFile } from "@obsidian-truth-or-dare/hooks.js";

export const AddActorButton: React.FC = () => {
  const event = timestampEvent(createActor());
  const addActor = useAppendEventToActiveFile(event);

  const buttonText = "➕ Add player";

  return <button onClick={addActor}>{buttonText}</button>;
};
