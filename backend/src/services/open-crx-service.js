const axios = require('axios');
const {response} = require("express");

const SalesAPI = "https://sepp-crm.inf.h-brs.de/opencrx-rest-CRX/org.opencrx.kernel.contract1/provider/CRX/segment/Standard";

const username = "guest";
const password = "guest";

const headers = {
    'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
    'Accept': 'application/json',
}

exports.getAllSales = async function (){

}

exports.getSales = async function (sid){
    try {
        // fetch all SalesOrders from OpenCRX
        const { data } = await axios.get(`${SalesAPI}/salesOrder`, { headers});
        const salesOrders = data.objects;

        return (await Promise.all(
            salesOrders
                .map(async (order) => {
                    // check if order has href to order
                    const salesRep = order['salesRep']['@href'];
                    if (!salesRep) return null;

                    const response = await axios.get(salesRep, {headers});

                    const governmentId = response.data['governmentId'];
                    if (!governmentId) return null;

                    return governmentId.toString() === sid ? order : null;
                })
        )).filter(order => order !== null);

    } catch (error) {
        console.error('Error fetching sales from OpenCRX', error);
        throw new Error('Error fetching sales from OpenCRX');
    }
}

