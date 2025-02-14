const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const SalesmanService = require('../../src/services/salesman-service');
const openCRXService = require('../../src/services/open-crx-service');

let hrmService;

describe('orange-hrm-service unit-tests', function () {
    // Stubs for axios methods and SalesmanService functions
    let postStub, getStub;
    let salesmanGetStub, salesmanCreateStub, salesmanGetAllStub;

    // Before each test, clear the cache for Service
    beforeEach(function () {
        // Remove the cached instance
        delete require.cache[require.resolve('../../src/services/orange-hrm-service')];

        postStub = sinon.stub(axios, 'post');
        getStub = sinon.stub(axios, 'get');

        hrmService = require('../../src/services/orange-hrm-service');

        salesmanGetStub = sinon.stub(SalesmanService, 'getSalesman');
        salesmanCreateStub = sinon.stub(SalesmanService, 'createSalesman');
        salesmanGetAllStub = sinon.stub(openCRXService, 'getAllSalesmen');
    });

    afterEach(function () {
        sinon.restore();
    });

    describe('getSalesmen()', function () {
        it('should return only Senior Salesman from the HRM system', async function () {
            // Arrange
            const fakeTokenResponse = {
                data: {
                    expires_in: 3600,
                    access_token: 'fake-token'
                }
            };

            // Simulate the GET call that returns a list of employees
            const fakeEmployeeResponse = {
                data: {
                    data: [
                        { firstName: 'John', lastName: 'Doe', middleName: '', code: '9001', jobTitle: 'Senior Salesman', employeeId: '1' },
                        { firstName: 'Jane', lastName: 'Smith', middleName: '', code: '9002', jobTitle: 'Junior Salesman', employeeId: '2' },
                        { firstName: 'Bob', lastName: 'Brown', middleName: '', code: '9003', jobTitle: 'Senior Salesman', employeeId: '3' }
                    ]
                }
            };

            const fakeCRXEmployeeResponse = [
                { governmentId: '9001' },
                { governmentId: '9002' }
            ];

            // When getSalesmen() makes a GET call to the employee search URL, return fake data.
            getStub.withArgs(
                sinon.match('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search'),
                sinon.match.any
            ).resolves(fakeEmployeeResponse);

            // Stub für openCRXService.getAllSalesmen
            salesmanGetAllStub.resolves(fakeCRXEmployeeResponse);

            postStub.resolves(fakeTokenResponse);

            // Act
            const salesmen = await hrmService.getSalesmen();

            // Assert
            expect(salesmen).to.be.an('array').with.lengthOf(1);
            salesmen.forEach((s) => {
                expect(s.jobTitle).to.equal('Senior Salesman');
            });
        });
    });

    describe('getSalesmanByCode()', function () {
        it('should throw an error if no code is provided', async function () {
            try {
                await hrmService.getSalesmanByCode();
            } catch (err) {
                expect(err).to.be.an('error');
                expect(err.message).to.equal('Code is required!');
            }
        });

        it('should return the salesman with the specified code', async function () {
            // Arrange
            const fakeTokenResponse = {
                data: {
                    expires_in: 3600,
                    access_token: 'fake-token'
                }
            };
            postStub.resolves(fakeTokenResponse);

            // When getSalesmanByCode calls getSalesmen(), simulate the GET response:
            const fakeEmployeeResponse = {
                data: {
                    data: [
                        { firstName: 'John', lastName: 'Doe', middleName: '', code: '9001', jobTitle: 'Senior Salesman', employeeId: '1' },
                        { firstName: 'Bob', lastName: 'Brown', middleName: '', code: '9002', jobTitle: 'Senior Salesman', employeeId: '2' }
                    ]
                }
            };
            getStub.withArgs(
                sinon.match('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search'),
                sinon.match.any
            ).resolves(fakeEmployeeResponse);

            const fakeCRXEmployeeResponse = [
                { governmentId: '9002' }
            ]

            // Stub für openCRXService.getAllSalesmen
            salesmanGetAllStub.resolves(fakeCRXEmployeeResponse);

            // Act
            const salesman = await hrmService.getSalesmanByCode('9002');

            // Assert
            expect(salesman).to.be.an('object');
            expect(salesman.code).to.equal('9002');
            expect(salesman.firstName).to.equal('Bob');
        });
    });

    describe('getSalesmanById()', function () {
        it('should throw an error if no employeeId is provided', async function () {
            try {
                await hrmService.getSalesmanById();
            } catch (err) {
                expect(err).to.be.an('error');
                expect(err.message).to.equal('Employee ID is required!');
            }
        });

        it('should return salesman details for the given employeeId', async function () {
            // Arrange
            const fakeTokenResponse = {
                data: {
                    expires_in: 3600,
                    access_token: 'fake-token'
                }
            };
            postStub.resolves(fakeTokenResponse);

            const fakeEmployeeDetail = {
                data: {
                    data: { firstName: 'Alice', lastName: 'Wonder', middleName: '', code: '9005', jobTitle: 'Senior Salesman', employeeId: '5' }
                }
            };
            getStub.withArgs(
                sinon.match('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/5'),
                sinon.match.any
            ).resolves(fakeEmployeeDetail);

            // Act
            const salesman = await hrmService.getSalesmanById(5);

            // Assert
            expect(salesman).to.be.an('object');
            expect(salesman.employeeId).to.equal('5');
            expect(salesman.firstName).to.equal('Alice');
        });
    });

    describe('createBonusSalary()', function () {
        it('should throw an error if SID or bonus is not provided', async function () {
            try {
                await hrmService.createBonusSalary();
            } catch (err) {
                expect(err).to.be.an('error');
                expect(err.message).to.equal('SID and Bonus are required!');
            }
        });

        it('should create bonus salary and return response data', async function () {
            // Arrange
            const fakeTokenResponse = {
                data: {
                    expires_in: 3600,
                    access_token: 'fake-token'
                }
            };

            // The first axios.post call (for token) returns fake token
            postStub.onCall(0).resolves(fakeTokenResponse);

            // When createBonusSalary calls getSalesmanByCode (which internally calls getSalesmen)
            // simulate the GET response with the desired salesman
            const fakeEmployeeResponse = {
                data: {
                    data: [
                        { firstName: 'Eve', lastName: 'Adams', middleName: '', code: '9010', jobTitle: 'Senior Salesman', employeeId: '9010' }
                    ]
                }
            };
            getStub.withArgs(
                sinon.match('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search'),
                sinon.match.any
            ).resolves(fakeEmployeeResponse);

            // simulate the bonus salary creation POST call.
            const bonusSalaryResponse = { data: { success: true } };
            postStub.withArgs(
                sinon.match(function (url) {
                    return url.includes('/bonussalary');
                }),
                sinon.match.object,
                sinon.match.object
            ).resolves(bonusSalaryResponse);

            const fakeCRXEmployeeResponse = [
                { governmentId: '9010' }
            ]

            // Stub für openCRXService.getAllSalesmen
            salesmanGetAllStub.resolves(fakeCRXEmployeeResponse);

            // Act
            const bonusData = await hrmService.createBonusSalary('9010', { year: '2023', value: '5000' });

            // Assert
            expect(bonusData).to.deep.equal({ success: true });

            // Verify that the payload sent to the bonus salary endpoint is correct.
            const expectedPayload = {
                year: 2023,  // parseInt('2023')
                value: 5000  // parseInt('5000')
            };

            // Find the call for the bonus salary POST by checking the URL.
            const bonusCall = postStub.getCalls().find((call) => call.args[0].includes('/bonussalary'));
            expect(bonusCall, 'Expected a call to the bonus salary endpoint').to.exist;
            expect(bonusCall.args[1]).to.deep.equal(expectedPayload);
        });
    });

    describe('fetchAndStoreSalesmen()', function () {
        it('should fetch salesmen and store new ones in the database', async function () {
            // Arrange
            const fakeTokenResponse = {
                data: {
                    expires_in: 3600,
                    access_token: 'fake-token'
                }
            };
            postStub.resolves(fakeTokenResponse);

            // Simulate getSalesmen (GET) call returning two salesmen.
            const fakeEmployeeResponse = {
                data: {
                    data: [
                        { firstName: 'Tom', lastName: 'Thumb', middleName: '', code: '9000', jobTitle: 'Senior Salesman', employeeId: '100' },
                        { firstName: 'Jerry', lastName: 'Mouse', middleName: '', code: '9001', jobTitle: 'Senior Salesman', employeeId: '101' }
                    ]
                }
            };
            getStub.withArgs(
                sinon.match('https://sepp-hrm.inf.h-brs.de/symfony/web/index.php/api/v1/employee/search'),
                sinon.match.any
            ).resolves(fakeEmployeeResponse);

            // Stub for openCRXService.getAllSalesmen
            const fakeCRXEmployeeResponse = [
                { governmentId: '9000' },
                { governmentId: '9001' }
            ]

            salesmanGetAllStub.resolves(fakeCRXEmployeeResponse);

            // For SalesmanService:
            // Assume that for salesman with sid 9000, getSalesman returns null
            // and for salesman with sid 9001, it returns an object
            salesmanGetStub.withArgs(sinon.match.any, '9000').resolves(null);
            salesmanGetStub.withArgs(sinon.match.any, '9001').resolves({ code: '9001' });
            // Simulate a successful createSalesman call
            salesmanCreateStub.resolves({ created: true });

            const fakeDb = {};

            // Act
            await hrmService.fetchAndStoreSalesmen(fakeDb);

            // Assert
            // Expect that createSalesman is called only for sid 9000
            sinon.assert.calledOnce(salesmanCreateStub);
            sinon.assert.calledWith(salesmanCreateStub, fakeDb, sinon.match.has('sid', '9000'));
        });
    });
});
