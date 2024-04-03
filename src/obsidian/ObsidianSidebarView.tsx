import React from "react";

import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root as ReactRoot, createRoot } from "react-dom/client";
import { TRUTH_OR_DARE_SIDEBAR_VIEW } from "./TruthOrDarePlugin.js";

import { ReactBaseView } from "./ReactBaseView.js";
import { InspectorView } from "../react/components/InspectorView.js";
import { ObsidianAppContext, ObsidianEventRegistryContext } from "@obsidian-truth-or-dare/hooks.js";

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
			<ObsidianAppContext.Provider value={this.app}>
				<ObsidianEventRegistryContext.Provider value={this.registerEvent.bind(this)}>
					<ReactBaseView GameView={InspectorView}/>
				</ObsidianEventRegistryContext.Provider>
			</ObsidianAppContext.Provider>
		);
	}

	async onClose() {
		this.root?.unmount();
	}
}
