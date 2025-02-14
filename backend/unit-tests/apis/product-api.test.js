const { expect } = require('chai');
const sinon = require('sinon');

// Import the API module (here called product-api) and its underlying service
const productApi = require('../../src/apis/product-api');
const openCRXService = require('../../src/services/open-crx-service');

describe('Product API Integration Tests', () => {
    let req, res, sandbox;

    // Create a sandbox and dummy req/res objects before each test
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = { query: {} };
        res = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        };
    });

    // Restore the sandbox after each test
    afterEach(() => {
        sandbox.restore();
    });

    describe('GET /sales (getAllSales)', () => {
        it('should return sales from openCRXService.getSales when salesman is provided', async () => {
            // Set query parameters so that salesman is provided
            req.query.salesman = '90123';
            req.query.year = '2023';

            const fakeSales = [
                { id: 1, item: 'Sale1' },
                { id: 2, item: 'Sale2' }
            ];
            // Stub openCRXService.getSales to return fakeSales
            sandbox.stub(openCRXService, 'getSales').resolves(fakeSales);

            await productApi.getAllSales(req, res);

            // Expect HTTP status 200 and the fake sales returned
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeSales)).to.be.true;
        });

        it('should return sales from openCRXService.getAllSales when salesman is not provided', async () => {
            const fakeSales = [
                { id: 3, item: 'Sale3' }
            ];
            // Stub openCRXService.getAllSales to return fakeSales
            sandbox.stub(openCRXService, 'getAllSales').resolves(fakeSales);

            await productApi.getAllSales(req, res);

            // Expect HTTP status 200 and the fake sales returned
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeSales)).to.be.true;
        });

        it('should return 404 with error message when openCRXService.getSales rejects', async () => {
            req.query.salesman = '90123';
            req.query.year = '2023';

            // Stub openCRXService.getSales to reject with an error
            sandbox.stub(openCRXService, 'getSales').rejects(new Error());

            await productApi.getAllSales(req, res);

            // Expect HTTP status 404 and the error message returned in a JSON object
            expect(res.status.calledOnceWith(404)).to.be.true;
        });

        it('should return 404 with error message when openCRXService.getAllSales rejects', async () => {
            const errorMessage = 'No sales found';
            // Stub openCRXService.getAllSales to reject with an error
            sandbox.stub(openCRXService, 'getAllSales').rejects(new Error());

            await productApi.getAllSales(req, res);

            // Expect HTTP status 404 and the error message in the response
            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });

    describe('GET /salesmen (getAllSalesmen)', () => {
        it('should return all salesmen from openCRXService.getAllSalesmen', async () => {
            const fakeSalesmen = [
                { id: 1, name: 'Salesman1' },
                { id: 2, name: 'Salesman2' }
            ];
            // Stub openCRXService.getAllSalesmen to return fakeSalesmen
            sandbox.stub(openCRXService, 'getAllSalesmen').resolves(fakeSalesmen);

            await productApi.getAllSalesmen(req, res);

            // Expect HTTP status 200 and the list of salesmen returned
            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeSalesmen)).to.be.true;
        });

        it('should return 404 with error message when openCRXService.getAllSalesmen rejects', async () => {
            const errorMessage = 'No salesmen found';
            // Stub openCRXService.getAllSalesmen to reject with an error
            sandbox.stub(openCRXService, 'getAllSalesmen').rejects(new Error(errorMessage));

            await productApi.getAllSalesmen(req, res);

            // Expect HTTP status 404 and the error message returned
            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.send.calledOnceWith({ error: errorMessage })).to.be.true;
        });
    });
});
