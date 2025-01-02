export = User;
/**
 * this model specifies the format to exchange userdata with the frontend and store it in mongoDB
 * @param {string} username
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} email
 * @param {string} password
 * @param {boolean} isAdmin
 */
declare class User {
    constructor(username: any, firstname: any, lastname: any, email: any, password: any, isAdmin: any);
    _id: any;
    username: any;
    firstname: any;
    lastname: any;
    email: any;
    password: any;
    isAdmin: any;
}
