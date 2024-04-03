import type { Root, Heading, List, ListItem, Paragraph, Text } from "mdast";

export type Card = { ref: string; text: string; };
export type CardMap = Record<string, Card[]>;

type ChildNode = Heading | List;

export function markdownToGameState(node: Root): CardMap {
    return node.children.reduce<CardMap>((cardMap, child) => processChildNode(cardMap, child as ChildNode), {});
}

function processChildNode(cardMap: CardMap, child: ChildNode): CardMap {
    if (child.type === 'heading') {
        const headingText = getHeadingText(child);
        return { ...cardMap, [headingText]: [] };
    }

    if (child.type === 'list') {
        const headingText = getLatestHeading(cardMap);
        const cardsUnderHeading = getCardsFromListNode(child, headingText);
        return { ...cardMap, [headingText]: cardsUnderHeading };
    }

    return cardMap;
}

function getHeadingText(node: Heading): string {
    const textNode = node.children[0] as Text;
    return textNode.value || '';
}

function getLatestHeading(cardMap: CardMap): string {
    return Object.keys(cardMap).pop() || '';
}

function getCardsFromListNode(listNode: List, headingText: string): Card[] {
    let refCounter = 0;
    return listNode.children.reduce<Card[]>((cards, listItem: ListItem) => {
        const listItemCards = getListItemCards(listItem, refCounter, headingText);
        return [...cards, ...listItemCards];
    }, []);
}

function getListItemCards(listItem: ListItem, refCounter: number, headingText: string): Card[] {
    return listItem.children.reduce<Card[]>((cards, paragraph: Paragraph) => {
        const paragraphCards = getParagraphCards(paragraph, refCounter, headingText);
        return [...cards, ...paragraphCards];
    }, []);
}

function getParagraphCards(paragraph: Paragraph, refCounter: number, headingText: string): Card[] {
    return paragraph.children.reduce<Card[]>((cards, textNode: Text) => {
        if (textNode.type !== 'text') return cards;

        const card = {
            ref: '#' + headingText + '^' + refCounter++,
            text: textNode.value,
        };
        return [...cards, card];
    }, []);
}