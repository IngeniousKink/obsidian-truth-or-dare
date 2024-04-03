import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root as ReactRoot, createRoot } from "react-dom/client";
import { AppContext, EventRegistryContext } from "./context.js";
import { ReactBaseView } from "./ReactBaseView.jsx";
import { VIEW_TYPE_EXAMPLE } from "./TruthOrDarePlugin.js";

import React from "react";

export class ObsidianBaseView extends ItemView {

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

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<AppContext.Provider value={this.app}>
				<EventRegistryContext.Provider value={this.registerEvent.bind(this)}>
					<ReactBaseView />
				</EventRegistryContext.Provider>
			</AppContext.Provider>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
