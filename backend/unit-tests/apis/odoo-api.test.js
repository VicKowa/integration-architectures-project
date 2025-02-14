const { expect } = require('chai');
const sinon = require('sinon');
const odooApi = require('../../src/apis/odoo-api');
const odooService = require('../../src/services/odoo-service');

describe('Odoo API Tests', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {}
        };
        res = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('GET /odoo/salesman (getAllSalesman)', () => {
        it('should return all salesmen', async () => {
            const fakeSalesmen = [{ sid: '12345', name: 'John Doe' }, { sid: '67890', name: 'Jane Doe' }];
            sandbox.stub(odooService, 'getAllSalesman').resolves(fakeSalesmen);

            await odooApi.getAllSalesman(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeSalesmen)).to.be.true;
        });

        it('should return 500 if salesmen fetch fails', async () => {
            sandbox.stub(odooService, 'getAllSalesman').rejects(new Error());

            await odooApi.getAllSalesman(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });

    describe('GET /odoo/salesman/:id (getSalesman)', () => {
        it('should return a specific salesman by id', async () => {
            req.params.id = '12345';

            const fakeSalesman = { sid: '12345', name: 'John Doe' };
            sandbox.stub(odooService, 'getSalesman').resolves(fakeSalesman);

            await odooApi.getSalesman(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeSalesman)).to.be.true;
        });

        it('should return 500 if salesman fetch fails', async () => {
            req.params.id = '12345';

            sandbox.stub(odooService, 'getSalesman').rejects(new Error());

            await odooApi.getSalesman(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });

    describe('GET /odoo/bonus (getAllBonuses)', () => {
        it('should return all bonuses', async () => {
            const fakeBonuses = [{ sid: '12345', bonus: 1000 }, { sid: '67890', bonus: 1500 }];
            sandbox.stub(odooService, 'getEveryBonus').resolves(fakeBonuses);

            await odooApi.getAllBonuses(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeBonuses)).to.be.true;
        });

        it('should return 500 if bonuses fetch fails', async () => {
            sandbox.stub(odooService, 'getEveryBonus').rejects(new Error());

            await odooApi.getAllBonuses(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });

    describe('GET /odoo/bonus/:id (getBonus)', () => {
        it('should return bonus for a specific salesman by id', async () => {
            req.params.id = '12345';

            const fakeBonus = { sid: '12345', bonus: 1000 };
            sandbox.stub(odooService, 'getBonusForSalesman').resolves(fakeBonus);

            await odooApi.getBonus(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeBonus)).to.be.true;
        });

        it('should return 500 if bonus fetch fails', async () => {
            req.params.id = '12345';

            sandbox.stub(odooService, 'getBonusForSalesman').rejects(new Error());

            await odooApi.getBonus(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });
});
