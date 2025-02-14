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

    return bonusService.getSPRBonus(db, sid, year).then(bonus => {
        res.status(200).send({bonus: bonus});
    }).catch(_ => {
        res.status(404).send(`No bonus for ${sid} and ${year} found!`);
    });
}

module.exports = exports;