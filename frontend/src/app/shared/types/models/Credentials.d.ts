/**
 * this model specifies the format to exchange credentials with the frontend
 * @param {string} username
 * @param {string} password
 */
declare class Credentials {
    constructor(username: any, password: any);
    username: any;
    password: any;
}

export default Credentials;
