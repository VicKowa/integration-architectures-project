const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization,authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization, userApi.getSelf);

const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people', checkAuthorization, peopleDemoApi.getPeople);

const salesmanApi = require('../apis/salesman-api'); //api for salesman

// GET Requests
router.get('/salesman', checkAuthorization,salesmanApi.getAllSalesman);
router.get('/salesman/:id', checkAuthorization, salesmanApi.getSalesman);
router.get('/salesman/:id/spr/:year', salesmanApi.getSocialPerformanceRecord);
// Post Requests
router.post('/salesman',checkAuthorization, salesmanApi.createSalesman);
router.post('/salesman/:id/spr', checkAuthorization, salesmanApi.createSocialPerformanceRecord);
// Delete Requests
router.delete('/salesman/:id', checkAuthorization,salesmanApi.deleteSalesman);
router.delete('/salesman/:id/spr/:year', checkAuthorization, salesmanApi.deleteSocialPerformanceRecord);
// Put Requests
router.put('/salesman', checkAuthorization, salesmanApi.updateSalesman);
router.put('/salesman/:id/spr', checkAuthorization, salesmanApi.updateSocialPerformanceRecord);


const productApi = require('../apis/product-api'); //api for product
// GET Requests
router.get('/products/sales', checkAuthorization, productApi.getAllSales);
router.get('/products/salesmen', checkAuthorization, productApi.getAllSalesmen);

const ohrmApi = require('../apis/ohrm-api'); //api for ohrm

router.get('/salesmanohrm', checkAuthorization, ohrmApi.getAllSalesmanOHRM);
router.get('/salesmanohrm/:id', checkAuthorization, ohrmApi.getSalesmanOHRM);
router.put('/salesmanohrm/:id/salary/:year', checkAuthorization, ohrmApi.createBonusSalary);

const odooApi = require('../apis/odoo-api'); //api for odoo
// Testing Odoo
router.get('/odoo/salesman', checkAuthorization, odooApi.getAllSalesman);
router.get('/odoo/salesman/:id', checkAuthorization, odooApi.getSalesman);
router.get('/odoo/bonus', checkAuthorization, odooApi.getBonus);
const bonusApi = require('../apis/bonus-api'); //api for bonus

// GET Requests
router.get('/bonus/spr/:sid/:year', checkAuthorization, bonusApi.getSPRBonus);
router.get('/bonus/oe/:sid/:year', checkAuthorization, bonusApi.getOEBonus);
router.get('/bonus/total/:sid/:year', checkAuthorization, bonusApi.getTotalBonus);


module.exports = router;