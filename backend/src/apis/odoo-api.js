const odooService = require('../services/odoo-service');

exports.getAllSalesman = async (req, res) => {
    return odooService.getAllSalesman().then(data => {
        res.status(200).send(data);
    }).catch(_ => {
        res.status(500).send('Test failed!');
    });
}

exports.getSalesman = async (req, res) => {
    const id = req.params.id;

    return odooService.getSalesman(id).then(data => {
        res.status(200).send(data);
    }).catch(_ => {
        res.status(500).send('Test failed!');
    });
}

exports.getAllBonuses = async (req, res) => {
    return odooService.getEveryBonus().then(data => {
        res.status(200).send(data);
    }).catch(error => {
        res.status(500).send({error: error.message});
    });
}

exports.getBonus = async (req, res) => {
    const id = req.params.id;

    return odooService.getBonusForSalesman(id).then(data => {
        res.status(200).send(data);
    }).catch(error => {
        res.status(500).send({error: error.message});
    });
}