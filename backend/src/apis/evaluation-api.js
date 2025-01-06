const evaluationService = require('../services/evaluation-service');
const EvaluationDTO = require('../dtos/EvaluationDTO.js');

/**
 * creates a new evaluation in the database
 * @param req
 * @param res
 */
exports.createEvaluation = function (req, res) {
    const db = req.app.get('db');
    const evaluationDto = EvaluationDTO.fromJSON(req.body);

    evaluationService.createEvaluation(db, evaluationDto).then(_ => {
        res.status(200).send(`Evaluation with sid ${evaluationDto.sid} created!`);
    }).catch(_ => {
        res.status(500).send(`Evaluation with sid ${evaluationDto.sid} and year ${evaluationDto.year} already exists!`);
    });
}

/**
 * gets a specific evaluation by its sid and year
 * @param req
 * @param res
 */
exports.getEvaluation = function (req, res){
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;

    evaluationService.getEvaluation(db, sid, year).then(evaluation => {
        // remove _id from evaluation
        const {_id, ...evalData} = evaluation;
        res.status(200).send(evalData);
    }).catch(_ => {
        res.status(404).send(`No Evaluation with ${sid} and ${year} found!`);
    });
}

/**
 * updates an evaluation in the database
 * @param req
 * @param res
 */
exports.updateEvaluation = function (req, res) {
    const db = req.app.get('db');
    const evaluationDto = EvaluationDTO.fromJSON(req.body);

    evaluationService.updateEvaluation(db, evaluationDto).then(_ => {
        res.status(200).send('Evaluation updated!');
    }).catch(_ => {
        res.status(500).send('Evaluation could not be updated!');
    });
}

/**
 * deletes an evaluation from the database
 * @param req
 * @param res
 */
exports.deleteEvaluation = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;

    evaluationService.deleteEvaluation(db, sid, year).then(_ => {
        res.status(200).send('Evaluation deleted!');
    }).catch(_ => {
        res.status(500).send('Evaluation could not be deleted!');
    });
}

module.exports = exports;