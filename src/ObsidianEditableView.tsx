import { EditableFileView, Keymap, TFile, WorkspaceLeaf } from "obsidian";
import { ReactBaseView } from "./ReactBaseView.jsx";
import TruthOrDarePlugin, { TRUTH_OR_DARE_EDITABLE_VIEW } from "./TruthOrDarePlugin.js";
import { Root as ReactRoot, createRoot } from "react-dom/client";
import { AppContext, EventRegistryContext } from "./context.js";

import React from "react";
import { PlayView } from "./PlayView.js";

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
		const text = await this.app.vault.cachedRead(this.file!);
		const metadata = await this.app.metadataCache.getFileCache(this.file!);

		this.root = createRoot(this.containerEl.children[1]);
		this.root.render(
			<AppContext.Provider value={this.app}>
				<EventRegistryContext.Provider value={this.registerEvent.bind(this)}>
					<ReactBaseView GameView={PlayView}/>
				</EventRegistryContext.Provider>
			</AppContext.Provider>
		);

		return true;
	}
}
