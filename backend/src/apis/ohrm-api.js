const ohrmService = require('../services/orange-hrm-service');
const evaluationService = require("../services/evaluation-service");

/**
 * Get all salesmen from the HRM system
 * */
exports.getAllSalesmanOHRM = function (req, res) {
    ohrmService.getSalesmen().then(salesman => {
        res.status(200).send(salesman);
    }).catch(_ => {
        res.status(500).send('Salesman not found!');
    });
}

/**
 * Get a specific salesman by its sid
 * */
exports.getSalesmanOHRM = function (req, res) {
    let sid = req.params.id;

    ohrmService.getSalesmanByCode(sid).then(salesman => {
        res.status(200).send(salesman);
    }).catch(_ => {
        res.status(404).send(`No Salesman with ${sid} found!`);
    });
}

exports.createBonusSalary = function (req, res) {
    let sid = req.params.id;
    let year = req.params.year;

    evaluationService.getTotalBonus(sid, year).then(totalBonus => {
        const bonus = OrangeHRMBonusSalaryDTO.fromJSON(
            {
                value: totalBonus,
                year: year
            });

        ohrmService.createBonusSalary(sid, bonus).then(salesman => {
            res.status(200).send(salesman);
        }).catch(_ => {
            res.status(404).send(`No Salesman with ${sid} found!`);
        });
    }).catch(_ => {
        res.status(500).send('Bonus not created!');
    });
}