const salesmanService = require('../services/salesman-service.js');
const Salesman = require('../models/salesman/Salesman.js');
const SocialPerformanceRecord = require('../models/salesman/SocialPerformanceRecord.js');

/**
 * gets all salesmen from the database
 * @param req
 * @param res
 */
exports.getAllSalesman = function (req, res){
    const db = req.app.get('db');

    salesmanService.getAllSalesman(db).then(salesman => {
        // remove _id from salesman
        salesman = salesman.map(({_id, ...rest}) => rest);

        res.status(200).send(salesman);
    }).catch(_ => {
        res.status(404).send('No Salesman found!');
    });
}

/**
 * gets a specific salesman by its sid
 * @param req
 * @param res
 */
exports.getSalesman = function (req, res){
    const db = req.app.get('db');
    let sid = req.params.id;

    salesmanService.getSalesman(db, sid).then(salesman => {
        // remove _id from salesman
        const {_id, ...salesmanData} = salesman;

        res.status(200).send(salesmanData);
    }).catch(_ => {
        res.status(404).send(`No Salesman with ${sid} found!`);
    });
}

/**
 * gets a specific social performance record by its year
 * @param req
 * @param res
 */
exports.getSocialPerformanceRecord = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;

    salesmanService.getSocialPerformanceRecord(db, sid, year).then(record => {
        if (!record)
            throw new Error(`No Social Performance Record for ${sid} and ${year} found!`);

        res.status(200).send(record);
    }).catch(_ => {
        res.status(404).send(`No Social Performance Record for ${sid} and ${year} found!`);
    });
}

/**
 * creates a new salesman in the database
 * @param req
 * @param res
 */
exports.createSalesman = function (req, res) {
    const db = req.app.get('db');
    const salesman = Salesman.fromJSON(req.body);

    salesmanService.getSalesman(db, salesman.sid).then(exSalesman => {
        // check if salesman with sid already exists
        if(exSalesman)
            throw new Error(`Salesman with sid ${salesman.sid} already exists!`);

        salesmanService.createSalesman(db, salesman).then(_ => {
            res.status(200).send(`Salesman with sid ${salesman.sid} created!`);
        }).catch(_ => {
            res.status(500).send('Salesman could not be created!');
        });
    }).catch(_ => {
        res.status(500).send(`Salesman with sid ${salesman.sid} already exists!`);
    });
}

/**
 * creates a new social performance record for a specific salesman
 * @param req
 * @param res
 */
exports.createSocialPerformanceRecord = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;

    const record = SocialPerformanceRecord.fromJSON(req.body);

    salesmanService.getSalesman(db, sid).then(salesman => {
        salesmanService.createSocialPerformanceRecord(db, salesman, record).then(_ => {
            res.status(200).send('Social Performance Record created!');
        }).catch(_ => {
            res.status(500).send('Social Performance Record could not be created!');
        });
    }).catch(_ => {
        res.status(500).send('Salesman not found!');
    });
}

/**
 * deletes a salesman from the database
 * @param req
 * @param res
 */
exports.deleteSalesman = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;

    salesmanService.deleteSalesman(db, sid).then(_ => {
        res.status(200).send('Salesman deleted!');
    }).catch(_ => {
        res.status(500).send('Salesman could not be deleted!');
    });
}

/**
 * deletes a social performance record from a specific salesman
 * @param req
 * @param res
 */
exports.deleteSocialPerformanceRecord = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;

    salesmanService.getSalesman(db, sid).then(salesman => {
        salesmanService.deleteSocialPerformanceRecord(db, salesman.sid, year).then(_ => {
            res.status(200).send('Social Performance Record deleted!');
        }).catch(_ => {
            res.status(500).send('Social Performance Record could not be deleted!');
        });
    }).catch(_ => {
        res.status(500).send('Salesman not found!');
    });
}

/**
 * updates a salesman in the database
 * @param req
 * @param res
 */
exports.updateSalesman = function (req, res) {
    const db = req.app.get('db');

    const salesman = Salesman.fromJSON(req.body);

    salesmanService.updateSalesman(db, salesman).then(_ => {
        res.status(200).send('Salesman updated!');
    }).catch(_ => {
        res.status(500).send('Salesman could not be updated!');
    });
}

/**
 * updates a social performance record for a specific salesman
 * @param req
 * @param res
 */
exports.updateSocialPerformanceRecord = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;

    const record = SocialPerformanceRecord.fromJSON(req.body);

    salesmanService.getSalesman(db, sid).then(salesman => {
        salesmanService.updateSocialPerformanceRecord(db, salesman, record).then(_ => {
            res.status(200).send('Social Performance Record updated!');
        }).catch(_ => {
            res.status(500).send('Social Performance Record could not be updated!');
        });
    }).catch(_ => {
        res.status(404).send('Salesman not found!');
    });
}