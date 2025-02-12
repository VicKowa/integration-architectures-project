const ROLES = require('../config/roles');

// Define the numeric hierarchy for roles.
// Adjust the numbers if your hierarchy changes.
const roleHierarchy = {
    [ROLES.SALESMAN]: 1,
    [ROLES.HR]: 2,
    [ROLES.CEO]: 3,
    [ROLES.ADMIN]: 3
};

/**
 * Middleware to check if a user is authenticated and has a role
 * that meets the minimum required level.
 *
 * @param {string} requiredRole - The minimum required role.
 * @return {function(req, res, next): void} Express middleware.
 *
 * @example
 * // This route requires at least the "SALESMAN" role (i.e. any role is allowed)
 * app.get('/some-route', checkAuthorization(ROLES.SALESMAN), handler);
 *
 * // This route requires at least the "HR" role (i.e. HR, CEO, or ADMIN)
 * app.get('/hr-area', checkAuthorization(ROLES.HR), handler);
 */
exports.checkAuthorization = (requiredRole) => {
    return (req, res, next) => {
        // First, ensure that the user is authenticated
        if (req.session && req.session.authenticated) {
            const userRole = req.session.user && req.session.user.role;
            // If the user's role exists and its hierarchy level is greater than or equal to the required role's level, allow the request.
            if (userRole && roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
                return next();
            }
        }
        // If not authenticated or not authorized, send a 401 status.
        res.status(401).send();
    };
};
