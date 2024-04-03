import { TimestampedEvent, serializeEventToCodeBlock } from "@obsidian-truth-or-dare/events.js";
import { ObsidianAppContext } from "@obsidian-truth-or-dare/hooks.js";
import { DispatchGameEventHook } from "@obsidian-truth-or-dare/react/DispatchGameEventFunction.js";
import { useContext } from "react";

export const appendEventToActiveFile : DispatchGameEventHook = () => {
	const app = useContext(ObsidianAppContext);

	return async (eventAction: TimestampedEvent) =>  {
		if (!app) return;

		const { vault, workspace } = app;
		const activeFile = workspace.getActiveFile();
		
		if (!activeFile) return;

		await vault.process(activeFile, (data: string) => {
			return `${data}${serializeEventToCodeBlock(eventAction)}`;
		});
	}
};
