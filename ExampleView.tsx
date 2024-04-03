
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

