
import React from 'react';
import { DeleteActorButton } from './DeleteActorButton.js';
import { ChangeActorNameInput } from './ChangeActorNameInput.js';
import { AddActorButton } from './AddActorButton.js';

export const ActorList: React.FC<{ actors: any[]; }> = ({ actors }) => {
  return (
    <div>
      {actors.map((actor) => (
        <span key={actor.id}>
          <ChangeActorNameInput name={actor.name} actorId={actor.id} />
          <DeleteActorButton id={actor.id} />
          <br />
        </span>
      ))}
      <AddActorButton />
    </div>
  );
};
