import { PhrasingContent } from 'node_modules/mdast-util-from-markdown/lib/index.js';
import { parseEmbeds } from '../src/parse/parse-embeds.js';

describe('parse-embeds', () => {
  test('embed at start of textNode', () => {
    const value = "![[a_video.mp4]] and here goes some text";

    const result = parseEmbeds([
      {
        value,
        "position": {
          "start": {
            "column": 1,
            "line": 1,
            "offset": 0,
          },
          "end": {
            "column": value.length + 1,
            "line": 1,
            "offset": value.length,
          },
        },
        "type": "text",
      },
    ]);

    expect(result as any).toEqual([
      {
        "position": {
          "start": { "column": 1, "line": 1, "offset": 0, },
          "end": { "column": 12, "line": 1, "offset": 11, },
        },
        "type": "image",
        "url": "a_video.mp4",
      },
      {
        "position": {
          "start": { "column": 17, "line": 1, "offset": 16, },
          "end": { "column": 41, "line": 1, "offset": 40, },
        },
        "type": "text",
        "value": " and here goes some text",
      }]
    );
    expect(result.length).toBe(2);
  });

  test('embed at end of textNode', () => {
    const value = "And here is another video: ![[another_video.mp4]]";
    const result = parseEmbeds([{
      value,
      "type": "text",
      "position": {
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
        "end": {
          "column": value.length + 1,
          "line": 1,
          "offset": value.length,
        }
      }
    }]);
    expect(result).toMatchSnapshot();
    expect(result.length).toBe(2);
  });

  test('embed in the middle of a textNode', () => {
    const value = "First some text ![[then_a_video.mp4]] then some more text";

    const result = parseEmbeds([{
      value,
      "type": "text",
      "position": {
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
        "end": {
          "column": value.length + 1,
          "line": 1,
          "offset": value.length,
        }
      }
    }]);
    expect(result).toMatchSnapshot();
    expect(result.length).toBe(3);
  });

  test('two embeds', () => {
    const value = "text ![[video1.mp4]] and ![[picture2.webp]] the end";
    const result = parseEmbeds([{
      value,
      "type": "text",
      "position": {
        "start": {
          "line": 1,
          "column": 3,
          "offset": 72
        },
        "end": {
          "column": value.length + 1,
          "line": 1,
          "offset": value.length,
        }
      }
    }]);
    expect(result).toMatchSnapshot();
    expect(result.length).toBe(5);
  });


  test('embed with size info', () => {

    const value = "Here's an embedded picture: ![[a_picture.webp|100]]";

    const result = parseEmbeds([{
      value,
      "type": "text",
      "position": {
        "start": {
          "column": 1,
          "line": 1,
          "offset": 0,
        },
        "end": {
          "column": value.length + 1,
          "line": 1,
          "offset": value.length,
        }
      }
    }]);
    expect(result).toMatchSnapshot();
    expect(result.length).toBe(2);
  });


});



