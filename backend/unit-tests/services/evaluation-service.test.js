const { expect } = require('chai');
const sinon = require('sinon');

const evaluationService = require('../../src/services/evaluation-service');
const OpenCRXService = require('../../src/services/open-crx-service');
const SocialPerformanceRecordDTO = require('../../src/dtos/SocialPerformanceRecordDTO.js');
const Evaluation = require('../../src/models/Evaluation.js');
const bonusService = require('../../src/services/bonus-service');
const environment = require('../../environments/environment.js');

describe('evaluation-service unit-tests', function () {
    let fakeDb, fakeCollection;
    // Set up fake db and collection before each test
    beforeEach(function () {
        fakeCollection = {
            insertOne: sinon.stub(),
            find: sinon.stub(),
            findOne: sinon.stub(),
            updateOne: sinon.stub(),
            deleteOne: sinon.stub()
        };
        fakeDb = { collection: sinon.stub().returns(fakeCollection) };
    });
    afterEach(function () {
        sinon.restore();
    });

    describe('createEvaluation', function () {
        it('should throw error if sid or year is missing', async function () {
            try {
                await evaluationService.createEvaluation(fakeDb, null, '2023');
            } catch (err) {
                expect(err.message).to.equal("Evaluation must have a sid and year");
            }
        });

        it('should throw error if evaluation already exists', async function () {
            sinon.stub(evaluationService, 'getEvaluation').resolves({ sid: '90123', year: '2023' });
            try {
                await evaluationService.createEvaluation(fakeDb, '90123', '2023');
            } catch (err) {
                expect(err.message).to.equal('Evaluation already exists!');
            }
        });

        it('should create a new evaluation successfully', async function () {
            sinon.stub(evaluationService, 'getEvaluation').resolves(null);
            const fakeSalesOrders = [
                {
                    orders: [
                        {
                            crx_product: { productNumber: 'P001', name: 'ProductA' },
                            quantity: 10
                        }
                    ],
                    priority: '4'
                }
            ];
            const fakeSPR = { totalBonus: 50, specifiedRecords: {} };

            // Stub OpenCRXService
            sinon.stub(OpenCRXService, 'getSales').resolves(fakeSalesOrders);
            sinon.stub(SocialPerformanceRecordDTO, 'createRecordWithRandomActualValues').returns(fakeSPR);
            sinon.stub(bonusService, 'calculateAllBonuses').callsFake(evaluation => evaluation);

            fakeCollection.insertOne.resolves({ insertedId: '12345' });

            const result = await evaluationService.createEvaluation(fakeDb, '90123', '2023');

            sinon.assert.calledOnce(fakeCollection.insertOne);

            const insertedArg = fakeCollection.insertOne.firstCall.args[0];

            expect(insertedArg).to.be.instanceOf(Evaluation);
            expect(insertedArg.sid).to.equal('90123');
            expect(insertedArg.year).to.equal('2023');
            expect(insertedArg.department).to.equal("Sales");
            expect(insertedArg.approvalStatus).to.equal(environment.default.approvalEnum.NONE);
            expect(result).to.deep.equal({ insertedId: '12345' });
        });
    });

    describe('getAllEvaluations', function () {
        it('should filter query and return evaluations array', async function () {
            const query = { sid: '90123', invalidKey: 'value', year: '2023', approvalStatus: 0 };
            const expectedQuery = { sid: '90123', year: '2023', approvalStatus: 0 };
            const fakeEvaluations = [{ sid: '90123', year: '2023' }];

            fakeCollection.find.returns({ toArray: sinon.stub().resolves(fakeEvaluations) });

            const evaluations = await evaluationService.getAllEvaluations(fakeDb, query);

            expect(evaluations).to.deep.equal(fakeEvaluations);
            sinon.assert.calledWith(fakeDb.collection, 'eval');
            sinon.assert.calledWith(fakeCollection.find, expectedQuery);
        });
    });

    describe('getEvaluation', function () {
        it('should return evaluation by sid and year', async function () {
            const fakeEvaluation = { sid: '90123', year: '2023' };
            fakeCollection.findOne.resolves(fakeEvaluation);

            const evaluation = await evaluationService.getEvaluation(fakeDb, '90123', '2023');

            expect(evaluation).to.deep.equal(fakeEvaluation);
            sinon.assert.calledWith(fakeDb.collection, 'eval');
            sinon.assert.calledWith(fakeCollection.findOne, { sid: '90123', year: '2023' });
        });
    });

    describe('updateEvaluation', function () {
        it('should throw error if evaluation is missing or has no sid', async function () {
            try {
                await evaluationService.updateEvaluation(fakeDb, null);
            } catch (err) {
                expect(err.message).to.equal('Evaluation not found!');
            }
        });

        it('should update evaluation without _id property', async function () {
            const orders = [
                { clientRanking: 1, bonus: 20 },
                { clientRanking: 1, bonus: 20 },
                { clientRanking: 1, bonus: 20 },
                { clientRanking: 1, bonus: 20 },
                { clientRanking: 1, bonus: 20 }
            ];
            const orderEvalData = { totalBonus: 100, orders };

            const specifiedRecordsData = {
                'leadershipCompetence': { targetValue: 0, actualValue: 0, bonus: 0 },
                'opennessToEmployee': { targetValue: 0, actualValue: 0, bonus: 0 },
                'socialBehaviorToEmployee': { targetValue: 0, actualValue: 0, bonus: 0 },
                'attitudeToClients': { targetValue: 0, actualValue: 0, bonus: 0 },
                'communicationSkills': { targetValue: 0, actualValue: 0, bonus: 0 },
                'integrityToCompany': { targetValue: 0, actualValue: 0, bonus: 0 }
            }
            const sprData = { totalBonus: 20, specifiedRecords:  specifiedRecordsData };

            const evalData = {
                _id: 'id123',
                sid: '90123',
                year: '2023',
                comment: 'old comment',
                totalBonus: 120,
                orderEvaluation: orderEvalData,
                socialPerformanceEvaluation: sprData
            };
            fakeCollection.updateOne.resolves({ modifiedCount: 1 });

            const result = await evaluationService.updateEvaluation(fakeDb, evalData);

            expect(result).to.deep.equal({ modifiedCount: 1 });
            sinon.assert.calledWith(fakeDb.collection, 'eval');

            const updateArg = fakeCollection.updateOne.firstCall.args[1];
            expect(updateArg).to.have.property('$set');
            expect(updateArg.$set).to.not.have.property('_id');
            expect(updateArg.$set.comment).to.equal('old comment');
        });
    });

    describe('deleteEvaluation', function () {
        it('should delete evaluation by sid and year', async function () {
            fakeCollection.deleteOne.resolves({ deletedCount: 1 });

            const result = await evaluationService.deleteEvaluation(fakeDb, '90123', '2023');

            expect(result).to.deep.equal({ deletedCount: 1 });
            sinon.assert.calledWith(fakeDb.collection, 'eval');
            sinon.assert.calledWith(fakeCollection.deleteOne, { sid: '90123', year: '2023' });
        });
    });

    describe('getOrderEvaluation', function () {
        it('should throw error if evaluation is not found', async function () {
            sinon.stub(evaluationService, 'getEvaluation').resolves(null);
            try {
                await evaluationService.getOrderEvaluation(fakeDb, '90123', '2023');
            } catch (err) {
                expect(err.message).to.equal('Evaluation with sid 90123 and 2023 not found!');
            }
        });

        it('should return order evaluation from evaluation', async function () {
            const fakeEvaluation = { sid: '90123', year: '2023', orderEvaluation: { totalBonus: 100 } };
            sinon.stub(evaluationService, 'getEvaluation').resolves(fakeEvaluation);

            const orderEvaluation = await evaluationService.getOrderEvaluation(fakeDb, '90123', '2023');

            expect(orderEvaluation).to.deep.equal(fakeEvaluation.orderEvaluation);
        });
    });

    describe('updateOrderEvaluation', function () {
        it('should throw error if evaluation is not found', async function () {
            sinon.stub(evaluationService, 'getEvaluation').resolves(null);
            try {
                await evaluationService.updateOrderEvaluation(fakeDb, '90123', '2023', { totalBonus: 150 });
            } catch (err) {
                expect(err.message).to.equal('Evaluation with sid 90123 and 2023 not found!');
            }
        });

        it('should update order evaluation and call updateEvaluation', async function () {
            const fakeEvaluation = { sid: '90123', year: '2023', orderEvaluation: { totalBonus: 100 } };
            const getEvalStub = sinon.stub(evaluationService, 'getEvaluation').resolves(fakeEvaluation);
            const updateEvalStub = sinon.stub(evaluationService, 'updateEvaluation').resolves({ modifiedCount: 1 });
            const newOE = { totalBonus: 150 };

            await evaluationService.updateOrderEvaluation(fakeDb, '90123', '2023', newOE);

            expect(fakeEvaluation.orderEvaluation).to.deep.equal(newOE);
            sinon.assert.calledOnce(getEvalStub);
            sinon.assert.calledOnce(updateEvalStub);
            sinon.assert.calledWith(updateEvalStub, fakeDb, fakeEvaluation);
        });
    });

    describe('getSocialPerformanceRecord', function () {
        it('should throw error if evaluation is not found', async function () {
            sinon.stub(evaluationService, 'getEvaluation').resolves(null);
            try {
                await evaluationService.getSocialPerformanceRecord(fakeDb, '90123', '2023');
            } catch (err) {
                expect(err.message).to.equal('Evaluation with sid 90123 and 2023 not found!');
            }
        });

        it('should return social performance evaluation from evaluation', async function () {
            const fakeEvaluation = { sid: '90123', year: '2023', socialPerformanceEvaluation: { totalBonus: 80 } };
            sinon.stub(evaluationService, 'getEvaluation').resolves(fakeEvaluation);

            const spr = await evaluationService.getSocialPerformanceRecord(fakeDb, '90123', '2023');

            expect(spr).to.deep.equal(fakeEvaluation.socialPerformanceEvaluation);
        });
    });

    describe('updateSocialPerformanceRecord', function () {
        it('should throw error if evaluation is not found', async function () {
            sinon.stub(evaluationService, 'getEvaluation').resolves(null);
            try {
                await evaluationService.updateSocialPerformanceRecord(fakeDb, '90123', '2023', { totalBonus: 90 });
            } catch (err) {
                expect(err.message).to.equal('Evaluation with sid 90123 and 2023 not found!');
            }
        });

        it('should update social performance record and call updateEvaluation', async function () {
            const fakeEvaluation = { sid: '90123', year: '2023', socialPerformanceEvaluation: { totalBonus: 80 } };
            const getEvalStub = sinon.stub(evaluationService, 'getEvaluation').resolves(fakeEvaluation);
            const updateEvalStub = sinon.stub(evaluationService, 'updateEvaluation').resolves({ modifiedCount: 1 });
            const newSPR = { totalBonus: 95 };

            await evaluationService.updateSocialPerformanceRecord(fakeDb, '90123', '2023', newSPR);

            expect(fakeEvaluation.socialPerformanceEvaluation).to.deep.equal(newSPR);
            sinon.assert.calledOnce(getEvalStub);
            sinon.assert.calledOnce(updateEvalStub);
            sinon.assert.calledWith(updateEvalStub, fakeDb, fakeEvaluation);
        });
    });
});
