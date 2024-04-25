import { PhrasingContent } from "node_modules/mdast-util-from-markdown/lib/index.js";

export interface Annotation {
  actor?: string;
  startPos?: number;
  endPos?: number;
  [key: string]: string | number | undefined;
}

export interface ParsedCard {
  text: string;
  annotations: Annotation[];
}

const REGEX_HTML_DATA_ATTRIBUTE = /<([^>]+?)>/g;
const REGEX_DATA_ATTRIBUTE = /data-(\w+)="([^"]*)"/g;
const REGEX_MEDIA_ATTRIBUTE = /<(img|video)\s+src="([^"]*)"/g;
const REGEX_OBSIDIAN_EMBED = /!\[\[([^]|]+)(?:\|[^]]+)?\]\]/g;

function createAnnotation(
  dataMatches: RegExpMatchArray[],
  match: RegExpMatchArray,
  annotationData?: Partial<Annotation>
): Annotation {
  const annotation: Partial<Annotation> = annotationData || {};
  dataMatches.forEach((dataMatch) => {
    annotation[dataMatch[1]] = dataMatch[2];
  });
  annotation.startPos = match.index;
  annotation.endPos = ((match.index || 0) + match[0].length);
  return annotation;
}

function parseDataAttributes(match: RegExpMatchArray): Annotation | null {
  const dataMatches = Array.from(match[1].matchAll(REGEX_DATA_ATTRIBUTE));
  if (dataMatches.length === 0) return null;
  return createAnnotation(dataMatches, match);
}

function parseMedia(match: RegExpMatchArray): Annotation {
  const annotationData: Partial<Annotation> = {
    src: match[2],
    type: match[1],
  };
  return createAnnotation([], match, annotationData);
}

function parseObsidianEmbed(match: RegExpMatchArray): Annotation {
  const annotationData: Partial<Annotation> = {
    src: match[1],
    type: 'obsidian',
  };
  return createAnnotation([], match, annotationData);
}

export function parseCard(content: PhrasingContent[]): ParsedCard {
  let position = 0;
  const annotations: Annotation[] = [];
  
  const html = content.reduce((acc, textNode: PhrasingContent) => {
    let value = '';
    if (textNode.type === 'image' && textNode.position?.start.column) {
      const annotation: Annotation = {
        type:'image',
        'url': textNode.url,
        startPos: position,
        endPos: position + '![['.length + textNode.url.length + ']]'.length,
      };
      annotations.push(annotation);
      value = '![[' + textNode.url + ']]';
    } else if (textNode.type === 'text' || textNode.type === 'html') {
      value = textNode.value;
      const dataMatches = Array.from(value.matchAll(REGEX_HTML_DATA_ATTRIBUTE));
      dataMatches.forEach(match => {
        const annotation = parseDataAttributes(match);
        if (annotation) {
          annotation.startPos = (annotation.startPos || 0) + position;
          annotation.endPos = (annotation.endPos || 0) + position;
          annotations.push(annotation);
        }
      });
      const mediaMatches = Array.from(value.matchAll(REGEX_MEDIA_ATTRIBUTE));
      mediaMatches.forEach(match => {
        const annotation = parseMedia(match);
        annotation.startPos = (annotation.startPos || 0) + position;
        annotation.endPos = (annotation.endPos || 0) + position;
        annotations.push(annotation);
      });
      const obsidianMatches = Array.from(value.matchAll(REGEX_OBSIDIAN_EMBED));
      obsidianMatches.forEach(match => {
        const annotation = parseObsidianEmbed(match);
        annotation.startPos = (annotation.startPos || 0) + position;
        annotation.endPos = (annotation.endPos || 0) + position;
        annotations.push(annotation);
      });
    }
    position += value.length;
    return acc + value;
  }, '');
  
  return {
    text: html,
    annotations: annotations,
  };
}
