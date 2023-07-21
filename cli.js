import { ArgumentParser } from "argparse";
import { folderToJson } from "./folderToJson.js";

const parser = new ArgumentParser();

parser.add_argument("--folder-to-json", "-j", { help: "Pack the given directory into a JSON file. The file get's the same name of the folder." });

const args = parser.parse_args();

console.log(args);

if (args.folder_to_json) {

    folderToJson(args);
}