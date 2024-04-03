import { fromMarkdown } from 'mdast-util-from-markdown';

import { convertMarkdownToGameTemplate } from '../src/parse-template.js';
import { convertMarkdownToGameEvents } from '../src/parse-events.js';
import { readFileContents } from './readFileContents.js';

Object.entries(readFileContents('parse-template')).forEach(([key, value]) => {
    test(`parses template: ${key}`, () => {
        const mast = fromMarkdown(value);
        const result = convertMarkdownToGameTemplate(mast);
        expect(result).toMatchSnapshot();
    });
});

Object.entries(readFileContents('parse-events')).forEach(([key, value]) => {
    test(`parses events: ${key}`, () => {
        const mast = fromMarkdown(value);
        const result = convertMarkdownToGameEvents(mast);
        expect(result).toMatchSnapshot();
    });
});
