const express = require('express');
const router = express.Router();
const ROLES = require('../config/roles');
const {checkAuthorization, requireRole} = require('../middlewares/auth-middleware');

// --- Auth API Routes ---
const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization(ROLES.SALESMAN), authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter
router.post('/register', authApi.register);
router.get('/checkUsername', authApi.isValidUsername);

// --- User API Routes ---
const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(ROLES.SALESMAN), userApi.getSelf);


//  --- Salesman API Routes ---
const salesmanApi = require('../apis/salesman-api');
// GET Requests
router.get('/salesman', checkAuthorization(ROLES.SALESMAN),salesmanApi.getAllSalesman);
router.get('/salesman/:id', checkAuthorization(ROLES.SALESMAN),salesmanApi.getSalesman);

//  --- Product API Routes ---
const productApi = require('../apis/product-api');
// GET Requests
router.get('/products/sales', checkAuthorization(ROLES.SALESMAN), productApi.getAllSales);

//  --- OHRM API Routes ---
//
const ohrmApi = require('../apis/ohrm-api');
//
router.get('/salesmanohrm', checkAuthorization(ROLES.SALESMAN), ohrmApi.getAllSalesmanOHRM);
router.get('/salesmanohrm/:id', checkAuthorization(ROLES.SALESMAN), ohrmApi.getSalesmanOHRM);

//  --- ODOO API Routes ---
const odooApi = require('../apis/odoo-api');
router.get('/odoo/salesman', checkAuthorization(ROLES.SALESMAN), odooApi.getAllSalesman);
router.get('/odoo/salesman/:id', checkAuthorization(ROLES.SALESMAN),  odooApi.getSalesman);
router.get('/odoo/bonus/:id', checkAuthorization(ROLES.SALESMAN),  odooApi.getBonus);

//  --- Evaluation API Routes ---
const evaluationApi = require('../apis/evaluation-api');
// GET Requests
router.get('/eval/', checkAuthorization(ROLES.SALESMAN),  evaluationApi.getAllEvaluations);
router.get('/eval/:id/:year', checkAuthorization(ROLES.SALESMAN),  evaluationApi.getEvaluation);
// Post Requests
router.post('/eval/:id/:year', checkAuthorization(ROLES.SALESMAN), evaluationApi.createEvaluation);
// Put Requests
router.put('/eval', checkAuthorization(ROLES.SALESMAN),  evaluationApi.updateEvaluation);

//--- Bonus API Routes ---
const bonusApi = require('../apis/bonus-api'); //api for bonus
// Post Requests
router.post('/bonus/spr', bonusApi.recalculateSPRBonus);

module.exports = router;