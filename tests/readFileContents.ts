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
