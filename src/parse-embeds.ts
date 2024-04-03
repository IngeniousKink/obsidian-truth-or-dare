import { PhrasingContent } from "mdast";
import { Image, Text } from "node_modules/mdast-util-from-markdown/lib/index.js";

function createTextNode(content: PhrasingContent, newValue: string): Text {
    return {
        type: 'text',
        value: newValue,
        position: content.position
    };
}

function createImageContent(content: PhrasingContent, newValue: string): Image {
    return {
        type: 'image',
        url: newValue,
        position: content.position
    };
}

function processImageLink(
    content: Text,
    regexMatch: RegExpExecArray,
    previousIndex: number,
    processedContent: PhrasingContent[]
): number {
    if (regexMatch.index !== previousIndex) {
        processedContent.push(
            createTextNode(
                content,
                content.value.substring(previousIndex, regexMatch.index)
            )
        );
    }

    processedContent.push(createImageContent(content, regexMatch[1]));

    // Update the previousIndex to the end of the matched string
    return regexMatch.index + regexMatch[0].length;
}


function processMarkdownContent(content: PhrasingContent): PhrasingContent[] {
    const processedContent: PhrasingContent[] = [];
    const imageLinkRegex = /!\[\[(.*?)]]/g;
    let regexMatch;
    let previousIndex = 0;

    if (content.type !== 'text') return [content];

    while ((regexMatch = imageLinkRegex.exec(content.value)) !== null) {
        previousIndex = processImageLink(
            content,
            regexMatch,
            previousIndex,
            processedContent
        );
    }

    if (previousIndex !== content.value.length) {
        processedContent.push(
            createTextNode(
                content,
                content.value.substring(previousIndex)
            )
        );
    }

    return processedContent;
}

export function parseEmbeds(input: PhrasingContent[]): PhrasingContent[] {
    return input.flatMap(processMarkdownContent);
}
