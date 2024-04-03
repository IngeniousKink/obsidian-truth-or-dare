import { Plugin, WorkspaceLeaf } from "obsidian";
import { ObsidianSidebarView } from "./ObsidianSidebarView.js";
import { ObsidianEditableView } from "./ObsidianEditableView.js";

export const TRUTH_OR_DARE_SIDEBAR_VIEW = "truth-or-dare-view-sidebar";
export const TRUTH_OR_DARE_EDITABLE_VIEW = "truth-or-dare-view-editable";

export default class TruthOrDarePlugin extends Plugin {
	async onload() {
		this.registerView(
			TRUTH_OR_DARE_SIDEBAR_VIEW,
			(leaf) => new ObsidianSidebarView(leaf)
		);

		this.registerView(
			TRUTH_OR_DARE_EDITABLE_VIEW,
			(leaf) => new ObsidianEditableView(leaf)
		);

		this.addRibbonIcon("search", "Inspect truth or dare game", () => {
			this.activateInspectionView();
		});

		this.addRibbonIcon("play", "Play truth or dare game", () => {
			this.toggleEditableView(false);
		});

		this.addCommand({
			id: "toggle-truth-or-dare-view",
			name: "Toggle between truth or dare and markdown",
			checkCallback: (c) => this.toggleEditableView(c),
		});
	}

	async onunload() {
	}

	async activateInspectionView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(TRUTH_OR_DARE_SIDEBAR_VIEW);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({
				type: TRUTH_OR_DARE_SIDEBAR_VIEW,
				active: true
			});
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
	}

	toggleEditableView(checking: boolean) {
		const activeLeaf = this.app.workspace.getMostRecentLeaf();

		if (activeLeaf?.getViewState().type == "markdown") {
			if (!checking) {
				this.setPlayView(activeLeaf!);
			}
		} else if (activeLeaf?.getViewState().type == TRUTH_OR_DARE_EDITABLE_VIEW) {
			if (!checking) {
				this.setMarkdownView(activeLeaf!);
			}
		} else {
			return false;
		}
		return true;
	}

	async setPlayView(leaf: WorkspaceLeaf) {
		await leaf.setViewState({
			type: TRUTH_OR_DARE_EDITABLE_VIEW,
			state: leaf.view.getState(),
			active: true,
			// @ts-ignore
			popstate: true,
		})
	}

	async setMarkdownView(leaf: WorkspaceLeaf) {
		await leaf.setViewState({
			type: "markdown",
			state: leaf.view.getState(),
			active: true,
			// @ts-ignore
			popstate: true,
		})
	}
}
