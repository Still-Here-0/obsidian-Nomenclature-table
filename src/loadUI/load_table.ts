import { TableData } from "src/interface/table_data";
import * as math from "./load_mathjax";
import { Notice } from "obsidian";
import * as con from "../consts";

export async function load(tableData: TableData): Promise<HTMLTableElement> {
    // console.log(`Table data:\n`, tableData);
    let table_element = createEl('table', { cls: con.CSS_TABLE });

    loadHeading(table_element);

    await loadElements(table_element, tableData.data);

    return table_element;
}

function loadHeading(table_element: HTMLTableElement) {

    table_element.appendChild(
        createEl('tr')
        ).append(
            createEl('th', { text: con.HEADER_VAR, cls: `${con.CSS_ITEM} ${con.CSS_ITEM_HEADER}` }),
            createEl('th', { text: con.HEADER_DES, cls: `${con.CSS_ITEM} ${con.CSS_ITEM_HEADER}` }),
    )
}

async function loadElements(table_element: HTMLTableElement, data: con.NOMENCLATURE_DATA) {
    for (let variable_text of Object.keys(data)) {
        let description = data[variable_text][0];
        let is_mathjax = Boolean(data[variable_text][1]);
        
        let table_row = createEl('tr', { cls: con.CSS_TABLE_ROW });

        table_row.onClickEvent((ev: MouseEvent) => { handleClickOnTableRow(table_element, table_row, ev) });

        let variable_processed = await math.load(variable_text, is_mathjax);


        let variable_element = createEl('td', {text: variable_text, cls: `${con.CSS_ITEM} ${con.CSS_ITEM_VARIABLE}`});
        variable_element.appendChild(variable_processed);

        let description_element = createEl('td', {text: description, cls: `${con.CSS_ITEM} ${con.CSS_ITEM_DESCRIPTION}`})

        table_row.append(
            variable_element,
            description_element
        )

        table_element.appendChild(table_row);
    }
}

function handleClickOnTableRow(table: HTMLTableElement, clicked_row: HTMLElement, ev: MouseEvent) {

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
