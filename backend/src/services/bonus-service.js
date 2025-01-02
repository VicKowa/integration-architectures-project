const orangeHrmService = require('./orange-hrm-service');
const openCrxService = require('./open-crx-service');
const salesmanService = require('./salesman-service');

const Salesman = require("../models/Salesman");
const SocialPerformanceRecord = require("../dtos/SocialPerformanceRecordDTO");

//TODO: Remove this hardcoded bonus factors
const bonusFactorMap = [
    {productName: "HooverGo", bonusPerSale: 35},
    {productName: "HooverClean", bonusPerSale: 10},
];

exports.getSPRBonus = async function(db, sid, year) {
    const socialPerformanceRecord = await salesmanService.getSocialPerformanceRecord(db, sid, year);

    if(!socialPerformanceRecord)
        throw new Error("SocialPerformanceRecord not found");

    // return Object.values(socialPerformanceRecord.specifiedRecords).reduce((totalBonus, specifiedRecord) => {
    //     return totalBonus + specifiedRecord.bonus;
    // },0);
    return socialPerformanceRecord.totalBonus;
}

exports.getOEBonus = async function(sid, year) {
    const sales = await openCrxService.getSales(sid, year);

    return sales.reduce((totalBonus, sale) => {
        return totalBonus +  bonusFactorMap.find(bonusFactor => bonusFactor.productName === sale.order[0].name).bonusPerSale;
    }, 0);
}

exports.getTotalBonus = async function(db, sid, year){
    return await this.getSPRBonus(db, sid, year) + await this.getOEBonus( sid, year);
}