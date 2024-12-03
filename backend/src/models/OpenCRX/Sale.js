const axios = require('axios');
const { response } = require("express");
const Product = require('./Product');

class Sale {
    constructor(oid, priority, name, description, contractRole, order, costumer) {
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

    static async getOrders(sale={}) {
        try {
            const positions = await axios.get(`${sale['@href']}/position`, { headers: { ...Sale.headers } }).then(response => response.data);
            if(!positions.objects) return {};
            return await Promise.all(positions.objects.map(async position => Product.fromJSON(position)));
        } catch (error) {
            console.error('Error fetching orders from OpenCRX', error);
            throw new Error('Error fetching orders from OpenCRX');
        }

    }

    static async fromJSON(sale = {}) {
        return {
            oid: extractIdentityFromURL(sale['@href']),
            priority: sale.priority,
            name: sale.name,
            customer: await this.getCustomer(sale),
            order: await this.getOrders(sale),
        }
    }

    static async getCustomer(sale={}) {
        const {data} = await axios.get(sale['customer']['@href'], {headers: Sale.headers}).catch(
            _ => {
                throw new Error('Error fetching costumer from OpenCRX');
            }
        );
        const name = data['name'];
        if (!name) throw new Error('Error fetching costumer from OpenCRX');
        return name;
    }

    static async getSalesRep(sale={}) {
        const response = await axios.get(sale['salesRep']['@href'], { headers: Sale.headers }).catch(
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

function extractIdentityFromURL(url) {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
}