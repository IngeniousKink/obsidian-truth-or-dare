interface Annotation {
  actor?: string;
  startPos?: string;
  endPos?: string;
  [key: string]: string | undefined;
}

interface ParsedCard {
  text?: string;
  annotations?: Annotation[];
}
const REGEX_HTML_DATA_ATTRIBUTE = /<([^>]+?)>/g;
const REGEX_DATA_ATTRIBUTE = /data-(\w+)="([^"]+)"/g;

export function parseHTMLCard(html: string): ParsedCard {
  const result: ParsedCard = {};
  const matches = html.matchAll(REGEX_HTML_DATA_ATTRIBUTE);
  const annotations: Annotation[] = [];
  for (const match of matches) {
    const annotation: Annotation = {};
    const dataMatches = match[1].matchAll(REGEX_DATA_ATTRIBUTE);
    for (const dataMatch of dataMatches) {
      if (dataMatch[1] === 'actor') {
        annotation.actor = dataMatch[2];
      } else {
        annotation[dataMatch[1]] = dataMatch[2];
      }
    }
    if (Object.keys(annotation).length > 0) {
      annotations.push(annotation);
    }
  }
  if (annotations.length > 0) {
    result.annotations = annotations;
  }
  return result;
}
