const orangeHrmService = require('./orange-hrm-service');
const openCrxService = require('./open-crx-service');
const salesmanService = require('./salesman-service');

const Salesman = require("../models/salesman/Salesman");
const SocialPerformanceRecord = require("../models/salesman/SocialPerformanceRecord");

//TODO: Remove this hardcoded bonus factors
const bonusFactorMap = [
    {productName: "HooverGo", bonusPerSale: 35},
    {productName: "HooverClean", bonusPerSale: 10},
];

exports.getSPRBonus = async function(db, sid, year) {
    const socialPerformanceRecord = await salesmanService.getSocialPerformanceRecord(db, sid, year);

    if(!socialPerformanceRecord)
        throw new Error("SocialPerformanceRecord not found");

    return Object.values(socialPerformanceRecord.specifiedRecords).reduce((totalBonus, specifiedRecord) => {
        return totalBonus + specifiedRecord.bonus;
    },0);
}

exports.getOEBonus = async function(sid){
    const sales = await openCrxService.getSales(sid);

    return sales.reduce((totalBonus, sale) => {
        return totalBonus +  bonusFactorMap.find(bonusFactor => bonusFactor.productName === sale.order[0].name).bonusPerSale;
    }, 0);
}

exports.getTotalBonus = async function(db, sid, year){
    return await this.getSPRBonus(db, sid, year) + await this.getOEBonus(db, sid, year);
}

