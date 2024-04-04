import { 
    ItemView,
    Notice,
    TFile,
    WorkspaceLeaf,
    finishRenderMath,
    renderMath,
} from "obsidian";

import * as con from "./consts";
import * as matter from "gray-matter";

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

        this.createAddButton();

        this.current_active_file = this.app.workspace.activeEditor?.file;

        this.app.workspace.on(
            'active-leaf-change', 
            async (leaf: WorkspaceLeaf) => {
                // console.log("Current leaf type:\n", leaf.view.getViewType());

                // console.log(`Last file editor name before:\n${this.last_active_file?.name}`);
                let current_file = this.app.workspace.activeEditor?.file;
                // console.log(`Current file editor name:\n${current_file?.name}`);
                
                if (leaf.view.getViewType() == con.OBSIDIAN_EMPTY_TYPE) {
                    // console.log("Clear view");
                    this.current_active_file = current_file;
                }
                else if (leaf.view.getViewType() != con.OBSIDIAN_MARDOWN_TYPE) {
                    // console.log("Do nothing");
                }
                else if (this.current_active_file != current_file) {
                    // console.log("New data");
                    this.current_active_file = current_file;
                    await this.renderView();
                }
                // console.log(`Last file editor name after:\n${this.last_active_file?.name}`);
            }
        );
    }

    async renderView() {
        // console.log("View loaded!");
        if (this.current_active_file === null || this.current_active_file === undefined) {
            console.error("Editor error")
            return;
        }
        
        let table_element = this.loadTableheading();

        let file_data = await this.loadNomenclatureData();

        await this.loadTableContent(table_element, file_data);

        // console.log("View container elements:\n", this.containerEl.children);
    }

    loadTableheading(): HTMLTableElement {
        const table_container = this.containerEl.children[1];

        table_container.empty();
        table_container.createEl('h2', {text: "Nomenclature table"});
        
        let table_element = table_container.createEl('table', {cls: "nomenclature_table"});

        table_element
            .appendChild(createEl("tr"))
            .append(
                createEl("th", { text: "Variable", cls: `${con.CSS_ITEM} ${con.CSS_ITEM_HEADER}`}),
                createEl("th", { text: "Description", cls: `${con.CSS_ITEM} ${con.CSS_ITEM_HEADER}`})
            );

        return table_element;
    }

    async loadNomenclatureData(): Promise<Array<Array<string>> | undefined>{
        let yaml_cached = this.app.metadataCache.getFileCache(this.current_active_file!)
                            ?.sections?.find(sec =>  sec.type == "yaml");

        if (yaml_cached === undefined){
            console.log("No yaml found on file");
            return;
        }

        let matter = require('gray-matter');

        let active_file_text = matter(await this.app.vault.read(this.current_active_file!));

        console.log(`Nomenclature data:\n${active_file_text.data?.Nomenclature}`);
        return active_file_text.data?.Nomenclature;
    }

    async loadTableContent(table_element: HTMLTableElement, file_data: Array<Array<string>> | undefined) {
        for (let i = 0; i < 10; i++) {
            let table_row_element = createEl("tr", {cls: con.CSS_TABLE_ROW});
            table_row_element.onClickEvent((ev: MouseEvent) => { this.handleClickOnTableRow(table_element, table_row_element, ev) });
            
            let mathjax_text = "\\rho_{d" + i + "}^H";
            
            let varible_container = createEl("td", {text: mathjax_text, cls: `${con.CSS_ITEM} ${con.CSS_ITEM_VARIABLE}`});
            let description_container = createEl("td", {text: "Descript of i", cls: `${con.CSS_ITEM} ${con.CSS_ITEM_DESCRIPTION}`});

            let mathJax_element = await this.tryGetMathJaxElement(mathjax_text);
            // console.log("MathJax element:\n", mathJax_element);
            
            appendMathjax(mathjax_text, mathJax_element, varible_container);

            table_element
                .appendChild(table_row_element)
                .append(
                    varible_container,
                    description_container
                )
        }
    }

    async loadFileData(table_element: HTMLTableElement, file_data: Array<Array<string>>) {
        for (let i = 0; i < file_data?.length; i++) {
            let table_row_element = createEl("tr", {cls: con.CSS_TABLE_ROW});
            table_row_element.onClickEvent((ev: MouseEvent) => { this.handleClickOnTableRow(table_element, table_row_element, ev) });
            
            let mathjax_text = "\\rho_{d" + i + "}^H";
            
            let varible_container = createEl("td", {text: mathjax_text, cls: `${con.CSS_ITEM} ${con.CSS_ITEM_VARIABLE}`});
            let description_container = createEl("td", {text: "Descript of i", cls: `${con.CSS_ITEM} ${con.CSS_ITEM_DESCRIPTION}`});

            let mathJax_element = await this.tryGetMathJaxElement(mathjax_text);
            // console.log("MathJax element:\n", mathJax_element);
            
            appendMathjax(mathjax_text, mathJax_element, varible_container);

            table_element
                .appendChild(table_row_element)
                .append(
                    varible_container,
                    description_container
                )
        }

        function appendMathjax(
            mathjax_text: string,
            mathJax_element: HTMLSpanElement | undefined,
            varible_container: HTMLTableCellElement
        ) {
            if (mathJax_element != undefined) {
                varible_container.appendChild(mathJax_element);
            }
            else {
                varible_container.appendChild(
                    createSpan(
                        {
                            text: mathjax_text,
                            cls: con.CSS_ITEM_VARIABLE_MATH
                        }
                    )
                )
            }
        }
    }

    async tryGetMathJaxElement(text: string): Promise<HTMLSpanElement | undefined> {
        
        let span = createSpan({cls: con.CSS_ITEM_VARIABLE_MATH});

        try {
            let mathJax_element = renderMath(text, false);
            await finishRenderMath();

            span.appendChild(mathJax_element)

            return span;
        } catch (ReferenceError) {
            console.error(ReferenceError);
        }
    }

    handleClickOnTableRow(table: HTMLTableElement, clicked_row: HTMLElement, ev: MouseEvent) {

        if (ev.button == 0) {
    
            deselect_last_row();
            
            clicked_row.addClass(con.CSS_ROW_SELECTED);
            
            let item_variable_text = getSelectedeRowText();

            navigator.clipboard.writeText(item_variable_text);
            new Notice("Text copyed to clip board '" + item_variable_text + "'");
        }
        
        function deselect_last_row() {
            for (let i = 0; i < table.children.length; i++) {
                let table_row = table.children[i];
    
                table_row.removeClass(con.CSS_ROW_SELECTED);
            }
        }

        function getSelectedeRowText(): string {
            let item_variable_text = con.DEFAULT_TEXT;
            for (let i = 0; i < clicked_row.children.length; i++) {
                if (clicked_row.children[i].className.contains(con.CSS_ITEM_VARIABLE)) {
                    item_variable_text = clicked_row.children[i].textContent ?? con.DEFAULT_TEXT;
                    break;
                }
            }

            return item_variable_text;
        }
    }

    createAddButton() {
        this.containerEl.createEl("button", {
            text: "Add Nomenclature", 
            cls: con.CSS_ADD_BUTTON
        }).onClickEvent(
            this.addNomenclatureRow
        );
    }

    addNomenclatureRow(ev: MouseEvent): void {
        // console.log("Mouse event info:\n", ev);
        if (ev.button != 0) { // Left mouse button
            return;
        }

        // console.log("Add nomenclature") // TODO
    }

    async onClose() { // Clears views resouces
        // console.log("\\/\\/\\/\\/\\/\\") TODO what to do where?
    }
}
