const Evaluation = require('../models/Evaluation.js');

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

    return await db.collection('eval').insertOne(evaluation);
}

/**
 * gets a specific social performance record by its year
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
    return await db.collection('eval').updateOne(
        { sid: evaluation.sid },
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
    return await db.collection('eval').deleteOne({sid: sid, year: year});
}