import { describe, expect, test } from 'vitest';

import { parseCard } from "@obsidian-truth-or-dare/parse/parse-card.js";
import { PhrasingContent } from "node_modules/mdast-util-from-markdown/lib/index.js";

describe('parseCard', () => {
  test('should parse a card with no annotations', () => {
    const input: PhrasingContent[] = [{ type: 'text', value: 'Hello, world!' }];
    const output = parseCard(input);
    expect(output.text).toEqual('Hello, world!');
    expect(output.annotations).toEqual([]);
  });

  test('should parse a card with image annotation', () => {
    const input: PhrasingContent[] = [{
      type: 'image',
      url: 'https://example.com/image.jpg',
      position: { start: { line: 0, column: 1 }, end: { line: 0, column: 10 } }
    }];
    const output = parseCard(input);
    expect(output.text).toEqual('![[https://example.com/image.jpg]]');
    expect(output.annotations).toEqual([{
      type: 'image',
      url: 'https://example.com/image.jpg',
      startPos: 0,
      endPos: 34,
    }]);
  });

  test('should parse a card with HTML data attributes', () => {
    const input: PhrasingContent[] = [{ type: 'html', value: '<div data-test="value"/>' }];
    const output = parseCard(input);
    expect(output.text).toEqual('<div data-test="value"/>');
    expect(output.annotations).toEqual([{
      test: 'value',
      startPos: 0,
      endPos: 24,
    }]);
  });

  test('should parse a card with media annotation', () => {
    const input: PhrasingContent[] = [{ type: 'html', value: '<img src="https://example.com/image.jpg">' }];
    const output = parseCard(input);
    expect(output.text).toEqual('<img src="https://example.com/image.jpg">');
    expect(output.annotations).toEqual([{
      src: 'https://example.com/image.jpg',
      type: 'img',
      startPos: 0,
      endPos: 40,
    }]);
  });

  test.skip('should parse a card with Obsidian embed', () => {
    const input: PhrasingContent[] = [{ type: 'text', value: '![https://example.com/image.jpg]' }];
    const output = parseCard(input);
    expect(output.text).toEqual('![https://example.com/image.jpg]');
    expect(output.annotations).toEqual([{
      src: 'https://example.com/image.jpg',
      type: 'obsidian',
      startPos: 0,
      endPos: 32, // <- reviewed by human
    }]);
  });


  test('should handle multiple annotations of the same type', () => {
    const input: PhrasingContent[] = [
      { type: 'html', value: '<div data-test="value1" />' },
      { type: 'html', value: '<div data-test="value2"/>' },
    ];
    const output = parseCard(input);
    expect(output.annotations).toEqual([
      { test: 'value1', startPos: 0, endPos: 26 },
      { test: 'value2', startPos: 26, endPos: 51 },
    ]);
  });

  test('should handle multiple annotations of different types', () => {
    const input: PhrasingContent[] = [
      { type: 'html', value: '<div data-test="value"/>' },
      { type: 'html', value: '<img src="https://example.com/image.jpg">' },
    ];
    const output = parseCard(input);
    expect(output.annotations).toEqual([
      { test: 'value', startPos: 0, endPos: 24 },
      { src: 'https://example.com/image.jpg', type: 'img', startPos: 24, endPos: 64 },
    ]);
  });

  test('should ignore annotations without required attributes', () => {
    const input: PhrasingContent[] = [
      { type: 'html', value: '<div>Hello</div>' },
      { type: 'html', value: '<img>' },
    ];
    const output = parseCard(input);
    expect(output.annotations).toEqual([]);
  });

  test('should handle empty input', () => {
    const input: PhrasingContent[] = [];
    const output = parseCard(input);
    expect(output.text).toEqual('');
    expect(output.annotations).toEqual([]);
  });

  test('should handle input with only whitespace', () => {
    const input: PhrasingContent[] = [{ type: 'text', value: '   ' }];
    const output = parseCard(input);
    expect(output.text).toEqual('   ');
    expect(output.annotations).toEqual([]);
  });

  test('should handle input with only non-annotation elements', () => {
    const input: PhrasingContent[] = [{ type: 'html', value: '<div>Hello</div>' }];
    const output = parseCard(input);
    expect(output.text).toEqual('<div>Hello</div>');
    expect(output.annotations).toEqual([]);
  });

  test('should handle input with mixed annotation and non-annotation elements', () => {
    const input: PhrasingContent[] = [
      { type: 'text', value: 'Hello' },
      { type: 'html', value: '<img src="https://example.com/image.jpg">' },
    ];
    const output = parseCard(input);
    expect(output.text).toEqual('Hello<img src="https://example.com/image.jpg">');
    expect(output.annotations).toEqual([
      { src: 'https://example.com/image.jpg', type: 'img', startPos: 5, endPos: 45 },
    ]);
  });

  test('should handle input with non-standard attributes', () => {
    const input: PhrasingContent[] = [
      { type: 'html', value: '<div data-test="value" data-extra="extra"/>' },
    ];
    const output = parseCard(input);
    expect(output.text).toEqual('<div data-test="value" data-extra="extra"/>');
    expect(output.annotations).toEqual([
      { test: 'value', extra: 'extra', startPos: 0, endPos: 43 },
    ]);
  });
});
