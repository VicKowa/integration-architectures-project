const { expect } = require('chai');
const sinon = require('sinon');
const bonusService = require('../../src/services/bonus-service');
const EvaluationService = require('../../src/services/evaluation-service');
const openCrxService = require('../../src/services/open-crx-service');

describe('bonus-service unit tests', function () {
    before(function () {
        global.bonusFactorMap = [
            { productName: "ProductA", bonusPerSale: 100 },
            { productName: "ProductB", bonusPerSale: 200 }
        ];
    });

    afterEach(function () {
        sinon.restore();
    });

    // describe('getSPRBonus', function () {
    //     it('should calculate SPR bonus correctly with target 4 and actual values between 0 and 5', async function () {
    //         const fakeSPR = {
    //             specifiedRecords: {
    //                 r1: { targetValue: "4", actualValue: "4" }, // actual >= target: bonus = max(4-4, 1)*50 = 50
    //                 r2: { targetValue: "4", actualValue: "3" }  // actual < target: bonus = 20
    //             }
    //         };
    //
    //         sinon.stub(EvaluationService, 'getSocialPerformanceRecord').resolves(fakeSPR);
    //
    //         const totalBonus = await bonusService.getSPRBonus({}, 'sid1', '2023');
    //         expect(totalBonus).to.equal(70);
    //         expect(fakeSPR.totalBonus).to.equal(70);
    //         expect(fakeSPR.specifiedRecords.r1.bonus).to.equal("50");
    //         expect(fakeSPR.specifiedRecords.r2.bonus).to.equal("20");
    //     });
    //
    //     it('should throw an error when social performance record is not found', async function () {
    //         sinon.stub(salesmanService, 'getSocialPerformanceRecord').resolves(null);
    //
    //         try {
    //             await bonusService.getSPRBonus({}, 'sid1', '2023');
    //             throw new Error('Expected error was not thrown');
    //         } catch (err) {
    //             expect(err.message).to.equal("SocialPerformanceRecord not found");
    //         }
    //     });
    // });

    describe('getOEBonus', function () {
        it('should calculate OE bonus correctly', async function () {
            const fakeSales = [
                { order: [{ name: "ProductA" }] },
                { order: [{ name: "ProductB" }] },
                { order: [{ name: "ProductA" }] }
            ];

            sinon.stub(openCrxService, 'getSales').resolves(fakeSales);

            const totalBonus = await bonusService.getOEBonus('sid1', '2023');
            expect(totalBonus).to.equal(100 + 200 + 100);
        });
    });

    describe('getTotalBonus', function () {
        it('should sum SPR bonus and OE bonus', async function () {
            sinon.stub(bonusService, 'getSPRBonus').resolves(70);
            sinon.stub(bonusService, 'getOEBonus').resolves(300);

            const totalBonus = await bonusService.getTotalBonus({}, 'sid1', '2023');
            expect(totalBonus).to.equal(370);
        });
    });

    describe('calculateAllBonuses', function () {
        it('should calculate order evaluation and social performance bonuses and sum them', function () {
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
