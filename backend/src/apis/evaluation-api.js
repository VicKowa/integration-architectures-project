const evaluationService = require('../services/evaluation-service');
const EvaluationDTO = require('../dtos/EvaluationDTO.js');
const OrderEvaluationDTO = require('../dtos/OrderEvaluationDTO.js');
const SocialPerformanceRecordDTO = require('../dtos/SocialPerformanceRecordDTO.js');

/**
 * creates a new evaluation in the database
 * @param req
 * @param res
 */
exports.createEvaluation = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;
    // const evaluationDto = EvaluationDTO.fromJSON(req.body);

    evaluationService.createEvaluation(db, sid, year).then(_ => {
        res.status(200).send(`Evaluation with sid ${sid} created!`);
    }).catch(_ => {
        res.status(500).send(`Evaluation with sid ${sid} and year ${year} already exists!`);
    });
}

/**
 * get all evaluations by its sid
 * @param req
 * @param res
 */
exports.getAllEvaluations = function (req, res){
    const db = req.app.get('db');
    let q = req.query;

    evaluationService.getAllEvaluations(db, q).then(evaluations => {
        // remove _id from evaluations
        evaluations = evaluations.map(({_id, ...rest}) => rest);
        res.status(200).send(evaluations);
    }).catch(_ => {
        res.status(404).send(`No Evaluations with ${sid} found!`);
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

module.exports = exports;