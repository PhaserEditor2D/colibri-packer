import { mkdirSync, readFileSync, readdirSync, rmSync, rmdirSync, statSync, writeFileSync } from "fs";
import { Product } from "../lib/Product.js";
import { join } from "path";

export function packProduct(args: any) {

    const productDir = args.pack_product;

    const productPluginDir = join(productDir, "plugins", "product.all");

    console.log("Cleaning 'plugins/product.all'");

    rmSync(productPluginDir, { force: true });

    console.log("Start processing product");

    const product = new Product(productDir);

    product.read();

    let product_all_js = "";
    let product_all_css = "";

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

        for (const style of config.styles) {

            console.log(`Processing ${config.id}/${style}`);

            product_all_js += `\n// plugin: ${config.id} style: ${style}\n`;

            const styleFile = join(pluginDir, style);

            product_all_css += readFileSync(styleFile);

            rmSync(styleFile);
        }

        // removes the "scripts", "styles" fields from "plugin.json".

        const pluginFile = join(pluginDir, "plugin.json");
        // removes pluginFile, we don't need it anymore,
        // only the product.all/plugin.json file is needed.
        rmSync(pluginFile);

        // const pluginData = JSON.parse(readFileSync(pluginFile).toString());
        // pluginData.scripts = [];
        // pluginData.styles = [];
        // writeFileSync(pluginFile, JSON.stringify(pluginData, undefined, 4));

        removeEmptyFolder(pluginDir);
    }

    // create product.all files

    console.log("Creating 'plugins/product.all'`");

    mkdirSync(productPluginDir);

    writeFileSync(join(productPluginDir, "plugin.json"), JSON.stringify({
        id: "product.all",
        scripts: ["product.all.js"],
        styles: ["product.all.css"]
    }, undefined, 4));

    writeFileSync(join(productPluginDir, "product.all.js"), product_all_js);

    writeFileSync(join(productPluginDir, "product.all.css"), product_all_css);
}

function removeEmptyFolder(dir: string) {

    let removeDir = true;

    const dirFiles = readdirSync(dir);

    for(const file of dirFiles) {

        const filePath = join(dir, file);

        if (file === ".DS_Store") {

            rmSync(filePath);

            continue;
        }

        const stat = statSync(filePath);

        if (stat.isDirectory()) {

            if (!removeEmptyFolder(filePath)) {

                removeDir = false;
            }

        } else {

            removeDir = false;
        }
    }

    if (removeDir) {

        rmdirSync(dir);
    }

    return removeDir;
}
