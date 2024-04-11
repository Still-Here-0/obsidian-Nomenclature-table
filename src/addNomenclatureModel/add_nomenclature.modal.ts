import { NomenclatureView } from "../nomenclatureView/nomenclature.view";
import { App, Modal, Notice, Setting } from "obsidian";
import * as math from "../loadUI/load_mathjax";
import * as con from "../consts";
import { onClickSubmit } from "./model.on_click_submit";


export class addNomenclatureModal extends Modal {
    math_element: HTMLSpanElement;
    
    variable_text: string;
    description_text: string;
    is_variable_math: boolean;

    viewParent: NomenclatureView;

    constructor(view_parent: NomenclatureView) {
        super(view_parent.app);
        this.math_element = createDiv({cls: con.CSS_MODEL_MATH_ON});

        this.viewParent = view_parent;
        
        this.variable_text = "";
        this.description_text = "";
        this.is_variable_math = true;
    }

    async onOpen() {
        this.contentEl.setText("Add new nomenclature data to file:\n");

        new Setting(this.contentEl)
            .setName("Is it a number or a symbol?")
            .addToggle(
                (toggle) => 
                toggle.setValue(true).onChange((value) => { 
                    this.is_variable_math = value;
                    this.toggleMath(this, value);
                })
            );

        new Setting(this.contentEl)
            .setName("Variable")
            .addText((text) =>
                text.onChange(async (text) => {
                    this.variable_text = text;
                    this.setMathElement(this, text);
                })
            );
        
        this.contentEl.appendChild(this.math_element);
        
        new Setting(this.contentEl)
            .setName("Description")
            .addText((text) =>
                text.onChange((text) => {
                    this.description_text = text;
                })
            );
    
        new Setting(this.contentEl).addButton(
            (btn) => btn.setButtonText("Submit")
                .setCta()
                .onClick( async () => { await onClickSubmit(this, false) })
        )
    }

    async setMathElement(self: addNomenclatureModal, text: string) {
        
        let mathjax = await math.loadModal(text);
        
        self.math_element.empty();
        self.math_element.appendChild(mathjax)
    }

    toggleMath(self: addNomenclatureModal, value: boolean) {
        this.is_variable_math = value;

        if (value) {
            self.math_element.removeClass(con.CSS_MODEL_MATH_OFF);
            self.math_element.addClass(con.CSS_MODEL_MATH_ON);
        }
        else {
            self.math_element.removeClass(con.CSS_MODEL_MATH_ON);
            self.math_element.addClass(con.CSS_MODEL_MATH_OFF);
        }
    }

    onClose() {
      this.contentEl.empty();
    }
  }