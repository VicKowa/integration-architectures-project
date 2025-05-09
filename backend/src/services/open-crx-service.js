const axios = require('axios');
const Environment = require('../../environments/environment');
const envOpenCRX = Environment.default.openCRX;
const OpenCRXSalesmanDTO = require('../dtos/OpenCRX/OpenCRXSalesmanDTO');
const OpenCRXCustomerDTO = require('../dtos/OpenCRX/OpenCRXCustomerDTO');
const OpenCRXOrderDTO = require('../dtos/OpenCRX/OpenCRXOrderDTO');
const OpenCRXSaleDTO = require('../dtos/OpenCRX/OpenCRXSaleDTO');
const OpenCRXProductDTO= require('../dtos/OpenCRX/OpenCRXProductDTO');


/**
 * Fetches all sales from OpenCRX
 * @returns {Promise<List<OpenCRXSaleDTO>>} List of sales
 */
exports.getAllSales = async function (){
    // fetch all SalesOrders from OpenCRX
    const {data} = await axios.get(`${envOpenCRX.salesURL}/salesOrder`, {headers: envOpenCRX.headers}).catch(
        _ => {
            throw new Error('Error fetching salesOrders from OpenCRX');
        }
    );

    const salesOrders = data.objects;
    if (!salesOrders) throw new Error('No sales found in OpenCRX');

    // create a list of OpenCRXSaleDTOs of the sales
    let listOfSales = [];
    try {
        listOfSales = salesOrders.map(order => OpenCRXSaleDTO.fromJSON(order));
    } catch (error) {
        console.log(error);
    }

    // fetch the customer and orders for each sale
    return Promise.all(listOfSales.map(async sale => {
        sale.customer = await this.getCustomer(sale);
        sale.orders = await this.getOrders(sale);
        return sale;
    }))
}

/**
 * Fetches all sales from OpenCRX for a given governmentId and year
 * @param sid SalesRep ID
 * @param year Year
 * @returns {any} List of sales
 */
exports.getSales = async function (sid, year) {
    // fetch a OpenCRXSalesmanDTO with the given governmentId if sid is given
    let salesmanCRX = null;

    try {
        salesmanCRX = await this.getSalesman(sid);
    } catch (error) {
        throw new Error('Error fetching salesman from OpenCRX');
    }

    // fetch all SalesOrders from OpenCRX
    const {data} = await axios.get(`${envOpenCRX.salesURL}/salesOrder`, {headers: envOpenCRX.headers}).catch(
        _ => {
            throw new Error('Error fetching salesOrders from OpenCRX');
        }
    );

    const salesOrders = data.objects;

    if (!salesOrders) throw new Error('No sales found in OpenCRX');

    // create a list of OpenCRXSaleDTOs of the sales for the given sid
    let listOfSales = (await Promise.all(
        salesOrders
            .map(async order => {
                if(!order)
                    return null;

                // filter out sales that are not from the given salesman
                if (order['salesRep']['@href'] === salesmanCRX.href) {
                    return OpenCRXSaleDTO.fromJSON(order);
                }
                return null;
            })
    )).filter(order => order !== null);

    if (!listOfSales) throw new Error('No sales found in OpenCRX');

    // filter out sales that are not from the given year
    if (year) {
        listOfSales = listOfSales.filter(sale => sale.activeOn.includes(year));
    }

    return Promise.all(listOfSales.map(async sale => {
        if (!sale)
            return null;

        sale.customer = await this.getCustomer(sale);
        sale.orders = await this.getOrders(sale);
        return sale;
    })).catch(
        _ => {
            throw new Error('Error fetching customer or orders from OpenCRX');
        }
    );
}
/**
 * Fetches a product from OpenCRX with the given href from an OpenCRXOrderDTO
 * @param order OpenCRXOrderDTO
 * @returns {Promise<OpenCRXProductDTO>}
 */
exports.getProduct = async function (order){
    try {
        const { data } = await axios.get(order.product_href, { headers: envOpenCRX.headers });
        return OpenCRXProductDTO.fromJSON(data);
    } catch (error) {
        throw new Error('Error fetching product from OpenCRX');
    }
}

/**
 * Fetches a salesman from OpenCRX with the given governmentId
 * @param sid governmentId
 * @returns OpenCRXSalesmanDTO
 */
exports.getSalesman = async function (sid){
    // Query for salesman with governmentId
    let query = {
        queryType: "org:opencrx:kernel:account1:Contact",
        query: `thereExistsGovernmentId().equalTo("${sid}")`
    };

    // Fetch salesman from OpenCRX
    const { data } = await axios.get(`${envOpenCRX.accountURL}/account`, { headers: envOpenCRX.headers, params: query}).catch(
        _ => {
            throw new Error('Error fetching salesman from OpenCRX');
        }
    );

    if (!Object.hasOwn(data, 'objects')) throw new Error(`No salesman found with governmentId ${sid}`);
    else if (data.objects.length === 0) throw new Error(`No salesman found with governmentId ${sid}`);

    return OpenCRXSalesmanDTO.fromJSON(data['objects'][0]);
}

/**
 * Fetches all salesmen from OpenCRX with job title "Senior Salesman"
 * @returns {Promise<List<OpenCRXSalesmanDTO>>} List of OpenCRXSalesmanDTOs
 */
exports.getAllSalesmen = async function () {
    // Query for contacts only with the job title "Senior Salesman"
    let query = {
        queryType: "org:opencrx:kernel:account1:Contact",
        query: `thereExistsJobTitle().equalTo("Senior Salesman")`
    };

    // Fetch all salesmen from OpenCRX
    const { data } = await axios.get(`${envOpenCRX.accountURL}/account`, { headers: envOpenCRX.headers, params: query}).catch(
        _ => {
            throw new Error('Error fetching salesmen from OpenCRX');
        }
    );

    if (!Object.hasOwn(data, 'objects')) throw new Error('No salesmen found in OpenCRX');
    else if (data.objects.length === 0) throw new Error('No salesmen found in OpenCRX');

    return data.objects.map(salesman => OpenCRXSalesmanDTO.fromJSON(salesman));
}

/**
 * Fetches a customer from OpenCRX with the given href from an OpenCRXSaleDTO
 * @param sale OpenCRXSaleDTO
 * @returns {Promise<OpenCRXCustomerDTO>} Customer
 */
exports.getCustomer = async function(sale) {
    const {data} = await axios.get(sale.customer_href, {headers: envOpenCRX.headers}).catch(
        _ => {
            throw new Error('Error fetching costumer from OpenCRX');
        }
    );
    if (!data) return null;

    return OpenCRXCustomerDTO.fromJSON(data);
}

/**
 * Fetches all orders from OpenCRX for a given OpenCRXSale
 * @param sale OpenCRXSaleDTO
 * @returns {Promise<List<OpenCRXOrderDTO>>} List of orders
 */
exports.getOrders = async function(sale) {
    const {data} = await axios.get(`${sale.href}/position`, {headers: envOpenCRX.headers}).catch(
        _ => {
            throw new Error('Error fetching orders from OpenCRX');
        }
    );

    // return null if no orders are found
    if(!data.objects) return null;

    let orders = data.objects;

    return Promise.all(orders.map( async order => {
        const orderDTO = OpenCRXOrderDTO.fromJSON(order);
        orderDTO.crx_product = await this.getProduct(orderDTO);

        return orderDTO;
    }));
}