const { expect } = require('chai');
const sinon = require('sinon');
const bonusService = require('../../src/services/bonus-service');
const EvaluationService = require('../../src/services/evaluation-service');
const openCrxService = require('../../src/services/open-crx-service');

describe('bonus-service unit tests', function () {
    // Set up the bonus factor map before each test
    before(function () {
        global.bonusFactorMap = [
            { productName: "ProductA", bonusPerSale: 100 },
            { productName: "ProductB", bonusPerSale: 200 }
        ];
    });

    after(() => {
            delete global.bonusFactorMap;
        }
    )

    afterEach(function () {
        sinon.restore();
    });

    describe('calculateAllBonuses', function () {
        it('should calculate order evaluation and social performance bonuses and sum them', function () {
            // Mock evaluation object
            const evaluation = {
                orderEvaluation: {
                    orders: [
                        { clientRanking: 5, items: 5 },
                        { clientRanking: 3, items: 15 }
                    ],
                    calculateTotalBonus: function () {
                        return this.orders.reduce((acc, order) => acc + parseInt(order.bonus), 0);
                    }
                },
                socialPerformanceEvaluation: {
                    specifiedRecords: {
                        r1: { targetValue: "4", actualValue: "4" },
                        r2: { targetValue: "4", actualValue: "3" }
                    }
                },
                totalBonus: 0
            };

            const result = bonusService.calculateAllBonuses(evaluation);

            // Order evaluation bonus calculations:
            // For order 1 (clientRanking 5, items 5): factor for ranking 5 with 5 items is 125, bonus = 125 * 5 = 625.
            // For order 2 (clientRanking 3, items 15): factor for ranking 3 with 15 items is 95, bonus = 95 * 3 = 285.
            // Total order bonus = 625 + 285 = 910.
            // Social performance bonus: record r1: 50, record r2: 20; total = 70.
            // Overall total bonus = 910 + 70 = 980.
            expect(evaluation.orderEvaluation.totalBonus).to.equal(910);
            expect(evaluation.socialPerformanceEvaluation.totalBonus).to.equal(70);
            expect(result.totalBonus).to.equal(980);
        });
    });
});
