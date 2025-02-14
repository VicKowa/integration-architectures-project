const crypto = require('crypto');
const salt = 'integrationArchitectures';
const orangeHRMService = require('./orange-hrm-service');
const odooService = require('./odoo-service');

/**
 * inserts a new user into database & hashes its password
 * @param db target database
 * @param {UserDTO} user new user
 * @return {Promise<any>}
 */
exports.add = async function (db, user){
    user.password = hashPassword(user.password);

    return (await db.collection('users').insertOne(user)).insertedId; // return unique ID
}

/**
 * retrieves user from database by its username
 * @param db source database
 * @param {string} username
 * @return {Promise<User>}
 */
exports.get = async function (db, username){
    return db.collection('users').findOne({username: username});
}

/**
 * verifies provided credentials against a database
 * @param db source database
 * @param {Credentials} credentials credentials to verify
 * @return {Promise<User>}
 */
exports.verify = async function (db, credentials){
    let user = await this.get(db, credentials.username); //retrieve user with given email from database

    if(!user) throw new Error('User was not found!'); //no user found -> throw error
    if(!verifyPassword(credentials.password, user.password)) throw new Error('Password wrong!');

    await orangeHRMService.fetchAndStoreSalesmen(db); //fetch and store salesmen from OrangeHRM

    return user;
}

/**
 * checks if a username is available in the database
 *
 * @param db source database
 * @param {string} username
 * @return {Promise<boolean>}
 * */
exports.isUsernameAvailable = async function (db, username){
    return await this.get(db, username) !== null;
}

/**
 * checks if a user is a salesman stored in OrangeHRM
 *
 * @param db source database
 * @param {string} username
 * @return {Promise<*>}
 * */
exports.isSalesman = async function (db, username){
    let response = {
        valid: false,
        ohrm: true
    };
    let salesman = await orangeHRMService.getSalesmanByCode(username);

    if (!salesman) {
        salesman = await odooService.getSalesman(parseInt(username));

        if (salesman)
            response.ohrm = false;
    }

    response.valid = !!salesman;

    return response;
}

/**
 * hashes password with sha3 256bit
 * @param {string} password
 * @return {string} hashed password
 */
function hashPassword(password){
    let hash = crypto.createHmac('sha3-256', salt);
    hash.update(password);
    return hash.digest('base64');
}

/**
 * verifies password against hash
 * @param {string} password password to verify
 * @param {string} hash hash of expected password
 * @return {boolean} true if password matches
 */
function verifyPassword(password, hash){
    return hashPassword(password) === hash; //verify by comparing hashes
}