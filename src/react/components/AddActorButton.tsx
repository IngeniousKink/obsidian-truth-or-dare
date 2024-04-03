import React from 'react';
import { createActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useAppendGameEvent } from "@obsidian-truth-or-dare/hooks.js";

export const AddActorButton: React.FC = () => {
  const appendEvent = useAppendGameEvent();

  const handleAddActor = () => {
    const event = timestampEvent(createActor());
    appendEvent(event);
  };

  const buttonText = "➕ Add player";

  return <button onClick={handleAddActor}>{buttonText}</button>;
};
