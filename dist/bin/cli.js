#!/usr/bin/env node
import { ArgumentParser } from "argparse";
import { folderToJson } from "./folderToJson.js";
import { packProduct } from "./packProduct.js";
const parser = new ArgumentParser();
parser.add_argument("--folder-to-json", "-j", { help: "Pack the given directory into a JSON file. The file is saved in the --output file." });
parser.add_argument("--pack-product", "-p", { help: "Pack the given product's plugins in a single 'product.all' plugin. Use --skip for ignoring certain files." });
const args = parser.parse_args();
if (args.folder_to_json) {
    folderToJson(args);
}
if (args.pack_product) {
    packProduct(args);
}
