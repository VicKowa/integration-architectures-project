const axios = require('axios');
const OrangeHRMSalesmanDTO = require('../dtos/OrangeHRM/OrangeHRMSalesmanDTO');
const SalesmanService = require('./salesman-service');
const Salesman = require("../models/Salesman");

const auth_url = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/oauth/issueToken';
let access_token = null;
let token_expires = null;

/**
 * Get the access token from the HRM system (with specified tenant name)
 * Save the access token and its expiration time.
 * */
async function getToken() {
    if (!access_token)
        access_token = await getBearerToken('elmer');

    if (access_token && !isTokenValid())
        access_token = await refreshToken();
}

/**
 * Check if the token is still valid
 *
 * @returns {boolean}
 * */
function isTokenValid() {
    return token_expires && token_expires > Date.now();
}

/**
 * Get the access token from the HRM system
 *
 * @param username - default is 'elmer'
 * @param password - default is '*Safb02da42Demo$'
 *
 * @returns {Promise<string>}
 * */
async function getBearerToken(username, password = '*Safb02da42Demo$'){
    return requestToken({
        client_id: 'api_oauth_id',
        client_secret: 'oauth_secret',
        grant_type: 'password',
        username: username,
        password: password
    });
}

/**
 * Refresh the access token from the HRM system
 *
 * @returns {Promise<string>}
 * */
async function refreshToken() {
    return requestToken({
        client_id: 'api_oauth_id',
        client_secret: 'oauth_secret',
        grant_type: 'refresh_token',
        refresh_token: access_token
    });
}

/**
 * Request the access token from the HRM system
 *
 * @param data - JSON data with the required fields
 * @returns {Promise<string>} - access token
 * */
async function requestToken(data) {
    const response = await axios.post(auth_url, data);

    // set token expiration time
    token_expires = Date.now() + response.data.expires_in * 1000;

    // return access token
    return response.data.access_token;
}

/**
 * Get all salesmen from the HRM system
 *
 * @returns {Promise<OrangeHRMSalesmanDTO[]>}
 * */
exports.getSalesmen = async function () {
    // get access token
    await getToken();


    // get all salesmen with access token
    const response = await axios.get('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    let salesmen = response.data.data.map(salesman => {
        return OrangeHRMSalesmanDTO.fromJSON(salesman);
    });

    salesmen = salesmen.filter(salesman => salesman.jobTitle === 'Senior Salesman');

    return salesmen;
}

/**
 * Get a specific salesman by its code (not working!)
 * needs to be fixed: we give code (sid), but the employee is searched by id. possibly extension of Salesman class needed
 *
 * @param code
 * @returns {Promise<OrangeHRMSalesmanDTO>}
 */
exports.getSalesmanByCode = async function (code) {
    // check if code is given
    if (!code)
        throw new Error('Code is required!');

    // get access token
    await getToken();

    // get all salesmen
    const salesmen = await this.getSalesmen();

    return salesmen.find(salesman => salesman.code === code);
}

/**
 * Get a specific salesman by its code (not working!)
 * needs to be fixed: we give code (sid), but the employee is searched by id. possibly extension of Salesman class needed
 *
 * @param employeeId
 * @returns {Promise<OrangeHRMSalesmanDTO>}
 */
exports.getSalesmanById = async function (employeeId) {
    // check if code is given
    if (!employeeId)
        throw new Error('Employee ID is required!');

    // get access token
    await getToken();

    const response = await axios.get(
        `https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/${employeeId}`,
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

    return OrangeHRMSalesmanDTO.fromJSON(response.data.data);
}

/**
 * Get the social performance records for a specific salesman
 *
 * @param sid
 * @param bonus : OrangeHRMBonusSalaryDTO
 * @returns {Promise<any>}
 */
exports.createBonusSalary = async function (sid, bonus) {
    // check if sid and bonus are given
    if (!sid || !bonus)
        throw new Error('SID and Bonus are required!');

    // get access token
    await getToken();

    const salesmanDTO = await this.getSalesmanByCode(sid);

    // create bonus salary
    const response = await axios.post(
        `https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/${sid}/bonussalary`,
        {
            id: parseInt(salesmanDTO.employeeId),
            year: parseInt(bonus.year),
            value: parseInt(bonus.value)
        },
        {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

    return response.data;
}

exports.fetchAndStoreSalesmen = async function (db) {
    // get salesmen from HRM system
    const salesmen = await exports.getSalesmen();
    for (const salesman of salesmen) {
        // check if salesman already exists
        const existingSalesman = await SalesmanService.getSalesman(db, salesman.code);

        if (!existingSalesman) {
            // store salesman in database
            await SalesmanService.createSalesman(db, new Salesman(
                salesman.firstName, salesman.lastName, salesman.code, salesman.jobTitle
            ));
        }
    }

}