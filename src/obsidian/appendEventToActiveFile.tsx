import { TimestampedEvent } from "@obsidian-truth-or-dare/events.js";
import type { Vault, TFile } from "obsidian";

export const serializeEventToCodeBlock = (event: TimestampedEvent) => {
    let eventString = `\`\`\`truth-or-dare:event\n`;

    // Ensure type and timestamp are always at the top
    eventString += `type:${event.type}\n`;
    eventString += `timestamp:${event.timestamp}\n`;

    const eventWithStrKeys: { [key: string]: any } = event;

    for (const key in eventWithStrKeys) {
        if (key !== "type" && key !== "timestamp") {
            eventString += `${key}:${eventWithStrKeys[key]}\n`;
        }
    }

    eventString += `\`\`\`\n`;

    return eventString;
};

export const appendEventToActiveFile = async (vault: Vault, activeFile: TFile, event: TimestampedEvent) => {
	if (!activeFile) return;

	await vault.process(activeFile, (data) => {
		return `${data}${serializeEventToCodeBlock(event)}`;
	});
};
