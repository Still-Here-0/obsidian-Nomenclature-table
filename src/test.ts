import { Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, TFile } from "obsidian";

export class EditorSug<T> extends EditorSuggest<T>{
    onTrigger(cursor: EditorPosition, editor: Editor, file: TFile | null): EditorSuggestTriggerInfo | null {
        throw new Error("Method not implemented.");
    }
    getSuggestions(context: EditorSuggestContext): T[] | Promise<T[]> {
        throw new Error("Method not implemented.");
    }
    renderSuggestion(value: T, el: HTMLElement): void {
        throw new Error("Method not implemented.");
    }
    selectSuggestion(value: T, evt: MouseEvent | KeyboardEvent): void {
        throw new Error("Method not implemented.");
    }

}