import React from 'react';
import { createActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useDispatchGameEventHook } from '../dispatchEvent.js';
import { RiUserAddLine } from '@remixicon/react';

import { Button } from '@tremor/react';

export const AddActorButton: React.FC = () => {
  const useDispatchGameEvent = useDispatchGameEventHook();
  const dispatchGameEvent = useDispatchGameEvent();

  const handleAddActor = () => {
    const event = timestampEvent(createActor());
    dispatchGameEvent(event);
  };

  return <Button icon={RiUserAddLine} onClick={handleAddActor}>Add Player</Button>;
};
