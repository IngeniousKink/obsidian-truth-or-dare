import type { Root, Heading, List, ListItem, Paragraph, Text } from "mdast";

// Define a Card type with a reference and text
export type Card = { ref: string; text: string; };

// Define a map to hold all cards indexed by their reference
export type CardMap = Record<string, Card[]>;

// ChildNode type can be either a Heading or a List
type ChildNode = Heading | List;

/**
 * This function takes a markdown abstract syntax tree (AST) and converts it into a game state.
 * The game state is represented as a CardMap, where each card is indexed by a unique reference.
 * Each heading in the markdown creates a new key in the CardMap, and each list item under that heading
 * creates a new card under that key.
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
 * The resulting CardMap would be:
 * 
 * {
 *   "Heading 1": [
 *     { ref: "#Heading 1^0", text: "Item 1" },
 *     { ref: "#Heading 1^1", text: "Item 2" }
 *   ],
 *   "Heading 2": [
 *     { ref: "#Heading 2^0", text: "Item 3" }
 *   ]
 * }
 */
export function convertMarkdownToGameTemplate(node: Root): CardMap {
  return node.children.reduce<CardMap>(
    (cardMap, child) => processMarkdownNode(cardMap, child as ChildNode),
    {}
  );
}

// Process a markdown node, which can either be a heading or a list
function processMarkdownNode(cardMap: CardMap, child: ChildNode): CardMap {
  if (child.type === 'heading') {
    const headingText = extractHeadingText(child);
    return { ...cardMap, [headingText]: [] };
  }

  if (child.type === 'list') {
    const headingText = getLastHeading(cardMap);
    const cardsUnderHeading = extractCardsFromList(child, headingText);
    return { ...cardMap, [headingText]: cardsUnderHeading };
  }

  return cardMap;
}

// Extract the text from a heading node
function extractHeadingText(node: Heading): string {
  const textNode = node.children[0] as Text;
  return textNode.value || '';
}

// Get the last heading from the card map
function getLastHeading(cardMap: CardMap): string {
  return Object.keys(cardMap).pop() || '';
}

// Extract cards from a list node
function extractCardsFromList(listNode: List, headingText: string): Card[] {
  let refCounter = 0;
  return listNode.children.reduce<Card[]>((cards, listItem: ListItem) => {
    const listItemCards = extractCardsFromListItem(listItem, refCounter, headingText);
    return [...cards, ...listItemCards];
  }, []);
}

// Extract cards from a list item
function extractCardsFromListItem(listItem: ListItem, refCounter: number, headingText: string): Card[] {
  return listItem.children.reduce<Card[]>((cards, paragraph: Paragraph) => {
    const paragraphCards = extractCardsFromParagraph(paragraph, refCounter, headingText);
    return [...cards, ...paragraphCards];
  }, []);
}

function extractCardsFromParagraph(paragraph: Paragraph, refCounter: number, headingText: string): Card[] {
  return paragraph.children.reduce<Card[]>((cards, textNode: Text) => {
    if (textNode.type !== 'text') return cards;

    const card = {
      ref: '#' + headingText + '^' + refCounter++,
      text: textNode.value,
    };
    return [...cards, card];
  }, []);
}