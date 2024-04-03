import { fromMarkdown } from 'mdast-util-from-markdown';
import { markdownToGameState } from '../src/parse.js';
import fs, { read } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readFileContents() {
    const directoryPath = path.join(__dirname, '__markdown_test_cases__');
    let fileContentsMap: { [key: string]: string } = {};

    const files = fs.readdirSync(directoryPath);
    for (const fileName of files) {
        const filePath = path.join(directoryPath, fileName);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        fileContentsMap[fileName] = fileContents;
    }
    return fileContentsMap;
}

test.each(
    Object.values(
        readFileContents()
    )
)('parses correctly:\n%s', (fileContents) => {
    const mast = fromMarkdown(fileContents);
    const result = markdownToGameState(mast);

    expect(result).toMatchSnapshot();
});
