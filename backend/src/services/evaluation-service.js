const Evaluation = require('../models/Evaluation.js');
const OrderEvaluationDTO = require('../dtos/OrderEvaluationDTO.js');
const SocialPerformanceRecordDTO= require('../dtos/SocialPerformanceRecordDTO.js');
const OpenCRXService = require('./open-crx-service.js');
const EvaluationDTO = require("../dtos/EvaluationDTO");
const DEPARTMENT = "Sales";
const environment = require('../../environments/environment.js');
const OrangeHRMService = require('./orange-hrm-service.js');
const { calculateAllBonuses } = require('./bonus-service.js');
const OrangeHRMBonusSalaryDTO = require("../dtos/OrangeHRM/OrangeHRMBonusSalaryDTO");
const ApprovalEnum = environment.default.approvalEnum;

/**
 * creates a new evaluation report in the database
 * @param db
 * @param sid : string
 * @param year : string
 * @returns {Promise<any>}
 */
exports.createEvaluation = async function (db, sid, year){
    if(!sid || !year)
        throw new Error("Evaluation must have a sid and year");

    // check if evaluation exists
    if (await this.getEvaluation(db, sid, year)) {
        throw new Error('Evaluation already exists!');
    }

    const spr = SocialPerformanceRecordDTO.createRecordWithRandomActualValues(sid, year);

    // create Evaluation
    let orderEvaluation = new OrderEvaluationDTO(0, []);

    try {
        const salesOrder = await OpenCRXService.getSales(sid, year);
        orderEvaluation = EvaluationDTO.fromOpenCRXSaleDTO(salesOrder);
    } catch (_) {
        // do nothing
    }

    const evaluationDTO = new EvaluationDTO(sid, year, DEPARTMENT, orderEvaluation, spr, environment.default.approvalEnum.NONE, '');

    // calculate bonuses
    calculateAllBonuses(evaluationDTO);

    return db.collection('eval').insertOne(new Evaluation(evaluationDTO));
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

        if(f === "approvalStatus"){
            query["approvalStatus"] = parseInt(query["approvalStatus"]);
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
    return db.collection('eval').findOne({sid: sid, year: year}) || null;
}

/**
 * updates an evaluation in the database
 * @param db
 * @param evaluation : EvaluationDTO
 * @returns {Promise<any>}
 */
exports.updateEvaluation = async function (db, evaluation){
    // check if evaluation exists
    if (!evaluation || !evaluation.sid)
        throw new Error('Evaluation not found!');


    // recalculates bonuses
    calculateAllBonuses(evaluation);

    // if salesman approves the evaluation, the bonus can be stored in orangehrm
    if(evaluation.approvalStatus === ApprovalEnum.SALESMAN) {
        try {
            await OrangeHRMService.createBonusSalary(
                evaluation.sid,
                new OrangeHRMBonusSalaryDTO(evaluation.year, evaluation.totalBonus));
        } catch (e) {
            console.log(e);
        }
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



