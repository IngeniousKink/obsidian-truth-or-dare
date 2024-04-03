import React from 'react';
import { useWebApp } from './hooks.web.js';

export const TextareaBackedActiveFile = () => {

  const app = useWebApp();
  if (!app) return null;

  const {
    templateFileContent,
    setTemplateFileContent,
    eventsFileContent
  } = app;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplateFileContent(event.target.value);
  };

  const style = {
    width: '100%',
    height: '10em',
  };

  return (
    <>
      <fieldset>
        <legend>Template</legend>

        <textarea
          style={style}
          value={templateFileContent || ''}
          onChange={handleChange}
        />
      </fieldset>
      <fieldset>
        <legend>Events</legend>
        <textarea
          disabled
          style={style}
          value={eventsFileContent || ''}
        />
      </fieldset>
    </>
  );
};
