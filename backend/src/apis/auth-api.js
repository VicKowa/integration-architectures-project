const userService = require('../services/user-service')
const authService = require('../services/auth-service');
const UserDTO = require("../dtos/UserDTO");

/**
 * endpoint, which handles login
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.login = function (req, res){
    const db = req.app.get('db');//get database from express

    userService.verify(db, req.body).then(user=> { //verify credentials via user-service
        authService.authenticate(req.session, user); //mark session as authenticated
        res.send('login successful');
    }).catch(_=>{
        res.status(401).send('login failed');
    })
}

/**
 * endpoint, which handles logout
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.logout = function (req, res){
    authService.deAuthenticate(req.session); //destroy session
    res.send('logout successful');
}

/**
 * endpoint, which returns whether a user is authenticated
 * @param req express request
 * @param res express response
 * @return {Promise<void>}
 */
exports.isLoggedIn = function (req, res){
    if(authService.isAuthenticated(req.session)){ //check via auth-service
        res.send({loggedIn: true});
    }else {
        res.send({loggedIn: false});
    }
}

exports.register = function (req, res){
    const db = req.app.get('db'); //get database from express
    const user = req.body;

    userService.add(db, UserDTO.fromJSON(user)).then(_=>{ //add user via user-service
        res.send('registration successful');
    }).catch(_=>{
        res.status(400).send('registration failed');
    })
}

exports.isValidUsername = function (req, res){
    const db = req.app.get('db');//get database from express
    const username = req.query.username;

    userService.isUsernameAvailable(db, username).then(user=>{ //check if user exists
        // return false if a user with that username already exists
        if (user) {
            res.send({valid: false});
            return;
        }

        // check if the username is a sid from a salesman stored in OrangeHRM
        userService.isSalesman(db, username).then(exists => {
            res.send({valid: exists});
        }).catch(err => {
            res.send({valid: false});
        });
    })
}