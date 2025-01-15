const Evaluation = require('../models/Evaluation.js');

const OrderEvaluation = require('../models/OrderEvaluation.js');
const OrderEvaluationDTO = require('../dtos/OrderEvaluationDTO.js');

const SocialPerformanceRecord = require('../models/SocialPerformanceRecord.js');
const SocialPerformanceRecordDTO= require('../dtos/SocialPerformanceRecordDTO.js');
const {query} = require("express");

/**
 * creates a new evaluation report in the database
 * @param db
 * @param  evaluation : EvaluationDTO
 * @returns {Promise<any>}
 */
exports.createEvaluation = async function (db, evaluation){
    if(!evaluation.sid || !evaluation.year)
        throw new Error("Evaluation must have a sid and year");

    // check if evaluation exists
    if (await this.getEvaluation(db, evaluation.sid, evaluation.year)) {
        throw new Error('Evaluation already exists!');
    }

    return db.collection('eval').insertOne(evaluation);
}

/**
 * gets all evaluations which match the query
 * @param db
 * @param query : string
 * @returns {Promise<Evaluation[]>}
 */
exports.getAllEvaluations = async function (db, query){
    const allowedFilters = ["sid", "year", "approvalStatus"];

    Object.keys(query).forEach(f => {
        if (!allowedFilters.includes(f)) {
            delete query[f];
        }
    });

    return db.collection('eval').find(query).toArray();
}


/**
 * gets a specific evaluation by its sid and year
 * @param db
 * @param sid : string
 * @param year : string
 * @returns {Promise<Evaluation>}
 */
exports.getEvaluation = async function (db, sid, year){
    return db.collection('eval').findOne({sid: sid, year: year});
}

/**
 * updates an evaluation in the database
 * @param db
 * @param evaluation : EvaluationDTO
 * @returns {Promise<any>}
 */
exports.updateEvaluation = async function (db, evaluation){

    // check if evaluation exists
    if (!evaluation || !evaluation.sid) {
        throw new Error('Evaluation not found!');
    }

    // remove _id from object
    const {_id, ...evalData} = evaluation;

    // update evaluation
    return db.collection('eval').updateOne(
        { sid: evaluation.sid, year: evaluation.year},
        { $set: {...evalData} }
    );
}

/**
 * deletes an evaluation from the database
 * @param db
 * @param sid : string
 * @param year : string
 * @returns {Promise<any>}
 */
exports.deleteEvaluation = async function (db, sid, year){
    return db.collection('eval').deleteOne({sid: sid, year: year});
}

/**
 * gets the order evaluation from an evaluation report
 * @param db
 * @param sid : string
 * @param year : string
 * @returns {Promise<OrderEvaluation>}
 */
exports.getOrderEvaluation = async function (db, sid, year){
    // get evaluation by sid and year
    const evaluation = await this.getEvaluation(db, sid, year);

    // check if evaluation exists
    if(!evaluation) throw new Error(`Evaluation with sid ${sid} and ${year} not found!`);

    // return social performance record by year
    return evaluation.orderEvaluation;
}

/**
 * updates an order evaluation of an evaluation report
 * @param db
 * @param sid : string
 * @param year : string
 * @param oe : OrderEvaluationDTO
 * @returns {Promise<any>}
 */
exports.updateOrderEvaluation = async function (db, sid, year, oe){

    // get evaluation by sid and year
    const evaluation = await this.getEvaluation(db, sid, year);

    // check if evaluation exists
    if(!evaluation) throw new Error(`Evaluation with sid ${sid} and ${year} not found!`);

    // update order evaluation
    evaluation.orderEvaluation = oe;

    await this.updateEvaluation(db, evaluation);
}


/**
 * gets the social performance record from an evaluation report
 * @param db
 * @param sid : string
 * @param year : string
 * @returns {Promise<SocialPerformanceRecord>}
 */
exports.getSocialPerformanceRecord = async function (db, sid, year){
    // get social performance record by sid and year
    const evaluation = await this.getEvaluation(db, sid, year);

    // check if evaluation exists
    if(!evaluation) throw new Error(`Evaluation with sid ${sid} and ${year} not found!`);

    // return social performance record by year
    return evaluation.socialPerformanceEvaluation;
}

/**
 * updates a social performance record of an evaluation report
 * @param db
 * @param sid : string
 * @param year : string
 * @param spr : SocialPerformanceRecordDTO
 * @returns {Promise<any>}
 */
exports.updateSocialPerformanceRecord = async function (db, sid, year, spr){

    // get evaluation by sid and year
    const evaluation = await this.getEvaluation(db, sid, year);

    // check if evaluation exists
    if(!evaluation) throw new Error(`Evaluation with sid ${sid} and ${year} not found!`);

    // update order evaluation
    evaluation.socialPerformanceEvaluation = spr;

    await this.updateEvaluation(db, evaluation);
}



