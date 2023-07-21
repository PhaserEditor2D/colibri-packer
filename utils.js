import { readFile } from "fs/promises";

/**
 * @param {string} file 
 */
export async function readJSON(file) {

    const buf = await readFile(file);

    const data = JSON.parse(buf.toString());

    return data;
}