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

    return evaluationService.createEvaluation(db, sid, year).then(_ => {
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

    return evaluationService.getAllEvaluations(db, q).then(evaluations => {
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

    return evaluationService.getEvaluation(db, sid, year).then(evaluation => {
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

    return evaluationService.updateEvaluation(db, evaluationDto).then(_ => {
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

    return evaluationService.deleteEvaluation(db, sid, year).then(_ => {
        res.status(200).send('Evaluation deleted!');
    }).catch(_ => {
        res.status(500).send('Evaluation could not be deleted!');
    });
}

/**
 * gets the order evaluation of an evaluation by its sid and year
 * @param req
 * @param res
 */
exports.getOrderEvaluation = function (req, res){
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;

    return evaluationService.getOrderEvaluation(db, sid, year).then(oe => {
        // remove _id from oe
        const {_id, ...oeData} = oe;
        res.status(200).send(oeData);
    }).catch(_ => {
        res.status(404).send(`No OrderEvaluation with ${sid} and ${year} found!`);
    });
}

/**
 * updates the order evaluation of an evaluation by its sid and year
 * @param req
 * @param res
 */
exports.updateOrderEvaluation = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;
    const oeDto = OrderEvaluationDTO.fromJSON(req.body);

    return evaluationService.updateOrderEvaluation(db, sid, year, oeDto).then(_ => {
        res.status(200).send('OrderEvaluation updated!');
    }).catch(_ => {
        res.status(500).send('OrderEvaluation could not be updated!');
    });
}

/**
 * gets the social performance record of an evaluation by its sid and year
 * @param req
 * @param res
 */
exports.getSocialPerformanceRecord = function (req, res){
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;

    return evaluationService.getSocialPerformanceRecord(db, sid, year).then(spr => {
        // remove _id from spr
        const {_id, ...sprData} = spr;
        res.status(200).send(sprData);
    }).catch(_ => {
        res.status(404).send(`No SocialPerformanceRecord with ${sid} and ${year} found!`);
    });
}

/**
 * updates the social performance record of an evaluation by its sid and year
 * @param req
 * @param res
 */
exports.updateSocialPerformanceRecord = function (req, res) {
    const db = req.app.get('db');
    let sid = req.params.id;
    let year = req.params.year;
    const sprDto = SocialPerformanceRecordDTO.fromJSON(req.body);

    return evaluationService.updateSocialPerformanceRecord(db, sid, year, sprDto).then(_ => {
        res.status(200).send('SocialPerformanceRecord updated!');
    }).catch(_ => {
        res.status(500).send('SocialPerformanceRecord could not be updated!');
    });
}

module.exports = exports;