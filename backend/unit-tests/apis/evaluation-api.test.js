const { expect } = require('chai');
const sinon = require('sinon');
const evaluationApi = require('../../src/apis/evaluation-api');
const evaluationService = require('../../src/services/evaluation-service');
const EvaluationDTO = require('../../src/dtos/EvaluationDTO');

describe('Evaluation API Integration Test', function() {
    let req, res, sandbox;

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

    afterEach(() => {
        sandbox.restore();
    });

    describe('createEvaluation', function() {
        it('should create an evaluation and return 200', async () => {
            req.params = { id: '123', year: '2025' };

            // Stub the service method to return a resolved promise
            sandbox.stub(evaluationService, 'createEvaluation').resolves();

            await evaluationApi.createEvaluation(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith('Evaluation with sid 123 created!')).to.be.true;
        });

        it('should return 500 if evaluation already exists', async () => {
            req.params = { id: '123', year: '2025' };

            // Stub the service method to reject with an error
            sandbox.stub(evaluationService, 'createEvaluation').rejects(new Error('Evaluation exists'));

            await evaluationApi.createEvaluation(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.send.calledOnceWith('Evaluation with sid 123 and year 2025 already exists!')).to.be.true;
        });
    });

    describe('getAllEvaluations', function() {
        it('should return all evaluations and status 200', async () => {
            req.query = { sid: '123' };

            const fakeEvaluations = [
                { sid: '123', year: '2025', score: 90 },
                { sid: '123', year: '2024', score: 85 }
            ];

            // Stub the service method to return fake evaluations
            sandbox.stub(evaluationService, 'getAllEvaluations').resolves(fakeEvaluations);

            await evaluationApi.getAllEvaluations(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeEvaluations)).to.be.true;
        });

        it('should return 404 if no evaluations found', async () => {
            req.query = { sid: '123' };

            // Stub the service method to return an empty array
            sandbox.stub(evaluationService, 'getAllEvaluations').rejects(new Error);

            await evaluationApi.getAllEvaluations(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });

    describe('getEvaluation', function() {
        it('should return the specific evaluation and status 200', async () => {
            req.params = { id: '123', year: '2025' };

            const fakeEvaluation = { sid: '123', year: '2025', score: 90 };

            // Stub the service method to return a fake evaluation
            sandbox.stub(evaluationService, 'getEvaluation').resolves(fakeEvaluation);

            await evaluationApi.getEvaluation(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith(fakeEvaluation)).to.be.true;
        });

        it('should return 404 if evaluation not found', async () => {
            req.params = { id: '123', year: '2025' };

            // Stub the service method to return null or reject
            sandbox.stub(evaluationService, 'getEvaluation').resolves(null);

            await evaluationApi.getEvaluation(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.send.calledOnceWith('No Evaluation with 123 and 2025 found!')).to.be.true;
        });
    });

    describe('updateEvaluation', function() {
        it('should update the evaluation and return status 200', async () => {
            req.body = {
                sid: 0,
                year: 0,
                department:0 ,
                orderEvaluation: {totalBonus:  {}, orders: []},
                socialPerformanceEvaluation: {specifiedRecords: []},
                approvalStatus: 0,
                comment: ""
            }

            // Stub the service method to return a resolved promise
            sandbox.stub(evaluationService, 'updateEvaluation').resolves();

            await evaluationApi.updateEvaluation(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
            expect(res.send.calledOnceWith('Evaluation updated!')).to.be.true;
        });

        it('should return 500 if the evaluation could not be updated', async () => {
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
            sandbox.stub(evaluationService, 'updateEvaluation').rejects(new Error('Update failed'));

            await evaluationApi.updateEvaluation(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
            expect(res.send.calledOnceWith('Evaluation could not be updated!')).to.be.true;
        });
    });
});
