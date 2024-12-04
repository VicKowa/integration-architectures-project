const chai = require('chai');
const expect = chai.expect;
chai.use(require("chai-exclude"));
chai.use(require('chai-as-promised'));
const {initMockedMongoDB, resetMockedMongoDB, closeMockedMongoDB} = require("../support/mongodb-mocking");

const salesmanService= require('../../src/services/salesman-service');
const bonusService = require('../../src/services/bonus-service');

Salesman = require("../../src/models/salesman/Salesman");
SocialPerformanceRecord = require("../../src/models/salesman/SocialPerformanceRecord");

const demoSalesman = new Salesman("John", "Doe", "0", [new SocialPerformanceRecord("2021", "0", "Dep1", {
    leadershipCompetence: {targetValue: 5, actualValue: 5, bonus: 10},
    opennessToEmployee: {targetValue: 7, actualValue: 10, bonus: 12},
    socialBehaviorToEmployee: {targetValue: 8, actualValue: 2, bonus: 5},
    attitudeToClients: {targetValue: 6, actualValue: 5, bonus: 8},
    communicationSkills: {targetValue: 12, actualValue: 9, bonus: 15},
    integrityToCompany: {targetValue: 10, actualValue: 10, bonus: 10}
})]);

let db;

describe('bonus-service unit-tests', function () {

    before(async function (){
        db = await initMockedMongoDB();
    });
    afterEach(function (){
        resetMockedMongoDB(db);
    });
    after(function (){
        closeMockedMongoDB(db);
    });

    describe('get SPR Bonus tests', function () {
        it('expect correct bonus to be returned', async function () {
            await salesmanService.createSalesman(db, demoSalesman);

            const totalBonus = await bonusService.getSPRBonus(db, demoSalesman.sid, demoSalesman.socialPerformanceRecords[0].year);
            await expect(totalBonus).to.be.greaterThanOrEqual(0);
        });
    });

    //TODO: Mock open crx web service
    describe('get OE bonus tests', function () {
        it('expect correct bonus to be returned', async function () {
            const totalBonus = await bonusService.getOEBonus("90123");
            await expect(totalBonus).to.be.greaterThanOrEqual(0);
        });
    });

    describe('get Total Bonus tests', function () {
        it('expect correct bonus to be returned', async function () {
            await salesmanService.createSalesman(db, demoSalesman);

            const totalBonus = await bonusService.getTotalBonus(db, demoSalesman.sid, demoSalesman.socialPerformanceRecords[0].year);
            await expect(totalBonus).to.be.greaterThanOrEqual(0);
        });
    });
});
