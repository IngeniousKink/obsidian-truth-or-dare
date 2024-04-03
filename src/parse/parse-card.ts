import { Html, Image, PhrasingContent } from "node_modules/mdast-util-from-markdown/lib/index.js";

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
const REGEX_OBSIDIAN_EMBED = /\!\[\[([^]|]+)(?:\|[^]]+)?\]\]/g;

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

  const imageAnnotations: Annotation[] = [];
  let html = content.reduce((acc, textNode: PhrasingContent) => {
    if (textNode.type === 'image') {
      imageAnnotations.push({
        type:'image',
        'url': textNode.url,
        startPos: textNode.position?.start.column,
        endPos: textNode.position?.end.column,
      });

      return acc + '![[' + textNode.url + ']]';
    }

    if (textNode.type !== 'text' && textNode.type !== 'html') return acc;

    return acc + textNode.value;
  }, '');
  

  const dataMatches = Array.from(html.matchAll(REGEX_HTML_DATA_ATTRIBUTE));
  const dataAnnotations: Annotation[] = dataMatches
    .map(parseDataAttributes)
    .filter((annotation): annotation is Annotation => annotation !== null);

  const mediaMatches = Array.from(html.matchAll(REGEX_MEDIA_ATTRIBUTE));
  const mediaAnnotations: Annotation[] = mediaMatches.map(parseMedia);

  const obsidianMatches = Array.from(html.matchAll(REGEX_OBSIDIAN_EMBED));
  const obsidianAnnotations: Annotation[] = obsidianMatches.map(parseObsidianEmbed);

  return {
    text: html,
    annotations: [
      ...dataAnnotations,
      ...mediaAnnotations,
      ...imageAnnotations,
      ...obsidianAnnotations
    ]
  };
}