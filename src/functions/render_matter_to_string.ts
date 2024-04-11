

export function renderMatterToString(file_matter: any): string {
    let matter = require('gray-matter');

    let file_text: string = matter.stringify(file_matter);

    // console.log("File text", file_text);

    return file_text;
}
