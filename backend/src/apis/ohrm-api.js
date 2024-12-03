const ohrmService = require('../services/orange-hrm-service');

exports.getAllSalesmanOHRM = function (req, res) {
    ohrmService.getSalesmen().then(salesman => {
        res.status(200).send(salesman);
    }).catch(_ => {
        res.status(500).send('Salesman not found!');
    });
}

exports.getSalesmanOHRM = function (req, res) {
    let sid = req.params.id;

    ohrmService.getSalesman(sid).then(salesman => {
        res.status(200).send(salesman);
    }).catch(_ => {
        res.status(404).send(`No Salesman with ${sid} found!`);
    });
}

exports.updateSalesmanOHRM = function (req, res) {
    let data = req.body;

    ohrmService.updateSalesman(data).then(_ => {
        res.status(200).send('Salesman updated!');
    }).catch(_ => {
        res.status(500).send('Salesman could not be updated!');
    });
}