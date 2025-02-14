const salesmanService = require('../services/salesman-service.js');
const Salesman = require('../models/Salesman.js');

/**
 * gets all salesmen from the database
 * @param req
 * @param res
 */
exports.getAllSalesman = function (req, res){
    const db = req.app.get('db');

    return salesmanService.getAllSalesman(db).then(salesman => {
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

    return salesmanService.getSalesman(db, sid).then(salesman => {
        // remove _id from salesman
        const {_id, ...salesmanData} = salesman;

        res.status(200).send(salesmanData);
    }).catch(_ => {
        res.status(404).send(`No Salesman with ${sid} found!`);
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

    return salesmanService.getSalesman(db, salesman.sid).then(exSalesman => {
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
 * deletes a salesman from the database
 * @param req
 * @param res
 */
exports.deleteSalesman = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;

    return salesmanService.deleteSalesman(db, sid).then(_ => {
        res.status(200).send('Salesman deleted!');
    }).catch(_ => {
        res.status(500).send('Salesman could not be deleted!');
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

    return salesmanService.updateSalesman(db, salesman).then(_ => {
        res.status(200).send('Salesman updated!');
    }).catch(_ => {
        res.status(500).send('Salesman could not be updated!');
    });
}