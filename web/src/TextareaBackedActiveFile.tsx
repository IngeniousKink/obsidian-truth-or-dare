import React from 'react';
import { useWebApp } from './hooks.web.js';

export const TextareaBackedActiveFile = () => {

  const app = useWebApp();
  if (!app) return null;

  const { activeFile, setActiveFile } = app;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setActiveFile(event.target.value);
  };

  const style = {
    width: '100%',
    height: '30em',
  };

  return (

    <fieldset>
      <legend>Template</legend>

      <textarea
        style={style}
        value={activeFile || ''}
        onChange={handleChange}
      />
    </fieldset>
  );
};
