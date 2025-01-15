const ROLES = require('../config/roles');

/**
 * this model specifies the format to exchange userdata with the frontend and store it in mongoDB
 *
 * @param {string} username
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} email
 * @param {string} password
 * @param {string} role
 */
class User{
    constructor(username, firstname, lastname, email, password, role = ROLES.SALESMAN) {
        this._id = undefined;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;

        // check if the given role is valid
        if (!isValidRole(role))
            throw new Error(`Invalid role: ${role}`);

        this.role = role;
    }
}

/**
 * checks if the given role is valid
 *
 * @param {string} role
 * @return {boolean} true if role is valid
 */
function isValidRole(role) {
    return Object.values(ROLES).includes(role);
}

module.exports = User;