const axios = require('axios');


class Product {
    constructor(pid, name, quantity, pricePerUnit, amountWithTax) {
        this.pid = pid;
        this.name = name;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.amountWithTax = amountWithTax;
    }

    static headers = {
        'Authorization': 'Basic ' + Buffer.from("guest:guest").toString('base64'),
        'Accept': 'application/json',
    }
    static async fromJSON(position = {}) {
        try {
        const {data} = await axios.get(position['product']['@href'], {headers: this.headers});
        return {
            pid: data.productNumber,
            name: data.name,
            quantity: position['quantity'],
            pricePerUnit: position['pricePerUnit'],
            amountWithTax: position['amount'],
        }
    } catch (error) {
        console.error('Error fetching product from OpenCRX', error);
        }
    }
}

module.exports = Product;


