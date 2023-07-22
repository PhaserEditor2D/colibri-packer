import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
export class Product {
    _productDir;
    _data;
    _pluginConfigs;
    constructor(productDir) {
        this._productDir = productDir;
        this._pluginConfigs = [];
        this._data = {};
    }
    read() {
        this.readProductData();
        this.readPluginsConfig();
    }
    readProductData() {
        const filename = join(this._productDir, "product.json");
        const resp = readFileSync(filename);
        const content = resp.toString();
        this._data = JSON.parse(content);
    }
    getProductDir() {
        return this._productDir;
    }
    readPluginsConfig() {
        const pluginsDir = join(this._productDir, "plugins");
        const fileList = readdirSync(pluginsDir);
        const configs = [];
        for (const file of fileList) {
            const pluginDir = join(pluginsDir, file);
            if ((statSync(pluginDir)).isDirectory()) {
                const configFile = join(pluginDir, "plugin.json");
                const config = JSON.parse(readFileSync(configFile).toString());
                configs.push(config);
                config.hashCodes = {};
                config.priority = config.priority || 0;
                config.scripts = config.scripts || [];
                config.styles = config.styles || [];
                for (const file of [...config.scripts, ...config.styles]) {
                    const scriptFile = join(pluginDir, file);
                    const stat = statSync(scriptFile);
                    if (stat.isFile()) {
                        const hash = `${stat.size}.${stat.mtimeMs}`;
                        config.hashCodes[file] = hash;
                    }
                }
            }
        }
        configs.sort((a, b) => {
            return a.priority - b.priority;
        });
        this._pluginConfigs = configs;
    }
    getPluginConfigs() {
        return this._pluginConfigs;
    }
    getVersion() {
        return this._data.version;
    }
    getTitle() {
        return this._data.title;
    }
    getData() {
        return this._data;
    }
}
