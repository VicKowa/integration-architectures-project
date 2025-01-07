const bonusService = require('../services/bonus-service');

/**
 * gets the total bonus of social performance records for a specific evaluation of a salesman
 * @param req
 * @param res
 */
exports.getSPRBonus = function (req, res){
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;

    bonusService.getSPRBonus(db, sid, year).then(bonus => {
        res.status(200).send({bonus: bonus});
    }).catch(_ => {
        res.status(404).send(`No bonus for ${sid} and ${year} found!`);
    });
}

/**
 * gets the total bonus of order evaluations for a specific evaluation of a salesman
 * @param req
 * @param res
 */
exports.getOEBonus = function (req, res){
    let sid = req.params.id;
    let year = req.params.year;

    bonusService.getOEBonus(sid, year).then(bonus => {
        res.status(200).send({bonus: bonus});
    }).catch(_ => {
        res.status(404).send(`No bonus for ${sid} found!`);
    });
}

/**
 *
 * gets the total bonus for a specific evaluation of a salesman
 * @param req
 * @param res
 */
exports.getTotalBonus = function (req, res){
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;

    bonusService.getTotalBonus(db, sid, year).then(bonus => {
        res.status(200).send({bonus: bonus});
    }).catch(_ => {
        res.status(404).send(`No bonus for ${sid} and ${year} found!`);
    });
}

module.exports = exports;