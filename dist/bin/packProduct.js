import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { Product } from "../lib/Product.js";
import { join } from "path";
export function packProduct(args) {
    const productDir = args.pack_product;
    const product = new Product(productDir);
    product.read();
    const allPluginDir = join(productDir, "plugins", "product.all");
    console.log("Removing previous 'plugins/product.all'");
    rmSync(allPluginDir, { force: true });
    console.log("Making new 'plugins/product.all'`");
    mkdirSync(allPluginDir);
    writeFileSync(join(allPluginDir, "plugin.json"), JSON.stringify({
        id: "product.all",
        scripts: ["product.all.js"]
    }, undefined, 4));
    let product_all_js = "";
    const pluginConfigs = product.getPluginConfigs();
    for (const config of pluginConfigs) {
        product_all_js += `\n// plugin: ${config.id}\n`;
        const pluginDir = join(productDir, "plugins", config.id);
        for (const script of config.scripts) {
            console.log(`Processing ${config.id}/${script}`);
            product_all_js += `\n// plugin: ${config.id} script: ${script}\n`;
            const scriptFile = join(pluginDir, script);
            product_all_js += readFileSync(scriptFile);
            rmSync(scriptFile);
        }
        // removes the "scripts" field from "plugin.json".
        const pluginFile = join(pluginDir, "plugin.json");
        const pluginData = JSON.parse(readFileSync(pluginFile).toString());
        pluginData.scripts = [];
        writeFileSync(pluginFile, JSON.stringify(pluginData, undefined, 4));
    }
    // creates product.all.js
    const productPluginDir = join(productDir, "plugins", "product.all");
    writeFileSync(join(productPluginDir, "product.all.js"), product_all_js);
}
