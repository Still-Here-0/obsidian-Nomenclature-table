import { addNomenclatureModal } from "src/addNomenclatureModel/add_nomenclature.modal";
import { newNomenclature } from "src/nomenclatureView/view.new_nomenclature";
import { Notice, Setting } from "obsidian";
import * as con from "../consts";


export async function onClickSubmit(self: addNomenclatureModal, retry: boolean) {
    if (
        self.description_text == "" ||
        self.description_text == undefined ||
        self.variable_text == "" ||
        self.variable_text == undefined
    ) {
        new Notice("Neither variable field nor description field can be blank")
        return;
    }

    let feed_back = await newNomenclature(
        self.viewParent,
        self.description_text,
        self.is_variable_math,
        self.variable_text,
        retry
    );

    if (feed_back === con.SUCCESS) {
        self.close();
    }
    else if (feed_back === con.VARIABLE_EXISTS_ERROR) {
        renderRetryWin(self);
    }
    else {
        new Notice("Failed to add new nomenclature");
    }
}

function renderRetryWin(self: addNomenclatureModal) {
    self.contentEl.empty();

        self.contentEl.setText("Add new nomenclature data to file:");

        new Setting(self.contentEl)
            .setName(`Variable '${self.variable_text}' already exists, do you want to over write it?`)
            .addButton(
                (btn) => btn.setButtonText("No")
                    .setCta()
                    .onClick( () => { self.close() })
            ).addButton(
                (btn) => btn.setButtonText("Yes")
                    .setCta()
                    .onClick( async () => { 
                        await onClickSubmit(self, true);
                        self.close();
                    })
            )
}