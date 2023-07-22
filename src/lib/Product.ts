import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

export interface IPluginConfig {
    hashCodes: { [file: string]: string },
    id: string,
    pluginDir: string,
    priority: number,
    styles: string[],
    scripts: string[],
}

export class Product {

    private _productDir: string;
    private _data: any;
    private _pluginConfigs: IPluginConfig[];

    constructor(productDir: string) {

        this._productDir = productDir;
        this._pluginConfigs = [];
        this._data = {};
    }

    read() {

        this.readProductData();

        this.readPluginsConfig();
    }

    private readProductData() {

        const filename = join(this._productDir, "product.json");

        const resp = readFileSync(filename);

        const content = resp.toString();

        this._data = JSON.parse(content);
    }

    getProductDir() {

        return this._productDir;
    }

    private readPluginsConfig() {

        const pluginsDir = join(this._productDir, "plugins");

        const fileList = readdirSync(pluginsDir);

        const configs = [];

        for (const file of fileList) {

            const pluginDir = join(pluginsDir, file);

            if ((statSync(pluginDir)).isDirectory()) {

                const configFile = join(pluginDir, "plugin.json");

                const config: IPluginConfig = JSON.parse(
                    readFileSync(configFile).toString());

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

    getVersion(): string {

        return this._data.version;
    }

    getTitle() {

        return this._data.title;
    }

    getData() {

        return this._data;
    }
}