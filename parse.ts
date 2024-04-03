import type { Root } from "mdast";

export type Card = { ref: string; text: any; };
export type CardMap = { [key: string]: Card[] };

export function getCardsUnderHeading(node: Root): CardMap {
	let headingText = '';
	const allCardsUnderHeadings: CardMap = {};

	node.children.forEach(child => {
		let refCounter = 0;
		const cardsUnderHeading: Card[] = [];

		if (child.type === 'heading' && child.children.length > 1 && 'value' in child.children[0]) {
			headingText = child.children[0].value;
			return;
		}

		if (child.type !== 'list') {
			return;
		}

		child.children.forEach(listItem => {
			listItem.children.forEach(paragraph => {
				if (!('children' in paragraph)) {
					return
				}
				paragraph.children.forEach(textNode => {
					if (textNode.type !== 'text') {
						return;
					}

					const filePath = '';
					cardsUnderHeading.push({
						ref: filePath + '#' + headingText + '^' + refCounter++,
						text: textNode.value,
					});
				});
			});
		});

		console.log(`Cards under heading "${headingText}":`, cardsUnderHeading);

		allCardsUnderHeadings[headingText] = cardsUnderHeading;

	});

	return allCardsUnderHeadings;
}