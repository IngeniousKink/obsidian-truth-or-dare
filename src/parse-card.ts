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

const REGEX_HTML_DATA_ATTRIBUTE = /data-(\w+)="([^"]+)"/g;
export function parseHTMLCard(html: string): ParsedCard {
  const result: ParsedCard = {};
  const matches = html.matchAll(REGEX_HTML_DATA_ATTRIBUTE);
  const annotations: Annotation[] = [];
  for (const match of matches) {
    const annotation: Annotation = {};
    if (match[1] === 'actor') {
      annotation.actor = match[2];
    } else {
      annotation[match[1]] = match[2];
    }
    annotations.push(annotation);
  }
  if (annotations.length > 0) {
    result.annotations = annotations;
  }
  return result;
}
