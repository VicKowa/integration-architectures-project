exports.getAllSalesman = async function (db){
    return db.collection('salesman').find().toArray();
}

exports.getSalesman = async function (db, sid){
    return db.collection('salesman').findOne(
        { sid: sid }
    );
}

exports.getSocialPerformanceRecord = async function (db, sid, year){
    return db.collection('salesman').findOne(
        { sid: sid }
    ).socialPerformanceRecords.find(
        { year: year }
    );
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

exports.deleteSocialPerformanceRecord = async function (db, sid, record){
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