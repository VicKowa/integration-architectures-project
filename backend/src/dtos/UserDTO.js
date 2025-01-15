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
class UserDTO{
    constructor(username, firstname, lastname, email, password, role = ROLES.SALESMAN) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
    }
    static fromJSON(json){
        return new UserDTO(json.username, json.firstname, json.lastname, json.email, json.password, json.role);
    }
}

module.exports = UserDTO;