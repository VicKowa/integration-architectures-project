const axios = require('axios');
const {serveFiles} = require("swagger-ui-express");


class OpenCRXProductDTO {
    constructor(xri, name, productNumber, quantity, pricePerUnit, amountWithTax) {
        this.xri = xri;
        this.productNumber = productNumber;
        this.name = name;
        this.pricePerUnit = pricePerUnit;
        this.amountWithTax = amountWithTax;
    }

    static headers = {
        'Authorization': 'Basic ' + Buffer.from("guest:guest").toString('base64'),
        'Accept': 'application/json',
    }
    static async fromJSON_position(position = {}) {
        try {
            const product = await this.fromJSON_product(position['product']['@href']);
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

    static async fromJSON_product(productURL) {
        const { data } = await axios.get(productURL, { headers: { ...OpenCRXProductDTO.headers } });
        return {
            productNumber: extractIdentityFromURL(productURL),
            productNr: data.productNumber,
            name: data.name,
        }
    }
}

function extractIdentityFromURL(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
}

module.exports = OpenCRXProductDTO;


