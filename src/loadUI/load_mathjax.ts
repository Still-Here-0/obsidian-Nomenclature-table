import { finishRenderMath, renderMath } from "obsidian";
import * as con from "../consts";


export async function load(text: string, is_mathjax: boolean): Promise<HTMLSpanElement> {
    let span = createSpan({cls: con.CSS_MODEL_MATH_ON});
    
    if (is_mathjax) {
        tryLoadingMathjax(text, span);
    }
    else {
        textSpan(text, span);
    }
    
    return span;
}

export async function loadModal(text: string): Promise<HTMLElement> {

    let mathJax_element = renderMath(text, false);
    await finishRenderMath();

    return mathJax_element;
}

async function tryLoadingMathjax(text: string, span: HTMLSpanElement) {
    try {
        let mathJax_element = renderMath(text, false);
        await finishRenderMath();

        span.appendChild(mathJax_element)
    }
    catch(ReferenceError) {
        console.error(ReferenceError);

        textSpan(text, span);
    }
}

function textSpan(text: string, span: HTMLSpanElement) {
    span.empty();
    span.setText(text);
}
