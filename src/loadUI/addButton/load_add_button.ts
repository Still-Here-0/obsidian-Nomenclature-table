import { addNomenclatureModal } from "src/addNomenclatureModel/add_nomenclature.modal";
import { NomenclatureView } from "src/nomenclatureView/nomenclature.view";
import * as con from "../../consts";


export function load(view: NomenclatureView): HTMLButtonElement{
    let addButton_element = createEl("button", {
        text: "Add Nomenclature", 
        cls: con.CSS_ADD_BUTTON
    })
    
    addButton_element.onClickEvent(
        (ev: MouseEvent) => { addNomenclatureRow(ev, view) }
    );

    return addButton_element
}

function addNomenclatureRow(ev: MouseEvent, view: NomenclatureView): void {
    // console.log("Mouse event info:\n", ev);
    if (ev.button === 0) { // Left mouse button
        new addNomenclatureModal(view).open();
        return;
    }
}