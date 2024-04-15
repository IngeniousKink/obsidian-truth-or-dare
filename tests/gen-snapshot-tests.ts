import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export function readFileContents(subFolder: string) {
    const directoryPath = path.join(__dirname, '__markdown_test_cases__', subFolder);
    const fileContentsMap: { [key: string]: string; } = {};

    const files = fs.readdirSync(directoryPath);
    for (const fileName of files) {
        if (path.extname(fileName) === '.md') {
            const filePath = path.join(directoryPath, fileName);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            fileContentsMap[fileName] = fileContents;
        }
    }
    return fileContentsMap;
}

console.log(`
/**
 * 
 *  GENERATED FILE DO NOT EDIT
 * 
 */


import { fromMarkdown } from 'mdast-util-from-markdown';
import { convertMarkdownToGameTemplate } from '../src/parse/parse-template.js';
import { convertMarkdownToGameEvents } from '../src/parse/parse-events.js';
import { expect, test } from 'vitest';
`);

const fixtures = {
    'parse-template': readFileContents('parse-template'),
    'parse-events': readFileContents('parse-events'),
};

console.log(
`const fixtures = ${JSON.stringify(fixtures, undefined, 2)};`
);

console.log(
`// parse-template`
);

console.log(

Object.entries(fixtures['parse-template']).map(([key, value]) => `    
test("parses template: ${key}", () => {
    const mast = fromMarkdown(fixtures['parse-template']['${key}']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
`).join('')

);

console.log(
`// parse-events`
);

console.log(

Object.entries(fixtures['parse-events']).map(([key, value]) => `
test("parses events: ${key}", () => {
    const mast = fromMarkdown(fixtures['parse-events']['${key}']);
    const result = convertMarkdownToGameEvents(mast);
    expect(result).toMatchSnapshot();
});
`).join('')

);
