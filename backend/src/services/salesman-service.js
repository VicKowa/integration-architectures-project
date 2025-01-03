const Salesman = require('../models/Salesman.js');

/**
 * gets all salesmen from the database
 * @param db source database
 * @return {Promise<Salesman[]>}
 */
exports.getAllSalesman = async function (db){
    return db.collection('salesman').find().toArray();
}

/**
 * gets a specific salesman by its sid
 * @param db
 * @param sid
 * @returns {Promise<Salesman>}
 */
exports.getSalesman = async function (db, sid){
    return db.collection('salesman').findOne({sid: sid});
}

/**
 * gets a specific social performance record by its year
 * @param db
 * @param sid
 * @param year
 * @returns {Promise<SocialPerformanceRecord>}
 */
exports.getSocialPerformanceRecord = async function (db, sid, year){
    // get salesman by sid
    const salesman = await this.getSalesman(db, sid);

    // check if salesman exists
    if(!salesman) throw new Error(`Salesman with sid ${sid} not found!`);

    // return social performance record by year
    return salesman.socialPerformanceRecords.find(r => r.year === year);
}

/**
 * creates a new salesman in the database
 * @param db
 * @param salesman
 * @returns {Promise<any>}
 */
exports.createSalesman = async function (db, salesman){
    return await db.collection('salesman').insertOne(salesman);
}

/**
 * creates a new social performance record for a salesman
 * @param db
 * @param salesman
 * @param record
 * @returns {Promise<any>}
 */
exports.createSocialPerformanceRecord = async function (db, salesman, record){
    // get salesman by sid
    if (!salesman) throw new Error(`Salesman with sid ${salesman.sid} not found!`);

    // check if record already exists
    Salesman.addSocialPerformanceRecord(salesman, record);

    // update salesman
    return this.updateSalesman(db, salesman);
}

/**
 * deletes a salesman from the database
 * @param db
 * @param sid
 * @returns {Promise<any>}
 */
exports.deleteSalesman = async function (db, sid){
    return await db.collection('salesman').deleteOne({sid: sid});
}

/**
 * deletes a social performance record from a salesman
 * @param db
 * @param sid
 * @param year
 * @returns {Promise<any>}
 */
exports.deleteSocialPerformanceRecord = async function (db, sid, year){
    // get record by year from salesman with sid
    const record = await this.getSocialPerformanceRecord(db, sid, year);

    // check if record exists
    if(!record) throw new Error(`Record for year ${year} not found!`);

    // delete record from salesman
    return db.collection('salesman').updateOne(
        { sid: sid },
        { $pull: { socialPerformanceRecords: record } }
    );
}

/**
 * updates a salesman in the database
 * @param db
 * @param salesman
 * @returns {Promise<any>}
 */
exports.updateSalesman = async function (db, salesman){
    // check if salesman exists
    if (!salesman || !salesman.sid) {
        throw new Error('Salesman not found!');
    }

    // remove _id from object
    const {_id, ...salesmanData} = salesman;

    // update salesman
    return await db.collection('salesman').updateOne(
        { sid: salesman.sid },
        { $set: {...salesmanData} }
    );
}

/**
 * updates a social performance record for a salesman
 * @param db
 * @param salesman
 * @param record
 * @returns {Promise<any>}
 */
exports.updateSocialPerformanceRecord = async function (db, salesman, record){
    // check if salesman and record exist
    if (!salesman || !salesman.sid) {
        throw new Error('Salesman not found!');
    }

    if (!record || !record.year) {
        throw new Error('Record not found!');
    }

    // get record by year from salesman
    const recordIndex = salesman.socialPerformanceRecords.findIndex(r => r.year === record.year);

    // check if record exists
    if (recordIndex === -1) {
        throw new Error(`Record for year ${record.year} not found!`);
    }

    // update record
    salesman.socialPerformanceRecords[recordIndex] = record;

    // update salesman
    return await this.updateSalesman(db, salesman);
}