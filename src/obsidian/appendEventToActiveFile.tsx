import { TimestampedEvent, serializeEventToCodeBlock } from "@obsidian-truth-or-dare/events.js";
import type { Vault, TFile } from "obsidian";

export const appendEventToActiveFile = async (vault: Vault, activeFile: TFile, event: TimestampedEvent) => {
	if (!activeFile) return;

	await vault.process(activeFile, (data) => {
		return `${data}${serializeEventToCodeBlock(event)}`;
	});
};
