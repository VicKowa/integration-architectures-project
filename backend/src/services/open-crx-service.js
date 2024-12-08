const axios = require('axios');
const {response} = require("express");
const Sale = require('../models/OpenCRX/Sale');
const Product = require('../models/OpenCRX/Product');
const Environment = require('../../environments/environment');
const envOpenCRX = Environment.default.openCRX;

exports.getAllSales = async function (){
    try {
        // fetch all SalesOrders from OpenCRX
        const { data } = await axios.get(`${envOpenCRX.salesURL}/salesOrder`, { headers: envOpenCRX.headers });
        const salesOrders = data.objects;

        return await Promise.all(salesOrders.map(sale => Sale.fromJSON(sale)));

    } catch (error) {
        console.error('Error fetching sales from OpenCRX', error);
        throw new Error('Error fetching sales from OpenCRX');
    }
}

exports.getSales = async function (sid, year){
    try {
        // fetch all SalesOrders from OpenCRX
        const { data } = await axios.get(`${envOpenCRX.salesURL}/salesOrder`, { headers: envOpenCRX.headers });
        const salesOrders = data.objects;

        let filtered_salesOrders =  (await Promise.all(
            salesOrders
                .map(async (order) => {
                    // check if order has href to order

                    const governmentId = await Sale.getSalesRep(order);
                    if (!governmentId) return null;

                    return governmentId.toString() === sid ? order : null;
                })
        )).filter(order => order !== null);
        // filter by year if year is given
        if (year) {
            filtered_salesOrders = filtered_salesOrders.filter(order=> {
                if(!order.activeOn) return false;
                return order && order.activeOn.includes(year);
            });
        }

        return await Promise.all(filtered_salesOrders.map(sale => Sale.fromJSON(sale)));

    } catch (error) {
        console.error('Error fetching sales from OpenCRX', error);
        throw new Error('Error fetching sales from OpenCRX');
    }
}

exports.getProductsFromSale = async function (oid){
    try {
        const { data } = await axios.get(`${envOpenCRX.salesURL}/salesOrder/${oid}/position`, { headers: envOpenCRX.headers });
        const positions = data.objects;

        return await Promise.all(positions.map(async position => Product.fromJSON_position(position)));

    } catch (error) {
        console.error('Error fetching products from OpenCRX', error);
        throw new Error('Error fetching products from OpenCRX');
    }
}

exports.getProduct = async function (pid){
    try {
        return await Product.fromJSON_product(`${envOpenCRX.productURL}/product/${pid}`);
    } catch (error) {
        throw new Error('Error fetching product from OpenCRX');
    }
}
