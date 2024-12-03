const axios = require('axios');


class Product {
    constructor(pid, name, productNr ,quantity, pricePerUnit, amountWithTax) {
        this.pid = pid;
        this.productNr = productNr;
        this.name = name;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.amountWithTax = amountWithTax;
    }

    static headers = {
        'Authorization': 'Basic ' + Buffer.from("guest:guest").toString('base64'),
        'Accept': 'application/json',
    }
    static async fromJSON_position(position = {}) {
        try {
            const product = await this.fromJSON_product(position['product']);
        return {
            ...product,
            quantity: position['quantity'],
            pricePerUnit: position['pricePerUnit'],
            amountWithTax: position['amount'],
        }
    } catch (error) {
        console.error('Error fetching product from OpenCRX', error);
        }
    }

    static async fromJSON_product(product = {}) {

        return {
            pid: extractIdentityFromURL(product['@href']),
            productNr: product.productNumber,
            name: product.name,
        }
    }
}

function extractIdentityFromURL(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
}

module.exports = Product;


