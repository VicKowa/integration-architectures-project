const { expect } = require('chai');
const sinon = require('sinon');
const bonusApi = require('../../src/apis/bonus-api');
const bonusService = require('../../src/services/bonus-service');
const { fromJSON } = require("../../src/dtos/EvaluationDTO");

describe('Bonus API Integration Test', function () {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            body: {}, // Will be set in each test
            app: {
                get: sandbox.stub().returns({})  // Mock db object
            }
        };
        res = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('recalculateSPRBonus', function () {
        it('should recalculate the SPR bonus and return 200 with bonus data', async () => {
            const fakeBonus = { amount: 5000, reason: 'SPR' };

            // Set up the incoming evaluation data
            req.body = {
                sid: 0,
                year: 0,
                department:0 ,
                orderEvaluation: {totalBonus:  {}, orders: []},
                socialPerformanceEvaluation: {specifiedRecords: []},
                approvalStatus: 0,
                comment: ""
            }

            // Stub the service method to return the fake bonus
            sandbox.stub(bonusService, 'recalculateSPRBonus').resolves(fakeBonus);

            await bonusApi.recalculateSPRBonus(req, res);

            // Ensure status 200 and bonus data is sent
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeBonus)).to.be.true;
        });

        it('should return 404 with error message if the bonus calculation fails', async () => {
            // Set up the incoming evaluation data
            req.body = {
                sid: 0,
                year: 0,
                department:0 ,
                orderEvaluation: {totalBonus:  {}, orders: []},
                socialPerformanceEvaluation: {specifiedRecords: []},
                approvalStatus: 0,
                comment: ""
            }

            // Stub the service method to reject with an error
            sandbox.stub(bonusService, 'recalculateSPRBonus').rejects(new Error());

            await bonusApi.recalculateSPRBonus(req, res);

            // Ensure status 404 and error message is sent
            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });
});
