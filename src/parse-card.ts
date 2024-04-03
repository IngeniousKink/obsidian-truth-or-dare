interface ParsedCard {
  text?: string;
  [key: string]: string | undefined;
}

const REGEX_TEXT_MATCH = 
    '^' + // Start of the line
    '(.*?)' + // Capture any character, non-greedy
    '( \\[.+\\]' + // Matches a space followed by any characters inside square brackets
    '| \\(.+\\)' + // OR matches a space followed by any characters inside parentheses
    '| .+::.*' + // OR matches a space followed by any characters until :: and then any characters after
    '|$)'; // OR end of the line

const REGEX_INLINE_FIELDS = 
  "(" + // Start of capturing group 1
    "\\[" + // Match a literal '[' character
    "|" + // OR
    "\\(" + // Match a literal '(' character
  ")" + // End of capturing group 1
  "(" + // Start of capturing group 2
    "\\w+" + // Match one or more word characters (a-z, A-Z, 0-9, _)
  ")" + // End of capturing group 2
  "::\\ ?" + // Match the string '::' followed by an optional space
  "(" + // Start of capturing group 3
    "[^\\]]+" + // Match one or more characters that are not a ']' character
    "|" + // OR
    "\\([^\\)]+\\)" + // Match a string that starts with '(' and ends with ')' and has one or more characters that are not a ')' character in between
    "|" + // OR
    "[^ ]+" + // Match one or more characters that are not a space character
  ")" + // End of capturing group 3
  "(" + // Start of capturing group 4
    "\\]" + // Match a literal ']' character
    "|" + // OR
    "\\)" + // Match a literal ')' character
  ")"; // End of capturing group 4


export function parseCard(line: string): ParsedCard {
  const result: ParsedCard = {};
  const textMatch = line.match(new RegExp(REGEX_TEXT_MATCH));
  if (textMatch) {
    result.text = textMatch[1].trim();
  }

  // Creating a regex from the pattern string with global flag
  const regex = new RegExp(REGEX_INLINE_FIELDS, 'g');

  // Using the regex to find all matches in the line
  const inlineFieldMatches = line.matchAll(regex);

  // Getting the text from the result or an empty string if it does not exist
  let annotatedText = result.text || '';
  for (const match of inlineFieldMatches) {
    let value = match[3];
    if (value.startsWith('(') && value.endsWith(')')) {
      value = value.slice(1, -1);
    }
    result[match[2]] = value;
    annotatedText = annotatedText.replace(match[0], '').trim();
  }
  result.text = line.replace(/\s*\[.+?\]\s*/g, ' ').trim();
  return result;
}
