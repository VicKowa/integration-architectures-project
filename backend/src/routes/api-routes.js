const express = require('express');
const router = express.Router();
const {checkAuthorization} = require('../middlewares/auth-middleware');

/*
    In this file is the routing for the REST-endpoints under /api managed
 */

const authApi = require('../apis/auth-api'); //api-endpoints are loaded from separate files
router.post('/login', authApi.login); //the function decides which request type should be accepted
router.delete('/login', checkAuthorization(),authApi.logout); //middlewares can be defined in parameters
router.get('/login', authApi.isLoggedIn); //the function, which handles requests is specified as the last parameter

const userApi = require('../apis/user-api');
router.get('/user', checkAuthorization(), userApi.getSelf);

const peopleDemoApi = require('../apis/people-demo-api');
router.get('/people', checkAuthorization(), peopleDemoApi.getPeople);

const salesmanApi = require('../apis/salesman-api'); //api for salesman
const ohrmApi = require('../apis/ohrm-api'); //api for ohrm
// GET Requests
router.get('/salesman', salesmanApi.getAllSalesman);
router.get('/salesman/:id', salesmanApi.getSalesman);
router.get('/salesman/:id/spr/:year', salesmanApi.getSocialPerformanceRecord);
// Post Requests
router.post('/salesman', salesmanApi.createSalesman);
router.post('/salesman/:id/spr', salesmanApi.createSocialPerformanceRecord);
// Delete Requests
router.delete('/salesman/:id', salesmanApi.deleteSalesman);
router.delete('/salesman/:id/spr/:year', salesmanApi.deleteSocialPerformanceRecord);
// Put Requests
router.put('/salesman', salesmanApi.updateSalesman);
router.put('/salesman/:id/spr', salesmanApi.updateSocialPerformanceRecord);

router.get('/salesmanohrm', ohrmApi.getAllSalesmanOHRM);
router.get('/salesmanohrm/:id', ohrmApi.getSalesmanOHRM);
router.put('/salesmanohrm', ohrmApi.updateSalesmanOHRM);

module.exports = router;