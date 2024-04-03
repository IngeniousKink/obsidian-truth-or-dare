import React from 'react';
import { deleteActor } from '@obsidian-truth-or-dare/events.js';
import { useAppendEventToActiveFile } from '@obsidian-truth-or-dare/obsidian/hooks.js';

interface DeleteActorButtonProps {
  id: string;
}

export const DeleteActorButton: React.FC<DeleteActorButtonProps> = ({ id }) => {
  const deleteActorById = useAppendEventToActiveFile(deleteActor(id));
  
  const buttonText = "❌";

  return <button onClick={deleteActorById}>{buttonText}</button>;
};
