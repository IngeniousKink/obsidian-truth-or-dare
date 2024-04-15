
/**
 * 
 *  GENERATED FILE DO NOT EDIT
 * 
 */


import { fromMarkdown } from 'mdast-util-from-markdown';
import { convertMarkdownToGameTemplate } from '../src/parse/parse-template.js';
import { convertMarkdownToGameEvents } from '../src/parse/parse-events.js';
import { expect, test } from 'vitest';

const fixtures = {
  "parse-template": {
    "inline_fields_inline_html.md": "# HTML inline field\n\n* <span data-category=\"truth\" />\n\neven here is text",
    "inline_fields_inline_html_multiple.md": "# HTML inline field\n\n* <span data-category=\"truth\" />\n* <span data-category=\"truth\" /> * <span data-category=\"dare\" />\n* <span data-actor=\"0\" data-replace=\"name\">Peter</span> does something. <span data-category=\"dare\" />\n\neven here is text",
    "inline_fields_span_with_children.md": "# Span with children\n\n* one card: do something to <span data-replace=\"genitive\" data-actor=\"0\">a player's</span> hair. <span data-category=\"dare\" />",
    "media_embedded_image.md": "\n# List of one image\n* ![[MAM_8533239_SHOP_IMAGE_1.8.png 1.webp|100x100]]\n",
    "media_embedded_video_mp4.md": "With pictures!\n\n* And here is a video: ![[a_video.mp4]]",
    "media_image.md": "\n# List of one image\n* ![MAM_8533239_SHOP_IMAGE_1.8.png 1.webp]()\n",
    "media_image_external.md": "With pictures!\n\n* Here is an external image ![Sumatran Tiger](https://upload.wikimedia.org/wikipedia/commons/6/62/Panthera_tigris_sumatran_subspecies.jpg)",
    "media_image_external_html.md": "With pictures!\n\n* and an external image using HTML <img src=\"https://upload.wikimedia.org/wikipedia/commons/6/66/Adult_male_Royal_Bengal_tiger.jpg\" /> ..",
    "media_video_external_html.md": "With pictures!\n\n* Here's an embedded picture: ![[a_picture.webp|100]]\n* And here is a video: ![[a_video.mp4]]\n* Here is an external image ![Sumatran Tiger](https://upload.wikimedia.org/wikipedia/commons/6/62/Panthera_tigris_sumatran_subspecies.jpg)\n* and an external image using HTML <img src=\"https://upload.wikimedia.org/wikipedia/commons/6/66/Adult_male_Royal_Bengal_tiger.jpg\" /> ..\n* external video using HTML <video src=\"https://upload.wikimedia.org/wikipedia/commons/b/b2/A_walk_with_the_Tigress.webm\" />",
    "no_heading.md": "* this document has no heading\n* but two cards\n",
    "one_heading.md": "# a heading\n* card 1\n* card 1\n",
    "regression_html_tag_with_children.md": "# Regression HTML Tag with children\n\n* Do something <b>bold</b>!\n\neven here is text",
    "two_headings.md": "# Heading one\n* card 1\n* card 1\n\n# Heading two\n* foo\n* bar\n"
  },
  "parse-events": {
    "irrelevant_code_block.md": "\n## Events\n\n```truth-or-dare:event\ntype:draw_card\ntimestamp: 1706012788684\ncardRef: should be present in parsed result\n```\n\n```javascript\nTHIS SHOULD NOT BE PRESENT IN PARSED RESULT\n```\n\n",
    "simple.md": "\n## Events\n\n```truth-or-dare:event\ntype:draw_card\ntimestamp: 1706012788684\ncardRef: ^2\n```\n\n```truth-or-dare:event\ntype:draw_card\ntimestamp: 1706012792713\ncardRef: ^3\n```\n\n```truth-or-dare:event\ntype:draw_card\ntimestamp: 1706012795173\ncardRef: ^4\n```\n"
  }
};
// parse-template
    
test("parses template: inline_fields_inline_html.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['inline_fields_inline_html.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: inline_fields_inline_html_multiple.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['inline_fields_inline_html_multiple.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: inline_fields_span_with_children.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['inline_fields_span_with_children.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: media_embedded_image.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['media_embedded_image.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: media_embedded_video_mp4.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['media_embedded_video_mp4.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: media_image.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['media_image.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: media_image_external.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['media_image_external.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: media_image_external_html.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['media_image_external_html.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: media_video_external_html.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['media_video_external_html.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: no_heading.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['no_heading.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: one_heading.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['one_heading.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: regression_html_tag_with_children.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['regression_html_tag_with_children.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});
    
test("parses template: two_headings.md", () => {
    const mast = fromMarkdown(fixtures['parse-template']['two_headings.md']);
    const result = convertMarkdownToGameTemplate(mast);
    expect(result).toMatchSnapshot();
});

// parse-events

test("parses events: irrelevant_code_block.md", () => {
    const mast = fromMarkdown(fixtures['parse-events']['irrelevant_code_block.md']);
    const result = convertMarkdownToGameEvents(mast);
    expect(result).toMatchSnapshot();
});

test("parses events: simple.md", () => {
    const mast = fromMarkdown(fixtures['parse-events']['simple.md']);
    const result = convertMarkdownToGameEvents(mast);
    expect(result).toMatchSnapshot();
});

