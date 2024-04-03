import type { Root, Html, Heading, List, ListItem, Paragraph, Text, Image } from "mdast";
import { parseCard } from "./parse-card.js";
import type { ParsedCard } from "./parse-card.js";
import { PhrasingContent } from "node_modules/mdast-util-from-markdown/lib/index.js";
import { parseEmbeds } from "./parse-embeds.js";

export type CardWithRef = ParsedCard & { ref: string; category?: string };

// Define a Stack type with a name, reference and an array of cards
export type Stack = { name: string; ref: string; cards: CardWithRef[]; };

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
    let stack = getLastStack(gameTemplate);
    if (!stack) {
      stack = {
        name: "",
        ref: "",
        cards: extractCardsFromList(child, ""),
      };
      gameTemplate.stacks.push(stack);
    }
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
function extractCardsFromList(listNode: List, stackRef: string): CardWithRef[] {
  let refCounter = 0;
  return listNode.children.reduce<CardWithRef[]>((cards, listItem: ListItem) => {
    const listItemCards = extractCardsFromListItem(listItem, refCounter++, stackRef);
    return [...cards, ...listItemCards];
  }, []);
}

// Extract cards from a list item
function extractCardsFromListItem(listItem: ListItem, refCounter: number, stackRef: string): CardWithRef[] {
  return listItem.children.reduce<CardWithRef[]>((cards, paragraph: Paragraph | Html) => {
    const paragraphCard = extractCardFromParagraph(paragraph, refCounter, stackRef);
    return [...cards, paragraphCard];
  }, []);
}

export function extractCardFromParagraph(paragraph: Paragraph | Html, refCounter: number, stackRef: string): CardWithRef {
  let children : PhrasingContent[]  = [];

  if (paragraph.type == 'html') {
    children = [paragraph];
  } else {
    children = paragraph.children;
  }

  return {
    ...parseCard(parseEmbeds(children)),
    ref: stackRef + '^' + refCounter,
  };
}