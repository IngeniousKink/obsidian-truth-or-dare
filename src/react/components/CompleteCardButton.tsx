import React from 'react';
import { RiCheckLine } from '@remixicon/react';
import { Button } from '@tremor/react';

import { completeCard, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useDispatchGameEventHook } from '../dispatchEvent.js';

interface CompleteCardButtonProps {
  cardRef: string;
}

export const CompleteCardButton: React.FC<CompleteCardButtonProps> = ({ cardRef }) => {
  const useDispatchGameEvent = useDispatchGameEventHook();
  const dispatchGameEvent = useDispatchGameEvent();

  const handleCompleteCard = () => {
    const event = timestampEvent(completeCard(cardRef));
    dispatchGameEvent(event);
  };

  return <Button icon={RiCheckLine} onClick={handleCompleteCard}>Card completed</Button>;
};

