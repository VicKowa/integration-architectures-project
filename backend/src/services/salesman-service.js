const {getSocialPerformanceRecord} = require("../apis/salesman-api");
exports.getAllSalesman = async function (db){
    return db.collection('salesman').find().toArray();
}

exports.getSalesman = async function (db, sid){
    return db.collection('salesman').findOne(
        { sid: sid }
    );
}

exports.getSocialPerformanceRecord = async function (db, sid, year){
    const salesman = await db.collection('salesman').findOne({sid: sid});

    if(!salesman) throw new Error(`Salesman with sid ${sid} not found!`);

    return salesman.socialPerformanceRecords.find(r => r.year === year);
}

exports.createSalesman = async function (db, salesman){
    return await db.collection('salesman').insertOne(salesman);
}

exports.createSocialPerformanceRecord = function (db, sid, record){
    return db.collection('salesman').updateOne(
        { sid: sid },
        { $push: { socialPerformanceRecords: record } }
    );
}

exports.deleteSalesman = async function (db, sid){
    return await db.collection('salesman').deleteOne({sid: sid});
}

exports.deleteSocialPerformanceRecord = async function (db, sid, year){
    const record = await this.getSocialPerformanceRecord(db, sid, year); //check if record exists

    if(!record) throw new Error(`Record for year ${year} not found!`);

    return db.collection('salesman').updateOne(
        { sid: sid },
        { $pull: { socialPerformanceRecords: record } }
    );
}

exports.updateSalesman = async function (db, salesman){
    return db.collection('salesman').updateOne(
        { sid: salesman.sid },
        { $set: salesman }
    )
}

exports.updateSocialPerformanceRecord = async function (db, sid, record){
    return db.collection('salesman').updateOne(
        { sid: sid, 'socialPerformanceRecords.year': record.year },
        { $set: { 'socialPerformanceRecords.$': record } }
    );
}