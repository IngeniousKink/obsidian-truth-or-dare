import { fromMarkdown } from 'mdast-util-from-markdown';

import { convertMarkdownToGameTemplate } from '../src/parse.js';
import { convertMarkdownToGameEvents } from '../src/parse-events.js';
import { readFileContents } from './readFileContents.js';


test.each(
    Object.values(
        readFileContents('parse-template')
    )
)('parses correctly:\n%s', (fileContents) => {
    const mast = fromMarkdown(fileContents);
    const result = convertMarkdownToGameTemplate(mast);

    expect(result).toMatchSnapshot();
});

test.each(
    Object.values(
        readFileContents('parse-events')
    )
)('parses events correctly:\n%s', (fileContents) => {
    const mast = fromMarkdown(fileContents);
    const result = convertMarkdownToGameEvents(mast);

    expect(result).toMatchSnapshot();
});
