const ROLES = require('../config/roles');

/**
 * this express middleware checks if a user is authenticated and if he has the required role;
 * otherwise the request gets intercepted and status 401 is returned
 *
 * @param {string} requiredRole if true, user needs to be admin
 * @return {(function(*, *, *): void)|*}
 */
exports.checkAuthorization = (requiredRole) => {
    return (req, res, next) => {
        if (req.session.authenticated) { // check if session was marked as authenticated
            if(requiredRole === ROLES.SALESMAN || req.session.user.role === requiredRole) { // check if user has the required role
                next(); // proceed with next middleware or handler
                return;
            }
        }
        res.status(401).send(); // intercept request
    }
}