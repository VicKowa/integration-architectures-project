const bonusService = require('../services/bonus-service');
const { fromJSON } = require("../dtos/EvaluationDTO");
/**
 * recalculates the total bonus of social performance records for a specific evaluation of a salesman
 * @param req
 * @param res
 */
exports.recalculateSPRBonus = function (req, res){
    const db = req.app.get('db');
    let evaluation = fromJSON(req.body);

    bonusService.recalculateSPRBonus(db, evaluation).then(spr => {
        res.status(200).send(spr);
    }).catch(_ => {
        res.status(404).send(`Error recalculating bonus for ${evaluation.sid} and ${evaluation.year}!`);
    });
}

module.exports = exports;