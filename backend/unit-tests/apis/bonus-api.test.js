const { expect } = require('chai');
const sinon = require('sinon');

// Import the API module (here called product-api) and its underlying service
const bonusApi = require('../../src/apis/bonus-api');
const bonusService = require('../../src/services/bonus-service');

describe('Bonus API Integration Tests', () => {
    let req, res, sandbox;

    // Create a sandbox and dummy req/res objects before each test
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            app: {
                get: sandbox.stub().returns({})  // Return an empty mock db object
            }
        };
        res = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        };
    });

    // Restore the sandbox after each test
    afterEach(() => {
        sandbox.restore();
    });

    describe('GET /bonus/spr/:id/:year (getSPRBonus)', () => {

        it('should return SPR bonus for a specific salesman and year', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            const fakeBonus = 1000;
            sandbox.stub(bonusService, 'getSPRBonus').resolves(fakeBonus);

            await bonusApi.getSPRBonus(req, res);

            // Expect HTTP status 200 and the fake bonus returned
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith({ bonus: fakeBonus })).to.be.true;
        });

        it('should return 404 with error message when no SPR bonus is found', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(bonusService, 'getSPRBonus').rejects(new Error());

            await bonusApi.getSPRBonus(req, res);

            // Expect HTTP status 404 and the error message returned
            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });

    describe('GET /bonus/oe/:id/:year (getOEBonus)', () => {
        it('should return OE bonus for a specific salesman and year', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            const fakeBonus = 1500;
            sandbox.stub(bonusService, 'getOEBonus').resolves(fakeBonus);

            await bonusApi.getOEBonus(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith({ bonus: fakeBonus })).to.be.true;
        });

        it('should return 404 with error message when no OE bonus is found', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(bonusService, 'getOEBonus').rejects(new Error());

            await bonusApi.getOEBonus(req, res);

            // Expect HTTP status 404 and the error message returned
            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });

    describe('GET /bonus/:id/:year (getTotalBonus)', () => {
        it('should return total bonus for a specific salesman and year', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            const fakeBonus = 2500;
            sandbox.stub(bonusService, 'getTotalBonus').resolves(fakeBonus);

            await bonusApi.getTotalBonus(req, res);

            // Expect HTTP status 200 and the fake bonus returned
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith({ bonus: fakeBonus })).to.be.true;
        });

        it('should return 404 with error message when no total bonus is found', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(bonusService, 'getTotalBonus').rejects(new Error());

            await bonusApi.getTotalBonus(req, res);

            // Expect HTTP status 404 and the error message returned
            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });
});
