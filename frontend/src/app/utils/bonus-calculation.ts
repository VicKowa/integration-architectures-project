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

const factorTableOrderEvaluation: Record<string, { min: number; max: number; factor: number }[]> = {
    "Excellent": [
        { min: 0, max: 9, factor: 125 },
        { min: 10, max: 20, factor: 140 },
        { min: 21, max: Infinity, factor: 155 }
    ],
    "Very High": [
        { min: 0, max: 9, factor: 110 },
        { min: 10, max: 20, factor: 125 },
        { min: 21, max: Infinity, factor: 140 }
    ],
    "High": [
        { min: 0, max: 9, factor: 80 },
        { min: 10, max: 20, factor: 95 },
        { min: 21, max: Infinity, factor: 110 }
    ],
    "Medium": [
        { min: 0, max: 9, factor: 50 },
        { min: 10, max: 20, factor: 65 },
        { min: 21, max: Infinity, factor: 80 }
    ],
    "Low": [
        { min: 0, max: 9, factor: 20 },
        { min: 10, max: 20, factor: 35 },
        { min: 21, max: Infinity, factor: 50 }
    ]
};

const clientRankingMap: Record<string, number> = {
    "Excellent": 5,
    "Very High": 4,
    "High": 3,
    "Medium": 2,
    "Low": 1
}

/**
 * Get the bonus factor for a given client ranking and number of items sold.
 * @param clientRanking The client ranking
 * @param itemsSold The number of items sold
 * @returns The bonus factor
 */
const getBonusFactor =  (clientRanking: string, itemsSold: number): number => {
    if (!(clientRanking in factorTableOrderEvaluation)) {
        throw new Error(`Invalid client ranking: ${clientRanking}`);
    }

    // Find the correct factor based on range
    for (const { min, max, factor } of factorTableOrderEvaluation[clientRanking]) {
        if (itemsSold >= min && itemsSold <= max) {
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
const getOrderEvaluationBonus = (clientRanking: string, itemsSold: number): number => {
    return getBonusFactor(clientRanking, itemsSold) * clientRankingMap[clientRanking];
}



export { getOrderEvaluationBonus };



