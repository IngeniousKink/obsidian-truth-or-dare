import type { Root as MarkdownRoot } from "mdast-util-from-markdown/lib";

// Remember to rename these classes and interfaces!

export function getCardsUnderHeading(node: MarkdownRoot) {
	let headingText = '';

	const allCardsUnderHeadings = {};

	node.children.forEach(child => {
		let refCounter = 0;
		const cardsUnderHeading: { ref: string; text: any; }[] = [];

		if (child.type === 'heading' && child.children) {
			headingText = child.children[0].value;
			return;
		}

		if (child.type !== 'list') {
			return;
		}

		child.children.forEach(listItem => {
			listItem.children.forEach(paragraph => {

				paragraph.children.forEach(textNode => {
					if (textNode.type === 'text') {

						const filePath = '';
						cardsUnderHeading.push({
							ref: filePath + '#' + headingText + '^' + refCounter++,
							text: textNode.value,
						});
					}
				});
			});
		});

		console.log(`Cards under heading "${headingText}":`, cardsUnderHeading);

		allCardsUnderHeadings[headingText] = cardsUnderHeading;

	});

	return allCardsUnderHeadings;
}
