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
const REGEX_DATA_ATTRIBUTE = /data-(\w+)="([^"]*)"/g;
const REGEX_MEDIA_ATTRIBUTE = /<(img|video)\s+src="([^"]*)"/g;

function createAnnotation(
  dataMatches: RegExpMatchArray[],
  match: RegExpMatchArray,
  annotationData?: Partial<Annotation>
): Annotation {
  const annotation: Annotation = annotationData || {};
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

function parseMedia(match: RegExpMatchArray): Annotation {
  const annotationData: Partial<Annotation> = {
    src: match[2],
    type: match[1],
  };
  return createAnnotation([], match, annotationData);
}

export function parseCard(html: string): ParsedCard {
  const dataMatches = Array.from(html.matchAll(REGEX_HTML_DATA_ATTRIBUTE));
  const mediaMatches = Array.from(html.matchAll(REGEX_MEDIA_ATTRIBUTE));

  const dataAnnotations: Annotation[] = dataMatches
    .map(parseDataAttributes)
    .filter((annotation): annotation is Annotation => annotation !== null);

  const mediaAnnotations: Annotation[] = mediaMatches.map(parseMedia);

  const annotations = [...dataAnnotations, ...mediaAnnotations];

  return annotations.length ? { annotations } : {};
}