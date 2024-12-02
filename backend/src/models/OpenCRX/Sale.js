const axios = require("axios");

class Sale {
    constructor(oid, priority, name, description, contractRole, order = [], costumer) {
        this.oid = oid;
        this.priority = priority;
        this.name = name;
        this.order = order;
        this.customer = costumer;
    }

    static headers = {
        'Authorization': 'Basic ' + Buffer.from("guest:guest").toString('base64'),
        'Accept': 'application/json',
    }

    addProduct(product) {
        if(this.order.find(p => p.oid === product.oid))
            throw new Error(`Ein Produkt mit der ID ${product.oid} existiert bereits.`);
        this.order.push(product);
    }

    static async fromJSON(sale = {}) {

        return {
            oid: sale.contractNumber,
            priority: sale.priority,
            name: sale.name,
            customer: await this.getCustomer(sale),
        }
    }

    static async getCustomer(sale={}) {
        // check if order has href to costumer
        const customerUrl = sale['customer']['@href'];
        if (!customerUrl) throw new Error('No customer URL found!');

        const {data} = await axios.get(customerUrl, {headers: Sale.headers}).catch(
            _ => {
                throw new Error('Error fetching costumer from OpenCRX');
            }
        );
        const name = data['name'];
        if (!name) throw new Error('Error fetching costumer from OpenCRX');
        return name;
    }

    static async getSalesRep(sale={}) {
        // check if order has href to order
        const salesRepURL = sale['salesRep']['@href'];
        if (!salesRepURL) throw new Error('No salesRep URL found!');

        const response = await axios.get(salesRepURL, { headers: Sale.headers }).catch(
            _ => {
                throw new Error('Error fetching salesRep from OpenCRX');
            }
        );
        if (!response.data) throw new Error("No salesRep data found!");

        const governmentId = response.data['governmentId'];
        if (!governmentId) return null;

        return governmentId.toString();
    }
}

module.exports = Sale;