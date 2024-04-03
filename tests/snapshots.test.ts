
import { fromMarkdown } from 'mdast-util-from-markdown';
import { getCardsUnderHeading } from '../parse.js';

test.each([
    'FULL_TIME',
    'PART_TIME',
    'SELF_EMPLOYED',
    'UNEMPLOYED',
    'RETIRED',
])('can set employment type to %s', (type) => {

    const fileContents = `
# Heading
* card 1
* ` + type;
    const mast = fromMarkdown(fileContents);
    const result = getCardsUnderHeading(mast);

    expect(result).toMatchSnapshot();
});
