import React from "react";

import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root as ReactRoot, createRoot } from "react-dom/client";
import { AppContext, EventRegistryContext } from "./context.js";
import { TRUTH_OR_DARE_SIDEBAR_VIEW } from "./TruthOrDarePlugin.js";

import { ReactBaseView } from "./ReactBaseView.jsx";
import { InspectorView } from "./InspectorView.js";

export class ObsidianSidebarView extends ItemView {

	root: ReactRoot | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return TRUTH_OR_DARE_SIDEBAR_VIEW;
	}

	getDisplayText() {
		return "Truth or Dare";
	}

	async onOpen() {
		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<AppContext.Provider value={this.app}>
				<EventRegistryContext.Provider value={this.registerEvent.bind(this)}>
					<ReactBaseView GameView={InspectorView}/>
				</EventRegistryContext.Provider>
			</AppContext.Provider>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
