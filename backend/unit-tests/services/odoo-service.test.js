const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Odoo Service Integration Tests', function() {
    // stub functions used by the fake Odoo class.
    let connectStub, executeKwStub, OdooStub, odooService;

    // Before each test we define our stubs and use proxyquire to inject our fake Odoo.
    beforeEach(function() {
        // Stub for the "connect" method; always resolves.
        connectStub = sinon.stub().resolves();
        // Stub for the "execute_kw" method; you can control its return value per test.
        executeKwStub = sinon.stub().resolves([]);

        // Our fake Odoo class that will be used instead of the real one.
        OdooStub = function(config) {
            // Optionally store config for inspection:
            this.config = config;
            // Assign our stubs as instance methods.
            this.connect = connectStub;
            this.execute_kw = executeKwStub;
        };

        // Use proxyquire to load the odoo service module and replace 'async-odoo-xmlrpc' with our fake Odoo class.
        odooService = proxyquire('../../src/services/odoo-service', {
            'async-odoo-xmlrpc': OdooStub
        });
    });

    // After each test, restore sinon state.
    afterEach(function() {
        sinon.restore();
    });

    describe('getAllSalesman()', function() {
        it('should return an array of salesman DTOs', async function() {
            // Arrange
            const fakeSalesmen = [
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Doe' }
            ];
            // When
            executeKwStub.resolves(fakeSalesmen);

            // Act
            const salesmen = await odooService.getAllSalesman();

            // Assert
            expect(salesmen).to.be.an('array').with.lengthOf(2);
            expect(salesmen[0]).to.have.property('id', 1);
            expect(salesmen[0]).to.have.property('name', 'John Doe');
        });
    });

    describe('getSalesman()', function() {
        it('should return a salesman DTO given a valid id', async function() {
            // Arrange
            const fakeSalesman = [{ id: 1, name: 'John Doe' }];
            executeKwStub.resolves(fakeSalesman);

            // Act
            const salesman = await odooService.getSalesman(1);

            // Assert
            expect(salesman).to.be.an('object');
            expect(salesman).to.have.property('id', 1);
            expect(salesman).to.have.property('name', 'John Doe');
        });

        it('should throw an error if no id is provided', async function() {
            // Act & Assert
            try {
                await odooService.getSalesman();
            } catch (err) {
                expect(err).to.be.an('error');
                expect(err.message).to.equal('No ID given!');
            }
        });
    });

    describe('getEveryBonus()', function() {
        it('should return an array of bonus DTOs', async function() {
            // Arrange
            const fakeBonuses = [
                { id: 1, state: 'approved', employee_id: 1, bonus_reason_id: 10, bonus_amount: 1000 },
                { id: 2, state: 'pending', employee_id: 2, bonus_reason_id: 20, bonus_amount: 1500 }
            ];
            executeKwStub.resolves(fakeBonuses);

            // Act
            const bonuses = await odooService.getEveryBonus();

            // Assert
            expect(bonuses).to.be.an('array').with.lengthOf(2);
            expect(bonuses[0]).to.have.property('id', 1);
            expect(bonuses[0]).to.have.property('state', 'approved');
        });
    });

    describe('getBonus()', function() {
        it('should return a bonus DTO given a valid id', async function() {
            // Arrange
            const fakeBonus = [
                { id: 1, state: 'approved', employee_id: 1, bonus_reason_id: 10, bonus_amount: 1000 }
            ];
            executeKwStub.resolves(fakeBonus);

            // Act
            const bonus = await odooService.getBonus(1);

            // Assert
            expect(bonus).to.be.an('object');
            expect(bonus).to.have.property('id', 1);
            expect(bonus).to.have.property('state', 'approved');
        });

        it('should throw an error if no id is provided', async function() {
            // Act & Assert
            try {
                await odooService.getBonus();
            } catch (err) {
                expect(err).to.be.an('error');
                expect(err.message).to.equal('No ID given!');
            }
        });
    });

    describe('getBonusForSalesman()', function() {
        it('should return bonus DTOs for a given salesman', async function() {
            // Arrange:
            // The function first calls getSalesman (which internally calls execute_kw) then
            // fetches bonus requests
            executeKwStub.onCall(0).resolves([{ id: 1, name: 'John Doe' }]); // For hr.employee (getSalesman)
            executeKwStub.onCall(1).resolves([
                { id: 10, state: 'approved', employee_id: 1, bonus_reason_id: 20, bonus_amount: 1000 }
            ]); // For bonus.request

            // Act
            const bonuses = await odooService.getBonusForSalesman(1);

            // Assert
            expect(bonuses).to.be.an('array').with.lengthOf(1);
            expect(bonuses[0]).to.have.property('id', 10);
            expect(bonuses[0]).to.have.property('state', 'approved');
        });

        it('should throw an error if no id is provided', async function() {
            try {
                await odooService.getBonusForSalesman();
            } catch (err) {
                expect(err).to.be.an('error');
                expect(err.message).to.equal('No ID given!');
            }
        });

        it('should throw an error if salesman is not found', async function() {
            // Arrange
            executeKwStub.resolves([]); // getSalesman will get no results

            try {
                await odooService.getBonusForSalesman(999);
            } catch (err) {
                expect(err).to.be.an('error');
                expect(err.message).to.equal('Salesman not found!');
            }
        });
    });
});
