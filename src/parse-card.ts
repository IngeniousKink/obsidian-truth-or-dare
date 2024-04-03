interface Annotation {
  actor?: string;
  [key: string]: string | undefined;
  startPos?: string | undefined;
  endPos?: string | undefined;
}

interface ParsedCard {
  text?: string;
  annotations?: Annotation[];
}

const REGEX_HTML_DATA_ATTRIBUTE = /<([^>]+?)>/g;
const REGEX_DATA_ATTRIBUTE = /data-(\w+)="([^"]+)"/g;

function createAnnotation(dataMatches: RegExpMatchArray[], match: RegExpMatchArray): Annotation {
  const annotation: Annotation = {};
  dataMatches.forEach((dataMatch) => {
    annotation[dataMatch[1]] = dataMatch[2];
  });
  annotation.startPos = String(match.index);
  annotation.endPos = String((match.index || 0) + match[0].length);
  return annotation;
}

function parseDataAttributes(match: RegExpMatchArray): Annotation | null {
  const dataMatches = Array.from(match[1].matchAll(REGEX_DATA_ATTRIBUTE));
  if (dataMatches.length === 0) return null;
  return createAnnotation(dataMatches, match);
}

export function parseHTMLCard(html: string): ParsedCard {
  const matches = Array.from(html.matchAll(REGEX_HTML_DATA_ATTRIBUTE));
  const annotations: Annotation[] = matches
    .map(parseDataAttributes)
    .filter((annotation): annotation is Annotation => annotation !== null);

  return annotations.length ? { annotations } : {};
}