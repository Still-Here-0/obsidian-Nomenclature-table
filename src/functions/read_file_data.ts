import { App, TFile } from "obsidian";


export async function readFileData(app: App, file: TFile) {
    let matter = require('gray-matter');
    let file_matter = matter(await app.vault.read(file));

    // console.log("Nomenclature data:\n", file_matter);
    return file_matter;
}