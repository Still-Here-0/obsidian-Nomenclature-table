import { Plugin, Notice, PluginManifest, App, WorkspaceLeaf, loadMathJax } from 'obsidian'
import { NomenclatureView } from './nomenclatureView/nomenclature.view';
import { NOMENCLATURE_VIEW_TYPE } from './consts';

export default class NomenclatureTable extends Plugin {

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);

		// console.log("Nomenclature table initialized");
	}

	async onload(): Promise<void> {

		// Setting
		await loadMathJax();

		this.registerView(
			NOMENCLATURE_VIEW_TYPE,
			(leaf: WorkspaceLeaf) => new NomenclatureView(leaf)
		);

		this.addCommand({
			id: "show-nomenclature",
			name: "Show nomenclature table",
			callback: () => { this.loadNomenclatureView(this) }
		});

		this.addRibbonIcon(
			'text-select',
			"Open nomenclature table",
			() => { this.loadNomenclatureView(this) }
		)
			
		new Notice("Nomenclature table loaded");
	}

	loadNomenclatureView(self: NomenclatureTable): void {
		if (self.app.workspace.getLeavesOfType(NOMENCLATURE_VIEW_TYPE).length){
			return;
		}

		self.app.workspace.getRightLeaf(false)?.setViewState({
			type: NOMENCLATURE_VIEW_TYPE
		});
	}

	onunload(): void {
		this.app.workspace
			.getLeavesOfType(NOMENCLATURE_VIEW_TYPE)
			.forEach((leaf) => leaf.detach()
		);

		new Notice("Nomenclature table unloaded");
	}
}