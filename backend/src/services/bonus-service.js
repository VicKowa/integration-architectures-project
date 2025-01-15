const orangeHrmService = require('./orange-hrm-service');
const openCrxService = require('./open-crx-service');
const evaluationService = require('./evaluation-service');
const salesmanService = require('./salesman-service');

const Salesman = require("../models/Salesman");
const Evaluation = require('../models/Evaluation.js');
const SocialPerformanceRecord = require("../dtos/SocialPerformanceRecordDTO");

//TODO: Remove this hardcoded bonus factors
const bonusFactorMap = [
    {productName: "HooverGo", bonusPerSale: 35},
    {productName: "HooverClean", bonusPerSale: 10},
];

/**
 * gets the total bonus of social performance records for a specific evaluation of a salesman
 * @param db
 * @param sid : string
 * @param year : string
 * @returns {Promise<any>}
 */
exports.getSPRBonus = async function(db, sid, year) {
    const socialPerformanceRecord = await salesmanService.getSocialPerformanceRecord(db, sid, year);

    if(!socialPerformanceRecord)
        throw new Error("SocialPerformanceRecord not found");

    return socialPerformanceRecord.totalBonus;
}

/**
 * gets the total bonus of order evaluations for a specific evaluation of a salesman
 * @param sid : string
 * @param year : string
 * @returns {Promise<any>}
 */
exports.getOEBonus = async function(sid, year) {
    const sales = await openCrxService.getSales(sid, year);

    return sales.reduce((totalBonus, sale) => {
        return totalBonus +  bonusFactorMap.find(bonusFactor => bonusFactor.productName === sale.order[0].name).bonusPerSale;
    }, 0);
}

/**
 * gets the total bonus for a specific evaluation of a salesman
 * @param db
 * @param sid : string
 * @param year : string
 * @returns {Promise<any>}
 */
exports.getTotalBonus = async function(db, sid, year){
    return await this.getSPRBonus(db, sid, year) + await this.getOEBonus( sid, year);
}