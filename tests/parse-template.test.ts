import { fromMarkdown } from 'mdast-util-from-markdown';
import { Paragraph } from 'node_modules/mdast-util-from-markdown/lib/index.js';

describe('parse-template', () => {

  test('document how mast-util-from-markdown parses images', () => {

    const fileContents = '123![](https://example.com/favicon.ico)456';

    const root = fromMarkdown(fileContents);
    
    const para = root.children[0] as Paragraph;

    expect(para.children).toMatchSnapshot();
    
    expect(para.children.length).toBe(3);
    expect(para.children[0].type).toBe('text');
    expect(para.children[1].type).toBe('image');
    expect(para.children[2].type).toBe('text');

  });


});



