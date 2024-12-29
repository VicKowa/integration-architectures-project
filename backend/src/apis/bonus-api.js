const bonusService = require('../services/bonus-service');

exports.getSPRBonus = function (req, res){
    const db = req.app.get('db');
    let sid = req.params.sid;
    let year = req.params.year;

    bonusService.getSPRBonus(db, sid, year).then(bonus => {
        res.status(200).send({bonus: bonus});
    }).catch(_ => {
        res.status(404).send(`No bonus for ${sid} and ${year} found!`);
    });
}

exports.getOEBonus = function (req, res){
    let sid = req.params.sid;
    let year = req.params.year;

    bonusService.getOEBonus(sid, year).then(bonus => {
        res.status(200).send({bonus: bonus});
    }).catch(_ => {
        res.status(404).send(`No bonus for ${sid} found!`);
    });
}

exports.getTotalBonus = function (req, res){
    const db = req.app.get('db');
    let sid = req.params.sid;
    let year = req.params.year;

    bonusService.getTotalBonus(db, sid, year).then(bonus => {
        res.status(200).send({bonus: bonus});
    }).catch(_ => {
        res.status(404).send(`No bonus for ${sid} and ${year} found!`);
    });
}

module.exports = exports;