import { Product } from "./Product.js";

export class IndexHtmlBuilder {

    private _product: Product;

    constructor(product: Product) {

        this._product = product;
    }

    buildHtml() {

        const configs = this._product.getPluginConfigs();

        return `
        
<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>${this._product.getTitle()} v${this._product.getVersion()}</title>

	<link rel="icon" type="image/png" href="/editor/static/favicon.png">

    ${configs.map(config => {

            return `
        <!-- ${config.id} -->
        ${config.styles.map(style => {

                return `<link href="/editor/app/plugins/${config.id}/${style}?v=${config.hashCodes[style]}" rel="stylesheet">`;
            }).join("\n\t\t")}
        `;
        }).join("")}
</head>
<body>
    ${configs.map(config => {

            return `
        <!-- ${config.id} -->
        ${config.scripts.map(script => {

                return `<script src="/editor/app/plugins/${config.id}/${script}?v=${config.hashCodes[script]}"></script>`;
            }).join("\n\t\t")}
        `;
        }).join("")}
</body>
</html>
        `;
    }
}