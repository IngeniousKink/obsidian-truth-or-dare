
import React from 'react';
import { DeleteActorButton } from './DeleteActorButton.js';
import { ChangeActorNameInput } from './ChangeActorNameInput.js';
import { AddActorButton } from './AddActorButton.js';
import { Actor } from '@obsidian-truth-or-dare/gamestate.js';

export const ActorList: React.FC<{ actors: Actor[]; }> = ({ actors }) => {

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
