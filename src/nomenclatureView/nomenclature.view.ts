import { 
    ItemView,
    TFile,
    WorkspaceLeaf,
} from "obsidian";

import * as con from "../consts";
import * as table from "../loadUI/load_table"
import * as addButton from "../loadUI/addButton/load_add_button"
import { readFileData } from "../functions/read_file_data";

export class NomenclatureView extends ItemView {

    current_active_file: TFile | null | undefined;

    constructor(leaf: WorkspaceLeaf){
        super(leaf);
    }

    getViewType(): string { // Returns views type
        return con.NOMENCLATURE_VIEW_TYPE;
    }
    getDisplayText(): string { // Returns views name
        return "Nomenclature table";
    }
    getIcon(): string {
        return "file-spreadsheet";
    }

    async onOpen() { // Builds the content of the view

        this.renderAddButton();

        this.current_active_file = this.app.workspace.activeEditor?.file;

        this.app.workspace.on(
            'active-leaf-change', 
            async (leaf: WorkspaceLeaf) => { await this.reloadDataComponents(leaf) }
        );
    }

    async reloadDataComponents(leaf: WorkspaceLeaf) {
        // console.log("Current leaf type:\n", leaf.view.getViewType());

        // console.log(`Last file editor name before:\n${this.current_active_file?.name}`);
        let current_file = this.app.workspace.activeEditor?.file;
        // console.log(`Current file editor name:\n${current_file?.name}`);
        
        if (leaf.view.getViewType() == con.OBSIDIAN_EMPTY_TYPE) {
            // console.log("Clear view");
            this.current_active_file = current_file;
            this.contentEl.empty();
        }
        else if (leaf.view.getViewType() != con.OBSIDIAN_MARDOWN_TYPE) {
            // console.log("Do nothing");
        }
        else if (this.current_active_file != current_file) {
            // console.log("New data");
            this.current_active_file = current_file;
            await this.renderView();
        }
        // console.log(`Last file editor name after:\n${this.current_active_file?.name}`);
    }

    renderAddButton() {
        let addButton_element = addButton.load(this);
        this.containerEl.appendChild(addButton_element); // Adds a new layer to the container view
    }

    async renderView() {
        // console.log("View loaded!");
        if (this.current_active_file === null || this.current_active_file === undefined) {
            console.error("Editor error")
            return;
        }

        const table_container = this.contentEl;

        let file_matter = await readFileData(this.app, this.current_active_file);
        
        let table_element: HTMLTableElement | undefined;
        if (file_matter.data['Nomenclature'] !== undefined) {
            // console.log("Load table");
            table_element = await table.load({
                type: 'file',
                data: file_matter.data['Nomenclature']
            });
        }
        
        table_container.empty();
        table_container.createEl('h2', {text: "File nomenclature table"});
        if (table_element !== undefined)
            table_container.appendChild(table_element)
        // console.log("View container elements:\n", this.containerEl.children);
    }

    async onClose() { // Clears views resouces
        this.contentEl.empty();
    }
}
