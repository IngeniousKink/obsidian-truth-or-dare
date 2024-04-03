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
      ...parseLine(textNode.value),
    };
    return [...cards, card];
  }, []);
}
interface ParsedLine {
  text?: string;
  [key: string]: string | undefined;
}

function parseLine(line: string): ParsedLine {
  const result: ParsedLine = {};
  const textMatch = line.match(/^(.*?)( \[.+\]| \(.+\)| .+::.*|$)/);
  if (textMatch) {
    result.text = textMatch[1].trim();
  }
  const inlineFieldMatches = line.matchAll(/(\[|\()(\w+):: ([^\]]+|\([^\)]+\)|[^ ]+)(\]|\))/g);
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
