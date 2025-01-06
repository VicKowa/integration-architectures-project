const express = require('express');
const router = express.Router();
const ROLES = require('../config/roles');
const {checkAuthorization} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization,authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(ROLES.SALESMAN), userApi.getSelf);

const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people', checkAuthorization, peopleDemoApi.getPeople);

const roleApi = require('../apis/role-api');
router.get('/roles', roleApi.getRoles);

const salesmanApi = require('../apis/salesman-api'); //api for salesman

// GET Requests
router.get('/salesman',salesmanApi.getAllSalesman);
router.get('/salesman/:id', salesmanApi.getSalesman);
router.get('/salesman/:id/spr/:year', salesmanApi.getSocialPerformanceRecord);
// Post Requests
router.post('/salesman', salesmanApi.createSalesman);
router.post('/salesman/:id/spr', salesmanApi.createSocialPerformanceRecord);
// Delete Requests
router.delete('/salesman/:id',salesmanApi.deleteSalesman);
router.delete('/salesman/:id/spr/:year', salesmanApi.deleteSocialPerformanceRecord);
// Put Requests
router.put('/salesman', salesmanApi.updateSalesman);
router.put('/salesman/:id/spr', salesmanApi.updateSocialPerformanceRecord);


const productApi = require('../apis/product-api'); //api for product
// GET Requests
router.get('/products/sales',productApi.getAllSales);
router.get('/products/salesmen', productApi.getAllSalesmen);

const ohrmApi = require('../apis/ohrm-api'); //api for ohrm

router.get('/salesmanohrm', ohrmApi.getAllSalesmanOHRM);
router.get('/salesmanohrm/:id', ohrmApi.getSalesmanOHRM);
router.put('/salesmanohrm/:id/salary/:year', checkAuthorization, ohrmApi.createBonusSalary);

const odooApi = require('../apis/odoo-api'); //api for odoo
// Testing Odoo
router.get('/odoo/salesman', odooApi.getAllSalesman);
router.get('/odoo/salesman/:id', odooApi.getSalesman);
router.get('/odoo/bonus', odooApi.getBonus);


//  --- Evaluation API Routes ---

const evaluationApi = require('../apis/evaluation-api'); //api for bonus

// GET Requests
router.get('/eval/:id/:year', evaluationApi.getEvaluation);

// Post Requests
router.post('/eval', evaluationApi.createEvaluation);

// Put Requests
router.put('/eval/', evaluationApi.updateEvaluation);

// Delete Requests
router.delete('/eval/:id/:year', evaluationApi.deleteEvaluation);


// --- Bonus API Routes ---

const bonusApi = require('../apis/bonus-api'); //api for bonus

// GET Requests
router.get('/bonus/spr/:id/:year', bonusApi.getSPRBonus);
router.get('/bonus/oe/:id/:year', bonusApi.getOEBonus);
router.get('/bonus/:id/:year', bonusApi.getTotalBonus);

module.exports = router;