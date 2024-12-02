const axios = require('axios');
const {response} = require("express");
const Sale = require('../models/OpenCRX/Sale.js');

const SalesAPI = "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard";

exports.getAllSales = async function (){

}


exports.getSales = async function (sid){

        // fetch all SalesOrders from OpenCRX
        const { data } = await axios.get(`${SalesAPI}/salesOrder`, { headers: Sale.headers }).catch(
            _ => {
                throw new Error('Error fetching sales from OpenCRX');
            }
        );
        const salesOrders = data.objects;

        const salesOrders_filtered =(await Promise.all(
            salesOrders
                .map(async (order) => {

                    // get salesRep from OpenCRX
                    const governmentId = await Sale.getSalesRep(order);
                    return governmentId === sid ? order : null;
                })
        ).catch(
            _ => {
                throw new Error('Error fetching sales from OpenCRX');
            }
        )).filter(order => order !== null);

        // map salesOrders to Sale objects
        return await Promise.all(salesOrders_filtered.map(order => Sale.fromJSON(order)));
}

