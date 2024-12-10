const axios = require('axios');
const Salesman = require("../models/salesman/Salesman");

const ALLOWED_KEYS = ['id', 'firstName', 'middleName', 'lastName', 'code', 'dob', 'licenseNumber',
    'licenseNumberExpDate', 'maritalStatus', 'gender', 'otherId', 'nationality'];

const BANNED_KEYS = ['code'];

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
 * Convert JSON to Salesman object only regarding specific keys
 *
 * @param json - JSON data to be converted
 * @returns {Salesman}
 * */
function convertToSalesman(json) {
    const {firstName, lastName, code} = json;
    return new Salesman(firstName, lastName, code);
}

/**
 * Get all salesmen from the HRM system
 *
 * @param mapped - if true, return Salesman objects, otherwise return JSON objects
 * @returns {Promise<Salesman[]> | Promise<*>}
 * */
exports.getSalesmen = async function (mapped = true) {
    // get access token
    await getToken();

    // get all salesmen with access token
    const response = await axios.get('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

    // return mapped or not mapped data
    if (mapped)
        return response.data.data.map(salesman => {
            return convertToSalesman(salesman);
        });
    else
        return response.data.data;
}

/**
 * Get a specific salesman by its code (not working!)
 * needs to be fixed: we give code (sid), but the employee is searched by id. possibly extension of Salesman class needed
 *
 * @param code
 * @param mapped
 * @returns {Promise<Salesman>}
 */
exports.getSalesman = async function (code, mapped = true) {
    // get access token
    await getToken();

    // check if code is given
    if (!code)
        throw new Error('Code is required!');

    // get all salesmen
    const salesmen = await this.getSalesmen(mapped);

    // return the salesman with the given code
    if (mapped)
        return salesmen.find(salesman => salesman.sid === code);
    else
        return salesmen.find(salesman => salesman.code === code);
}

/**
 * Update a specific salesman by its code with the given JSON data
 *
 * @param json - JSON data to be updated
 * @returns {Promise<void>}
 */
exports.updateSalesman = async function (json) {
    // get access token
    await getToken();

    // check if json is given
    if (!json)
        throw new Error('To be changed data is required');

    // save the code because it is removed from the json
    const code = json.code;

    // check if json has only allowed keys and remove banned keys
    Object.keys(json).forEach(key => {
        if (!ALLOWED_KEYS.includes(key) || BANNED_KEYS.includes(key))
            delete json[key];
    });

    // add not mentioned allowed keys
    ALLOWED_KEYS.forEach(key => {
        if (!json[key])
            json[key] = '';
    });

    // get the original salesman
    const original = await this.getSalesman(code, false);

    // check if salesman is found
    if (!original)
        throw new Error('Salesman not found!');

    // update the json with original data if not given
    Object.keys(original).forEach(key => {
        if (json[key] === '')
            json[key] = original[key];
    });

    // special case for id (it has a different name -> mapping is required)
    json['id'] = original.employeeId; // special case

    // update salesman
    const response =
        await axios.put(`https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/${json.id}`,
            json, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

    // return response
    return response.data;
}