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
 * creates a new salesman in the database
 * @param db
 * @param salesman
 * @returns {Promise<any>}
 */
exports.createSalesman = async function (db, salesman){
    return db.collection('salesman').insertOne(salesman);
}

/**
 * deletes a salesman from the database
 * @param db
 * @param sid
 * @returns {Promise<any>}
 */
exports.deleteSalesman = async function (db, sid){
    return db.collection('salesman').deleteOne({sid: sid});
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
    return db.collection('salesman').updateOne(
        { sid: salesman.sid },
        { $set: {...salesmanData} }
    );
}