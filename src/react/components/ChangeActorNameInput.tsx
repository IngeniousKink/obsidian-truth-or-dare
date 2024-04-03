import React, { useState } from 'react';
import { changeActorName, timestampEvent } from '@obsidian-truth-or-dare/events.js';
import { useDispatchGameEventHook } from '../dispatchEvent.js';

interface ChangeActorNameInputProps {
  actorId: string;
  name: string;
}

function debounce<F extends (...args: unknown[]) => unknown>(fn: F, delay: number) {
  let timeoutID: NodeJS.Timeout | null = null;
  return (...args: Parameters<F>): void => {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    timeoutID = setTimeout(() => fn(...args), delay);
  };
}

export const ChangeActorNameInput: React.FC<ChangeActorNameInputProps> = ({ actorId, name }) => {
  const [inputValue, setInputValue] = useState(name);
  const useDispatchGameEvent = useDispatchGameEventHook();
  const dispatchGameEvent = useDispatchGameEvent();

  const handleNameChange = (newName: string) => {
    if (!actorId || name === newName) return;

    const gameEvent = timestampEvent(changeActorName(actorId, newName));
    dispatchGameEvent(gameEvent);
  };

  const debouncedChange = debounce(handleNameChange, 300);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedChange(event.target.value);
  };

  const handleBlur = () => {
    handleNameChange(inputValue);
  };

  return (
    <input
      type="text"
      placeholder="Enter new name"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};
