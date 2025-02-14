const { expect } = require('chai');
const sinon = require('sinon');
const salesmanApi = require('../../src/apis/salesman-api');
const salesmanService = require('../../src/services/salesman-service');
const Salesman = require('../../src/models/Salesman');

describe('Salesman API Integration Tests', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            body: {},
            app: {
                get: sandbox.stub().returns({}) // Mock db
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

    describe('GET /salesman (getAllSalesman)', () => {
        it('should return all salesmen', async () => {
            const fakeSalesmen = [{ sid: '123', name: 'John Doe' }, { sid: '456', name: 'Jane Smith' }];
            sandbox.stub(salesmanService, 'getAllSalesman').resolves(fakeSalesmen);

            await salesmanApi.getAllSalesman(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeSalesmen)).to.be.true;
        });

        it('should return 404 if no salesmen found', async () => {
            sandbox.stub(salesmanService, 'getAllSalesman').rejects(new Error());

            await salesmanApi.getAllSalesman(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });

    describe('GET /salesman/:id (getSalesman)', () => {
        it('should return a specific salesman by sid', async () => {
            req.params.id = '123';
            const fakeSalesman = { sid: '123', name: 'John Doe' };
            sandbox.stub(salesmanService, 'getSalesman').resolves(fakeSalesman);

            await salesmanApi.getSalesman(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith({ sid: '123', name: 'John Doe' })).to.be.true;
        });

        it('should return 404 if salesman is not found', async () => {
            req.params.id = '999';
            sandbox.stub(salesmanService, 'getSalesman').rejects(new Error);

            await salesmanApi.getSalesman(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });

    describe('POST /salesman (createSalesman)', () => {
        it('should create a new salesman', async () => {
            req.body = { sid: '123', name: 'John Doe' };
            const fakeSalesman = Salesman.fromJSON(req.body);
            sandbox.stub(salesmanService, 'getSalesman').resolves(null); // Simulate no existing salesman
            sandbox.stub(salesmanService, 'createSalesman').resolves();

            await salesmanApi.createSalesman(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith('Salesman with sid 123 created!')).to.be.true;
        });

        it('should return 500 if the salesman already exists', async () => {
            req.body = { sid: '123', name: 'John Doe' };
            sandbox.stub(salesmanService, 'getSalesman').rejects(new Error); // Simulate existing salesman

            await salesmanApi.createSalesman(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });

    describe('DELETE /salesman/:id (deleteSalesman)', () => {
        it('should delete a salesman successfully', async () => {
            req.params.id = '123';
            sandbox.stub(salesmanService, 'deleteSalesman').resolves();

            await salesmanApi.deleteSalesman(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith('Salesman deleted!')).to.be.true;
        });

        it('should return 500 if deletion fails', async () => {
            req.params.id = '123';
            sandbox.stub(salesmanService, 'deleteSalesman').rejects(new Error());

            await salesmanApi.deleteSalesman(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });

    describe('PUT /salesman (updateSalesman)', () => {
        it('should update a salesman successfully', async () => {
            req.body = { sid: '123', name: 'John Doe Updated' };
            const fakeSalesman = Salesman.fromJSON(req.body);
            sandbox.stub(salesmanService, 'updateSalesman').resolves();

            await salesmanApi.updateSalesman(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith('Salesman updated!')).to.be.true;
        });

        it('should return 500 if update fails', async () => {
            req.body = { sid: '123', name: 'John Doe Updated' };
            sandbox.stub(salesmanService, 'updateSalesman').rejects(new Error());

            await salesmanApi.updateSalesman(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });
});
