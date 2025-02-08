const salesmanService = require('./salesman-service');
const openCrxService = require('./open-crx-service');
/**
 * calculates the total bonus of social performance records for a specific evaluation of a salesman
 * @param db
 * @param sid : string
 * @param year : string
 * @returns {Promise<any>}
 */
exports.getSPRBonus = async function(db, sid, year) {
    const socialPerformanceRecord = await salesmanService.getSocialPerformanceRecord(db, sid, year);

    if(!socialPerformanceRecord)
        throw new Error("SocialPerformanceRecord not found");

    calculateSocialPerformanceRecordBonus(socialPerformanceRecord);

    return socialPerformanceRecord.totalBonus;
}

/**
 * calculates the total bonus of social performance records for a specific evaluation of a salesman
 *
 * @param spr : SocialPerformanceRecordDTO
 * @returns {SocialPerformanceRecordDTO}
 * */
function calculateSocialPerformanceRecordBonus(spr) {
    // Rule:
    // actualValue >= targetValue -> for each point >= (but at least one!), bonus += 50
    // actualValue < targetValue -> bonus += 20

    for (const record of Object.values(spr.specifiedRecords)) {
        const targetValue = parseInt(record.targetValue);
        const actualValue = parseInt(record.actualValue);
        let bonus = 0;

        if (actualValue >= targetValue)
            bonus += Math.max(actualValue - targetValue, 1) * 50;
        else
            bonus += 20;

        record.bonus = bonus.toString();
    }

    spr.totalBonus = Object.values(spr.specifiedRecords).reduce((totalBonus, record) => {
        return totalBonus + parseInt(record.bonus);
    }, 0);

    return spr;
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

// Rule:
// client_ranking = 'Excellent':
//      0 <= items < 10 -> factor = 125
//      10 <= items <= 20 -> factor = 140
//      20 < items -> factor = 155
// client_ranking = 'Very High':
//      0 <= items < 10 -> factor = 110
//      10 <= items <= 20 -> factor = 125
//      20 < items -> factor = 140
// client_ranking = 'High':
//      0 <= items < 10 -> factor = 80
//      10 <= items <= 20 -> factor = 95
//      20 < items -> factor = 110
// client_ranking = 'Medium':
//      0 <= items < 10 -> factor = 50
//      10 <= items <= 20 -> factor = 65
//      20 < items -> factor = 80
// client_ranking = 'Low':
//      0 <= items < 10 -> factor = 20
//      10 <= items <= 20 -> factor = 35
//      20 < items -> factor = 50

const factorTableOrderEvaluation = {
    5: [
        { min: 0, max: 9, factor: 125 },
        { min: 10, max: 20, factor: 140 },
        { min: 21, max: Infinity, factor: 155 }
    ],
    4: [
        { min: 0, max: 9, factor: 110 },
        { min: 10, max: 20, factor: 125 },
        { min: 21, max: Infinity, factor: 140 }
    ],
    3: [
        { min: 0, max: 9, factor: 80 },
        { min: 10, max: 20, factor: 95 },
        { min: 21, max: Infinity, factor: 110 }
    ],
    2: [
        { min: 0, max: 9, factor: 50 },
        { min: 10, max: 20, factor: 65 },
        { min: 21, max: Infinity, factor: 80 }
    ],
    1: [
        { min: 0, max: 9, factor: 20 },
        { min: 10, max: 20, factor: 35 },
        { min: 21, max: Infinity, factor: 50 }
    ]
};

/**
 * Get the bonus factor for a given client ranking and number of items sold.
 * @param clientRanking The client ranking
 * @param itemsSold The number of items sold
 * @returns The bonus factor
 */
const getBonusFactor = (clientRanking, itemsSold) => {
    if (!(clientRanking in factorTableOrderEvaluation)) {
        throw new Error(`Invalid client ranking: ${clientRanking}`);
    }

    // Find the correct factor based on range
    for (const { min, max, factor } of factorTableOrderEvaluation[clientRanking]) {
        if (parseInt(itemsSold) >= min && parseInt(itemsSold) <= max) {
            return factor;
        }
    }

    return 0; // Fallback, should not happen
}

/**
 * Get the bonus for a given client ranking and number of items sold.
 * @param clientRanking The client ranking
 * @param itemsSold The number of items sold
 * @returns The bonus
 */
const getOrderEvaluationBonus = (clientRanking, itemsSold) => {
    return getBonusFactor(clientRanking, itemsSold) * clientRanking;
}

/**
 * Calculate the total bonus for a given order evaluation.
 * @param orderEvaluation The order evaluation
 * @returns The total bonus
 */
const calculateOrderEvaluationBonus = (orderEvaluation) => {
    orderEvaluation.orders.forEach(order => {
        order.bonus = getOrderEvaluationBonus(order.clientRanking, order.items);
    });
    return orderEvaluation.calculateTotalBonus();
}

/**
 * Calculate the total bonus for a given evaluation.
 * @param evaluation {EvaluationDTO} The evaluation
 */
exports.calculateAllBonuses = (evaluation) => {
    if(evaluation.orderEvaluation && evaluation.orderEvaluation.orders.length > 0) {
        evaluation.orderEvaluation.totalBonus = calculateOrderEvaluationBonus(evaluation.orderEvaluation);
    }

    if(evaluation.socialPerformanceEvaluation) {
        evaluation.socialPerformanceEvaluation = calculateSocialPerformanceRecordBonus(evaluation.socialPerformanceEvaluation);
    }

    evaluation.totalBonus = evaluation.orderEvaluation.totalBonus + evaluation.socialPerformanceEvaluation.totalBonus;

    return evaluation;
}
