import { renderMatterToString } from "src/functions/render_matter_to_string";
import { readFileData } from "src/functions/read_file_data";
import { NomenclatureView } from "./nomenclature.view";
import * as con from "../consts";

export async function newNomenclature(
    self: NomenclatureView,
    description: string,
    is_mathjax: boolean,
    variable: string,
    retry: boolean
): Promise<string> {
    
    // console.log("New file data:", self.file_matter.data['Nomenclature']);
    let file_matter;
    try {
        if (self.current_active_file === null || self.current_active_file === undefined) {
            console.error("No active file");
            return con.FILE_ERROR;
        }

        file_matter = await readFileData(self.app, self.current_active_file);

        if (file_matter.data['Nomenclature'] === undefined || file_matter.data['Nomenclature'] === null) {
            file_matter.data['Nomenclature'] = {[variable]: [description, is_mathjax]};
        }
        else if (file_matter.data['Nomenclature'][variable] === undefined || retry) {
            file_matter.data['Nomenclature'][variable] = [description, is_mathjax];
        }
        else {
            return con.VARIABLE_EXISTS_ERROR;
        }
    }
    catch (e) {
        console.error(e);
        return con.UNKNOWN_ERROR;
    }

    // console.log("New file matter", file_matter);
    
    try {
        self.app.vault.modify(self.current_active_file, renderMatterToString(file_matter));
    }
    catch (e) {
        console.error(e);
        return con.UNKNOWN_ERROR;
    }

    await self.renderView();

    return con.SUCCESS;
}