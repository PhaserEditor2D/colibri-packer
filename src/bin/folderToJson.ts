import fs, { readFileSync, writeFileSync } from "fs";
import path from "path";

export function folderToJson(args: any) {

    const { folder_to_json } = args;

    const data: any = {};

    packDir(data, folder_to_json);

    const file = path.join(
        path.dirname(folder_to_json),
        path.basename(folder_to_json) + ".json");

    console.log(`Out ${file}`);

    writeFileSync(file, JSON.stringify(data, undefined, 1));
}

/**
 * * @param {any} data 
 * @param {string} dir
 * @param {string} dirKey 
 */
function packDir(data: any, dir: string, dirKey?: string,) {

    const files = fs.readdirSync(dir)

    for (const file of files) {

        const fullname = path.join(dir, file);

        const fileKey = dirKey ? `${dirKey}/${file}` : file;

        if (fs.statSync(fullname).isDirectory()) {

            packDir(data, fullname, fileKey);

        } else {

            console.log(`Store ${fileKey}`);

            const content = readFileSync(fullname).toString();

            data[fileKey] = file.endsWith(".json") ? JSON.parse(content) : content;
        }
    }
}