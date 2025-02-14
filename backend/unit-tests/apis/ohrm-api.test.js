const { expect } = require('chai');
const sinon = require('sinon');
const ohrmApi = require('../../src/apis/ohrm-api');
const ohrmService = require('../../src/services/orange-hrm-service');
const evaluationService = require('../../src/services/evaluation-service');

describe('OHRM API Tests', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            app: {
                get: sandbox.stub().returns({}) // Mock database if needed
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

    describe('GET /salesmanohrm (getAllSalesmanOHRM)', () => {
        it('should return all salesmen', async () => {
            const fakeSalesmen = [{ sid: '12345', name: 'John Doe' }, { sid: '67890', name: 'Jane Doe' }];
            sandbox.stub(ohrmService, 'getSalesmen').resolves(fakeSalesmen);

            await ohrmApi.getAllSalesmanOHRM(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeSalesmen)).to.be.true;
        });

        it('should return 500 if no salesmen are found', async () => {
            sandbox.stub(ohrmService, 'getSalesmen').rejects(new Error());

            await ohrmApi.getAllSalesmanOHRM(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.send.calledOnceWith('Salesman not found!')).to.be.true;
        });
    });

    describe('GET /salesmanohrm/:id (getSalesmanOHRM)', () => {
        it('should return a specific salesman by sid', async () => {
            req.params.id = '12345';

            const fakeSalesman = { sid: '12345', name: 'John Doe' };
            sandbox.stub(ohrmService, 'getSalesmanByCode').resolves(fakeSalesman);

            await ohrmApi.getSalesmanOHRM(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeSalesman)).to.be.true;
        });

        it('should return 404 if no salesman is found', async () => {
            req.params.id = '12345';

            sandbox.stub(ohrmService, 'getSalesmanByCode').rejects(new Error());

            await ohrmApi.getSalesmanOHRM(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.send.calledOnceWith('No Salesman with 12345 found!')).to.be.true;
        });
    });
});
