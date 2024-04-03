import { ItemView, WorkspaceLeaf } from "obsidian";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { Root as ReactRoot, createRoot } from "react-dom/client";
import { AppContext, EventRegistryContext } from "context";
import { ReactView } from "./ReactView";
import { VIEW_TYPE_EXAMPLE } from "main";
import { getCardsUnderHeading } from "parse";

import React from "react";

export class ExampleView extends ItemView {

	root: ReactRoot | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Truth or Dare";
	}

	// async update() {
	// 	console.log(new Date().getTime(), "Active leaf changed!");

	// 	const activeFile = this.app.workspace.getActiveFile();

	// 	const { vault } = this.app;

	// 	if (!activeFile) {
	// 		return;
	// 	}

	// 	const fileContents: string = await vault.cachedRead(activeFile);

	// 	console.log(fileContents);

	// 	const text = this.app.title + 'xxx';

	// 	const mast = fromMarkdown(fileContents);

	// 	// Assuming your data structure is named 'data'
	// 	const stacks = getCardsUnderHeading(mast);

	// 	console.log(stacks);

	// 	const container = this.containerEl.children[1];
	// 	container.empty();
	// 	container.createEl("h3", { text });
	// 	container.createEl("pre", { text: JSON.stringify(stacks, undefined, 2) });

	// 	// debugger;
	// }

	async onOpen() {

		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<AppContext.Provider value={this.app}>
				<EventRegistryContext.Provider value={this.registerEvent.bind(this)}>
					<ReactView />
				</EventRegistryContext.Provider>
			</AppContext.Provider>
		);

		// this.update();
	}

	async onClose() {
		this.root?.unmount();
	}
}
