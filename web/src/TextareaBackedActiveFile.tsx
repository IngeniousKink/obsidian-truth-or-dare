import React from 'react';
import { useInMemoryTemplate } from '../../src/InMemoryTemplateContext.js';

export const TextareaBackedActiveFile = () => {

  const value = useInMemoryTemplate();
  if (!value) return null;

  const {
    templateFileContent,
    setTemplateFileContent,
    eventsFileContent
  } = value;

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
