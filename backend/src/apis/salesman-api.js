const salesmanService = require('../services/salesman-service.js');
const Salesman = require('../models/Salesman.js');

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