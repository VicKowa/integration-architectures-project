const express = require('express');
const router = express.Router();
const ROLES = require('../config/roles');
const {checkAuthorization, requireRole} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization(ROLES.SALESMAN), authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter
router.post('/register', authApi.register);
router.get('/checkUsername', authApi.isValidUsername);

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(ROLES.SALESMAN), userApi.getSelf);

const roleApi = require('../apis/role-api');
router.get('/roles', checkAuthorization(ROLES.SALESMAN), roleApi.getRoles);

const salesmanApi = require('../apis/salesman-api'); //api for salesman
//  --- Salesman API Routes ---

// GET Requests
router.get('/salesman', checkAuthorization(ROLES.SALESMAN),salesmanApi.getAllSalesman);
router.get('/salesman/:id', checkAuthorization(ROLES.SALESMAN),salesmanApi.getSalesman);
// Post Requests
router.post('/salesman', checkAuthorization(ROLES.SALESMAN), salesmanApi.createSalesman);
// Delete Requests
router.delete('/salesman/:id', checkAuthorization(ROLES.SALESMAN), salesmanApi.deleteSalesman);
// Put Requests
router.put('/salesman', checkAuthorization(ROLES.SALESMAN), salesmanApi.updateSalesman);

//  --- Product API Routes ---

const productApi = require('../apis/product-api'); //api for product
// GET Requests
router.get('/products/sales', checkAuthorization(ROLES.SALESMAN), productApi.getAllSales);
router.get('/products/salesmen', checkAuthorization(ROLES.SALESMAN), productApi.getAllSalesmen);


//  --- OHRM API Routes ---

const ohrmApi = require('../apis/ohrm-api'); //api for ohrm

router.get('/salesmanohrm', checkAuthorization(ROLES.SALESMAN), ohrmApi.getAllSalesmanOHRM);
router.get('/salesmanohrm/:id', checkAuthorization(ROLES.SALESMAN), ohrmApi.getSalesmanOHRM);
router.put('/salesmanohrm/:id/salary/:year', checkAuthorization(ROLES.SALESMAN), ohrmApi.createBonusSalary);


//  --- ODOO API Routes ---

const odooApi = require('../apis/odoo-api'); //api for odoo

router.get('/odoo/salesman', checkAuthorization(ROLES.SALESMAN), odooApi.getAllSalesman);
router.get('/odoo/salesman/:id', checkAuthorization(ROLES.SALESMAN),  odooApi.getSalesman);
router.get('/odoo/bonus/:id', checkAuthorization(ROLES.SALESMAN),  odooApi.getBonus);


//  --- Evaluation API Routes ---

const evaluationApi = require('../apis/evaluation-api'); //api for evaluation

// GET Requests
router.get('/eval/', checkAuthorization(ROLES.SALESMAN),  evaluationApi.getAllEvaluations);
router.get('/eval/:id/:year', checkAuthorization(ROLES.SALESMAN),  evaluationApi.getEvaluation);
router.get('/eval/oe/:id/:year', checkAuthorization(ROLES.SALESMAN),  evaluationApi.getOrderEvaluation);
router.get('/eval/spr/:id/:year', checkAuthorization(ROLES.SALESMAN),  evaluationApi.getSocialPerformanceRecord);

// Post Requests
// router.post('/eval', evaluationApi.createEvaluation);
router.post('/eval/:id/:year', checkAuthorization(ROLES.SALESMAN), evaluationApi.createEvaluation);

// Put Requests
router.put('/eval', checkAuthorization(ROLES.SALESMAN),  evaluationApi.updateEvaluation);
router.put('/eval/oe/:id/:year', checkAuthorization(ROLES.SALESMAN),  evaluationApi.updateOrderEvaluation);
router.put('/eval/spr/:id/:year', checkAuthorization(ROLES.SALESMAN),  evaluationApi.updateSocialPerformanceRecord);

// Delete Requests
router.delete('/eval/:id/:year', checkAuthorization(ROLES.SALESMAN),  evaluationApi.deleteEvaluation);


//--- Bonus API Routes ---

const bonusApi = require('../apis/bonus-api'); //api for bonus

// GET Requests
router.get('/bonus/spr/:id/:year', checkAuthorization(ROLES.SALESMAN),  bonusApi.getSPRBonus);
router.get('/bonus/oe/:id/:year', checkAuthorization(ROLES.SALESMAN),  bonusApi.getOEBonus);
router.get('/bonus/:id/:year', checkAuthorization(ROLES.SALESMAN),  bonusApi.getTotalBonus);

router.post('/bonus/spr', bonusApi.recalculateSPRBonus);

module.exports = router;