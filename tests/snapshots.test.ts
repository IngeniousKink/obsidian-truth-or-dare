
import { fromMarkdown } from 'mdast-util-from-markdown';
import { getCardsUnderHeading } from '../parse.js';

describe('getCardsUnderHeading', () => {
    it('renders correctly', () => {
        const fileContents = `
# Heading
* card 1
* card 2
        `;
        const mast = fromMarkdown(fileContents);
        const result = getCardsUnderHeading(mast);

        // Match the result to a snapshot
        expect(result).toMatchSnapshot();
    });
});
