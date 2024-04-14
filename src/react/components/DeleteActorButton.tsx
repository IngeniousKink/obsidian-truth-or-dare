import React from 'react';
import { deleteActor, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useDispatchGameEventHook } from '../dispatchEvent.js';
import { RiDeleteBin7Line } from '@remixicon/react';
import { Button } from '@tremor/react';

interface DeleteActorButtonProps {
  id: string;
}

export const DeleteActorButton: React.FC<DeleteActorButtonProps> = ({ id }) => {
  const useDispatchGameEvent = useDispatchGameEventHook();
  const dispatchGameEvent = useDispatchGameEvent();

  const handleDeleteActor = () => {
    const event = timestampEvent(deleteActor(id));
    dispatchGameEvent(event);
  };

  return <Button icon={RiDeleteBin7Line} onClick={handleDeleteActor}></Button>;
};
