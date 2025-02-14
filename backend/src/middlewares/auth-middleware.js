const ROLES = require('../config/roles');

// Define the numeric hierarchy for roles.
// Adjust the numbers if your hierarchy changes.
const roleHierarchy = {
    [ROLES.SALESMAN]: 1,
    [ROLES.SALESMAN_VACULON]: 1,
    [ROLES.HR]: 2,
    [ROLES.CEO]: 3,
    [ROLES.ADMIN]: 4
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
        if (req.session && req.session.authenticated) {
            const userRole = req.session.user && req.session.user.role;

            if (userRole && roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
                return next();
            } else {
                throw new Error("Authorization failed: insufficient role level.");
            }
        }
        res.status(401).send();
    };
};
