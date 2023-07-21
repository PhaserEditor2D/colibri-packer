import fs, { readFileSync, writeFileSync } from "fs";
import path from "path";
import { readJSON } from "./utils.js";

export function folderToJson(args) {

    const { folder_to_json } = args;

    console.log(`Packing folder ${folder_to_json} to JSON`);

    const data = {};

    packDir(data, folder_to_json);

    writeFileSync(path.basename(folder_to_json) + ".json", JSON.stringify(data, undefined, 1));
}

/**
 * * @param {any} data 
 * @param {string} dir
 * @param {string} dirKey 
 */
function packDir(data, dir, dirKey) {

    console.log("process", dir, "dirKey", dirKey);

    const files = fs.readdirSync(dir)

    for (const file of files) {

        const fullname = path.join(dir, file);

        const fileKey = dirKey ? `${dirKey}/${file}` : file;

        if (fs.statSync(fullname).isDirectory()) {

            packDir(data, fullname, fileKey);

        } else {

            data[fileKey] = readFileSync(fullname).toString();
        }
    }
}