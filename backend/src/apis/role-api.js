const ROLES = require('../config/roles');

exports.getRoles = async function(req, res){
    res.send(ROLES); // return roles
}