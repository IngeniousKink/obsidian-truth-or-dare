import { EditableFileView, Keymap, TFile, WorkspaceLeaf } from "obsidian";
import { ReactBaseView } from "./ReactBaseView.js";
import { TRUTH_OR_DARE_EDITABLE_VIEW } from "./TruthOrDarePlugin.js";
import { Root as ReactRoot, createRoot } from "react-dom/client";

import React from "react";
import { PlayView } from "../react/components/PlayView.js";
import { ObsidianAppContext, ObsidianEventRegistryContext } from "@obsidian-truth-or-dare/hooks.js";
import { DispatchGameEventContext } from "@obsidian-truth-or-dare/react/dispatchEvent.js";
import { appendEventToActiveFile } from "./appendEventToActiveFile.js";

export class ObsidianEditableView extends EditableFileView {
	root: ReactRoot | null = null;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType(): string {
		return TRUTH_OR_DARE_EDITABLE_VIEW;
	}

	getDisplayText(): string {
		return this.file?.basename || "Recipe";
	}

	getIcon(): string {
		return "chef-hat";
	}

	async onOpen() {
		this.renderPlay();
		// These events can be registered directly as they'll be cleaned up
		// when `containerEl` goes out of scope
		this.containerEl.on('mouseover', 'a.internal-link', (e, el) => {
			this.app.workspace.trigger('hover-link', {
				event: e,
				source: this,
				hoverParent: this,
				el,
				linktext: el.getAttr("href"),
				sourcePath: this.file!.path,
			});
		});
		this.containerEl.on('click', 'a.internal-link', (e, el) => {
			const inNewLeaf = Keymap.isModEvent(e);
			this.app.workspace.openLinkText(
				el.getAttr("href")!,
				this.file!.path,
				inNewLeaf
			);
		});
		this.containerEl.on('click', 'a.tag', (e, el) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(this.app as any).internalPlugins.getPluginById('global-search')
				.instance.openGlobalSearch(`tag:${el.getAttr('href')}`);
		});
	}

	async onClose() {
		this.root?.unmount();
	}

	async onLoadFile(file: TFile): Promise<void> {
		super.onLoadFile(file);
		this.renderPlay();
		return;
	}

	async renderPlay(): Promise<boolean> {
		if (!this.file) { return false; }

		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<ObsidianAppContext.Provider value={this.app}>
				<ObsidianEventRegistryContext.Provider value={this.registerEvent.bind(this)}>
					<DispatchGameEventContext.Provider value={appendEventToActiveFile}>
						<div className="grid grid-rows-3 grid-cols-[20%,20%,60%] grid-flow-col gap-4">
							<ReactBaseView GameView={PlayView}/>
						</div>
					</DispatchGameEventContext.Provider>
				</ObsidianEventRegistryContext.Provider>
			</ObsidianAppContext.Provider>
		);

		return true;
	}
}
