#!/usr/bin/env node

import { ArgumentParser } from "argparse";
import { folderToJson } from "./folderToJson.js";

const parser = new ArgumentParser();

parser.add_argument("--folder-to-json", "-j", { help: "Pack the given directory into a JSON file. The file is saved in the --output file." });

const args = parser.parse_args();

if (args.folder_to_json) {

    folderToJson(args);
}