import { Plugin, ItemView, WorkspaceLeaf } from "obsidian";

import { fromMarkdown } from 'mdast-util-from-markdown';
import type { Root, Code } from "mdast-util-from-markdown/lib";

export const VIEW_TYPE_EXAMPLE = "truth-or-dare-view";

// Remember to rename these classes and interfaces!


function getCardsUnderHeading(node : Root) {
	// debugger;

	let headingText = '';

	const allCardsUnderHeadings = {};
  
	node.children.forEach(child => {
	  let refCounter = 0;
	  const cardsUnderHeading = [];

	  if (child.type === 'heading' && child.children) {
	    headingText = child.children[0].value;
		return;
 	  }

	  if (child.type !== 'list') {
		return;
	  }
  
	  child.children.forEach(listItem => {
		listItem.children.forEach(paragraph => {

		  paragraph.children.forEach(textNode => {
			if (textNode.type === 'text') {

			  const filePath = '';
			  cardsUnderHeading.push({
				ref:  filePath + '#' + headingText + '^' + refCounter++,
				text: textNode.value,
			  });
			}
		  });
		});
	  });

	  console.log(`Cards under heading "${headingText}":`, cardsUnderHeading);

	  allCardsUnderHeadings[headingText] = cardsUnderHeading;

	});
  
	return allCardsUnderHeadings;
  }
  



interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}


export class ExampleView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_EXAMPLE;
	}

	getDisplayText() {
		return "Truth or Dare";
	}

	async update() {
		console.log(new Date().getTime(), "Active leaf changed!")

		const activeFile = this.app.workspace.getActiveFile();

		const { vault } = this.app;

		if (!activeFile) {
			return;
		}

		const fileContents: string = await vault.cachedRead(activeFile);

		console.log(fileContents);

		const text = this.app.title + 'xxx';

		const mast = fromMarkdown(fileContents);

		// Assuming your data structure is named 'data'
		const stacks = getCardsUnderHeading(mast);

		const container = this.containerEl.children[1];
		container.empty();
		container.createEl("h3", { text });
		container.createEl("pre", { text: JSON.stringify(stacks, undefined, 2) });

		// debugger;
	}

	async onOpen() {

		this.registerEvent(this.app.metadataCache.on("changed", async (file) => {
			console.log(new Date().getTime(), 'file changed!', file);
			return this.update();
		}));

		this.registerEvent(
			this.app.workspace.on("active-leaf-change", async () => { return this.update(); } )
		);

		this.update();
	}

	async onClose() {
		// Nothing to clean up.
	}
}


export default class MyPlugin extends Plugin {
	async onload() {
		this.registerView(
			VIEW_TYPE_EXAMPLE,
			(leaf) => new ExampleView(leaf)
		);

		this.addRibbonIcon("play", "Play truth or dare game", () => {
			this.activateView();
		});
	}

	async onunload() {
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
	}
}

