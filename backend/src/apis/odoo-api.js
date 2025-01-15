const odooService = require('../services/odoo-service');

exports.getAllSalesman = async (req, res) => {
    odooService.getAllSalesman().then(data => {
        res.status(200).send(data);
    }).catch(_ => {
        res.status(500).send('Test failed!');
    });
}

exports.getSalesman = async (req, res) => {
    const id = req.params.id;

    odooService.getSalesman(id).then(data => {
        res.status(200).send(data);
    }).catch(_ => {
        res.status(500).send('Test failed!');
    });
}

exports.getAllBonuses = async (req, res) => {
    odooService.getEveryBonus().then(data => {
        res.status(200).send(data);
    }).catch(error => {
        res.status(500).send({error: error.message});
    });
}

exports.getBonus = async (req, res) => {
    const id = req.params.id;

    odooService.getBonusForSalesman(id).then(data => {
        res.status(200).send(data);
    }).catch(error => {
        res.status(500).send({error: error.message});
    });
}