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
    width: '50ch',
    height: '30em',
    position: 'absolute' as 'absolute',
    top: '0',
    left: '0',
    // display: 'none',
  };

  return (
    <textarea
      style={style}
      value={activeFile || ''}
      onChange={handleChange}
    />
  );
};
