import { parseEmbeds } from '../src/parse-embeds.js';

describe('parse-embeds', () => {
  test('embed at start of textNode', () => {
    const result = parseEmbeds([{
      "type": "text",
      "value": "![[a_video.mp4]] and here goes some text",
      "position": {
        "start": {
          "line": 4,
          "column": 3,
          "offset": 72
        },
        "end": {
          "line": 4,
          "column": 40,
          "offset": 109
        }
      }
    }]);
    expect(result).toMatchSnapshot();
    expect(result.length).toBe(2);
  });

  test('embed at end of textNode', () => {
    const result = parseEmbeds([{
      "type": "text",
      "value": "And here is another video: ![[another_video.mp4]]",
      "position": {
        "start": {
          "line": 4,
          "column": 3,
          "offset": 72
        },
        "end": {
          "line": 4,
          "column": 40,
          "offset": 109
        }
      }
    }]);
    expect(result).toMatchSnapshot();
    expect(result.length).toBe(2);
  });

  test('embed in the middle of a textNode', () => {
    const result = parseEmbeds([{
      "type": "text",
      "value": "First some text ![[then_a_video.mp4]] then some more text",
      "position": {
        "start": {
          "line": 4,
          "column": 3,
          "offset": 72
        },
        "end": {
          "line": 4,
          "column": 40,
          "offset": 109
        }
      }
    }]);
    expect(result).toMatchSnapshot();
    expect(result.length).toBe(3);
  });

  test('two embeds', () => {
    const result = parseEmbeds([{
      "type": "text",
      "value": "text ![[video1.mp4]] and ![[picture2.webp]] the end",
      "position": {
        "start": {
          "line": 4,
          "column": 3,
          "offset": 72
        },
        "end": {
          "line": 4,
          "column": 40,
          "offset": 109
        }
      }
    }]);
    expect(result).toMatchSnapshot();
    expect(result.length).toBe(5);
  });


  test('embed with size info', () => {
    const result = parseEmbeds([{
      "type": "text",
      "value": "Here's an embedded picture: ![[a_picture.webp|100]]",
      "position": {
        "start": {
          "line": 3,
          "column": 3,
          "offset": 18
        },
        "end": {
          "line": 3,
          "column": 54,
          "offset": 69
        }
      }
    }]);
    expect(result).toMatchSnapshot();
    expect(result.length).toBe(2);
  });


});



