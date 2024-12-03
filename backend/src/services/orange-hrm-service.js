const axios = require('axios');
const Salesman = require("../models/salesman/Salesman");

const ALLOWED_KEYS = ['id', 'firstName', 'middleName', 'lastName', 'code', 'dob', 'licenseNumber',
    'licenseNumberExpDate', 'maritalStatus', 'gender', 'otherId', 'nationality'];

const BANNED_KEYS = ['code'];

const auth_url = 'https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/oauth/issueToken';
let access_token = null;
let token_expires = null;

async function getToken() {
    if (!access_token)
        access_token = await getBearerToken('elmer');

    if (access_token && !isTokenValid())
        access_token = await refreshToken();
}

function isTokenValid() {
    return token_expires && token_expires > Date.now();
}

async function getBearerToken(username, password = '*Safb02da42Demo$'){
    return requestToken({
        client_id: 'api_oauth_id',
        client_secret: 'oauth_secret',
        grant_type: 'password',
        username: username,
        password: password
    });
}

async function refreshToken() {
    return requestToken({
        client_id: 'api_oauth_id',
        client_secret: 'oauth_secret',
        grant_type: 'refresh_token',
        refresh_token: access_token
    });
}

async function requestToken(data) {
    const response = await axios.post(auth_url, data);

    // set token expiration time
    token_expires = Date.now() + response.data.expires_in * 1000;

    // return access token
    return response.data.access_token;
}

function convertToSalesman(json) {
    const {firstName, lastName, code} = json;
    return new Salesman(firstName, lastName, code);
}

/**
 * Get all salesmen from the HRM system (working!)
 * */
exports.getSalesmen = async function (mapped = true) {
    await getToken();

    const response = await axios.get('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search', {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });

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
    await getToken();

    console.log(code);

    if (!code)
        throw new Error('Code is required!');

    /*
    const response = await axios.get(`https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/${code}`, {
        headers: {
            Authorization: `Bearer ${access_token}`
        }
    });
     */

    // possible fix, but not nice
    const salesmen = await this.getSalesmen(mapped);

    if (mapped)
        return salesmen.find(salesman => salesman.sid === code);
    else
        return salesmen.find(salesman => salesman.code === code);
}

/**
 * Create a new salesman in the HRM system (not tested because getSalesman is not entirely working)
 * @param json
 * @returns {Promise<any>}
 */
exports.updateSalesman = async function (json) {
    await getToken();

    if (!json)
        throw new Error('To be changed data is required');

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

    // fill empty values with corresponding values from the original salesman
    const original = await this.getSalesman(code, false);

    Object.keys(original).forEach(key => {
        if (json[key] === '')
            json[key] = original[key];
    });

    json['id'] = original.employeeId; // special case

    // update salesman
    const response =
        await axios.put(`https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/${json.id}`,
            json, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

    return response.data;
}