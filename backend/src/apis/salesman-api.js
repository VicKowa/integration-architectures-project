const express = require('express');
const salesmanService = require('../services/salesman-service');


exports.getAllSalesman = function (req, res){
    const db = req.app.get('db');

    salesmanService.getAllSalesman(db).then(salesman => {
        res.status(200).send(salesman);
    }).catch(_ => {
        res.status(500).send('No Salesman found!');
    });
}

exports.getSalesman = function (req, res){
    const db = req.app.get('db');
    let sid = req.params.sid;

    try {
        sid = parseInt(sid);
    } catch (e) {
        res.status(400).send('Invalid Salesman ID!');
        return;
    }

    salesmanService.getSalesman(db, sid).then(salesman => {
        res.status(200).send(salesman);
    }).catch(_ => {
        res.status(500).send(`No Salesman with ${sid} found!`);
    });
}

exports.getSocialPerformanceRecord = function (req, res){}


exports.createSalesman = function (req, res){
}

// addSocialPerformanceRecord(int sid, SPR record)
exports.createSocialPerformanceRecord = function (req, res){
}

// DELETE Requests
// deleteSalesman(int id)
exports.deleteSalesman = function (req, res){
}

// deleteSocialPerformanceRecord(int id, SPR record)
exports.deleteSocialPerformanceRecord = function (req, res){
}

// PUT Requests
// updateSalesman(int id, String firstname, String lastname)
exports.updateSalesman = function (req, res){
}
// updateSocialPerformanceRecord(int id, SPR record)
exports.updateSocialPerformanceRecord = function (req, res){
}