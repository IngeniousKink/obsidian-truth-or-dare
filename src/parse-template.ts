import type { Root, Heading, List, ListItem, Paragraph, Text } from "mdast";

// Define a Card type with a reference and text
export type Card = { ref: string; text: string; };

// Define a Stack type with a name, reference and an array of cards
export type Stack = { name: string; ref: string; cards: Card[]; };

// Define a GameTemplate type with an array of stacks
export type GameTemplate = { stacks: Stack[]; };
// ChildNode type can be either a Heading or a List
type ChildNode = Heading | List;

/**
 * This function takes a markdown abstract syntax tree (AST) and converts it into a game template.
 * The game template is represented as a GameTemplate, where each stack is an object with a name, reference and an array of cards.
 * Each heading in the markdown creates a new stack in the GameTemplate, and each list item under that heading
 * creates a new card in that stack.
 * 
 * For example, given the following markdown:
 * 
 * # Heading 1
 * - Item 1
 * - Item 2
 * 
 * # Heading 2
 * - Item 3
 * 
 * The resulting GameTemplate would be:
 * 
 * {
 *   stacks: [
 *     {
 *       name: "Heading 1",
 *       ref: "#Heading 1",
 *       cards: [
 *         { ref: "#Heading 1^0", text: "Item 1" },
 *         { ref: "#Heading 1^1", text: "Item 2" }
 *       ]
 *     },
 *     {
 *       name: "Heading 2",
 *       ref: "#Heading 2",
 *       cards: [
 *         { ref: "#Heading 2^0", text: "Item 3" }
 *       ]
 *     }
 *   ]
 * }
 */
export function convertMarkdownToGameTemplate(node: Root): GameTemplate {
  return node.children.reduce<GameTemplate>(
    (gameTemplate, child) => processMarkdownNode(gameTemplate, child as ChildNode),
    { stacks: [] }
  );
}

// Process a markdown node, which can either be a heading or a list
function processMarkdownNode(gameTemplate: GameTemplate, child: ChildNode): GameTemplate {
  if (child.type === 'heading') {
    const headingText = extractHeadingText(child);
    gameTemplate.stacks.push({ name: headingText, ref: "#" + headingText, cards: [] });
    return gameTemplate;
  }

  if (child.type === 'list') {
    const stack = getLastStack(gameTemplate);
    stack.cards = extractCardsFromList(child, stack.ref);
    return gameTemplate;
  }

  return gameTemplate;
}

// Extract the text from a heading node
function extractHeadingText(node: Heading): string {
  const textNode = node.children[0] as Text;
  return textNode.value || '';
}

// Get the last stack from the game template
function getLastStack(gameTemplate: GameTemplate): Stack {
  return gameTemplate.stacks[gameTemplate.stacks.length - 1];
}

// Extract cards from a list node
function extractCardsFromList(listNode: List, stackRef: string): Card[] {
  let refCounter = 0;
  return listNode.children.reduce<Card[]>((cards, listItem: ListItem) => {
    const listItemCards = extractCardsFromListItem(listItem, refCounter++, stackRef);
    return [...cards, ...listItemCards];
  }, []);
}

// Extract cards from a list item
function extractCardsFromListItem(listItem: ListItem, refCounter: number, stackRef: string): Card[] {
  return listItem.children.reduce<Card[]>((cards, paragraph: Paragraph) => {
    const paragraphCards = extractCardsFromParagraph(paragraph, refCounter, stackRef);
    return [...cards, ...paragraphCards];
  }, []);
}

function extractCardsFromParagraph(paragraph: Paragraph, refCounter: number, stackRef: string): Card[] {
  return paragraph.children.reduce<Card[]>((cards, textNode: Text) => {
    if (textNode.type !== 'text') return cards;

    const card = {
      ref: stackRef + '^' + refCounter,
      text: textNode.value,
      ...parseCard(textNode.value),
    };
    return [...cards, card];
  }, []);
}

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

function parseCard(line: string): ParsedCard {
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
