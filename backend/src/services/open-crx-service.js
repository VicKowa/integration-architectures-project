const axios = require('axios');
const {response} = require("express");
const Sale = require('../models/OpenCRX/Sale');
const Product = require('../models/OpenCRX/Product');

const SalesAPI = "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard";
const ProductAPI = "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.product1/provider/CRX/segment/Standard/";

const username = "guest";
const password = "guest";

const headers = {
    'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
    'Accept': 'application/json',
}

exports.getAllSales = async function (){
    try {
        // fetch all SalesOrders from OpenCRX
        const { data } = await axios.get(`${SalesAPI}/salesOrder`, { headers});
        const salesOrders = data.objects;

        return await Promise.all(salesOrders.map(sale => Sale.fromJSON(sale)));

    } catch (error) {
        console.error('Error fetching sales from OpenCRX', error);
        throw new Error('Error fetching sales from OpenCRX');
    }
}

exports.getSales = async function (sid){
    try {
        // fetch all SalesOrders from OpenCRX
        const { data } = await axios.get(`${SalesAPI}/salesOrder`, { headers});
        const salesOrders = data.objects;

        const filtered_salesOrders =  (await Promise.all(
            salesOrders
                .map(async (order) => {
                    // check if order has href to order

                    const governmentId = await Sale.getSalesRep(order);
                    if (!governmentId) return null;

                    return governmentId.toString() === sid ? order : null;
                })
        )).filter(order => order !== null);

        return await Promise.all(filtered_salesOrders.map(sale => Sale.fromJSON(sale)));

    } catch (error) {
        console.error('Error fetching sales from OpenCRX', error);
        throw new Error('Error fetching sales from OpenCRX');
    }
}

exports.getProductsFromSale = async function (oid){
    try {
        const { data } = await axios.get(`${SalesAPI}/salesOrder/${oid}/position`, { headers });
        const positions = data.objects;

        return await Promise.all(positions.map(async position => Product.fromJSON_position(position)));

    } catch (error) {
        console.error('Error fetching products from OpenCRX', error);
        throw new Error('Error fetching products from OpenCRX');
    }
}

exports.getProduct = async function (pid){
    try {
        const { data } = await axios.get(`${ProductAPI}/product/${pid}`, { headers });
        return await Product.fromJSON_product(data);
    } catch (error) {
        throw new Error('Error fetching product from OpenCRX');
    }
}
