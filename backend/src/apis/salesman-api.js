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

exports.getSocialPerformanceRecord = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.sid;
    let year = req.params.year;

    try {
        sid = parseInt(sid);
        year = parseInt(year);
    } catch (e) {
        res.status(400).send('Invalid Salesman ID or Year!');
        return;
    }

    salesmanService.getSocialPerformanceRecord(db, sid, year).then(record => {
        res.status(200).send(record);
    }).catch(_ => {
        res.status(500).send(`No Social Performance Record for ${sid} found!`);
    });
}


exports.createSalesman = function (req, res) {
    const db = req.app.get('db');
    const salesman = req.body;

    salesmanService.createSalesman(db, salesman).then(_ => {
        res.status(200).send('Salesman created!');
    }).catch(_ => {
        res.status(500).send('Salesman could not be created!');
    });
}

exports.createSocialPerformanceRecord = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.sid;
    const record = req.body;

    try {
        sid = parseInt(sid);
    } catch (e) {
        res.status(400).send('Invalid Salesman ID!');
        return;
    }

    salesmanService.createSocialPerformanceRecord(db, sid, record).then(_ => {
        res.status(200).send('Social Performance Record created!');
    }).catch(_ => {
        res.status(500).send('Social Performance Record could not be created!');
    });
}

exports.deleteSalesman = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.sid;

    try {
        sid = parseInt(sid);
    } catch (e) {
        res.status(400).send('Invalid Salesman ID!');
        return;
    }

    salesmanService.deleteSalesman(db, sid).then(_ => {
        res.status(200).send('Salesman deleted!');
    }).catch(_ => {
        res.status(500).send('Salesman could not be deleted!');
    });
}

exports.deleteSocialPerformanceRecord = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.sid;
    let year = req.params.year;

    try {
        sid = parseInt(sid);
        year = parseInt(year);
    } catch (e) {
        res.status(400).send('Invalid Salesman ID or Year!');
        return;
    }

    salesmanService.deleteSocialPerformanceRecord(db, sid, year).then(_ => {
        res.status(200).send('Social Performance Record deleted!');
    }).catch(_ => {
        res.status(500).send('Social Performance Record could not be deleted!');
    });
}

exports.updateSalesman = function (req, res) {
    const db = req.app.get('db');
    const salesman = req.body;

    salesmanService.updateSalesman(db, salesman).then(_ => {
        res.status(200).send('Salesman updated!');
    }).catch(_ => {
        res.status(500).send('Salesman could not be updated!');
    });
}

exports.updateSocialPerformanceRecord = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.sid;
    const record = req.body;

    try {
        sid = parseInt(sid);
    } catch (e) {
        res.status(400).send('Invalid Salesman ID!');
        return;
    }

    salesmanService.updateSocialPerformanceRecord(db, sid, record).then(_ => {
        res.status(200).send('Social Performance Record updated!');
    }).catch(_ => {
        res.status(500).send('Social Performance Record could not be updated!');
    });
}