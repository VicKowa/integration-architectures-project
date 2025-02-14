const { expect } = require('chai');
const sinon = require('sinon');
const evaluationApi = require('../../src/apis/evaluation-api');
const evaluationService = require('../../src/services/evaluation-service');
const EvaluationDTO = require('../../src/dtos/EvaluationDTO');
const OrderEvaluationDTO = require('../../src/dtos/OrderEvaluationDTO');
const SocialPerformanceRecordDTO = require('../../src/dtos/SocialPerformanceRecordDTO');

describe('Evaluation API Integration Tests', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            params: {},
            body: {},
            app: {
                get: sandbox.stub().returns({}) // Mocking the database object
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

    describe('POST /eval/:id/:year (createEvaluation)', () => {
        it('should create an evaluation successfully', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(evaluationService, 'createEvaluation').resolves();

            await evaluationApi.createEvaluation(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
        });

        it('should return 500 if evaluation already exists', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(evaluationService, 'createEvaluation').rejects(new Error());

            await evaluationApi.createEvaluation(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });

    describe('GET /eval/:id/:year (getEvaluation)', () => {
        it('should return the correct evaluation', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            const fakeEvaluation = { sid: '12345', year: '2023', score: 85 };
            sandbox.stub(evaluationService, 'getEvaluation').resolves(fakeEvaluation);

            await evaluationApi.getEvaluation(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
        });

        it('should return 404 if no evaluation is found', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(evaluationService, 'getEvaluation').rejects(new Error());

            await evaluationApi.getEvaluation(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });

    describe('GET /eval/oe/:id/:year (getOrderEvaluation)', () => {
        it('should return the correct order evaluation', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            const fakeOrderEvaluation = { sid: '12345', year: '2023', score: 90 };
            sandbox.stub(evaluationService, 'getOrderEvaluation').resolves(fakeOrderEvaluation);

            await evaluationApi.getOrderEvaluation(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
        });

        it('should return 404 if no order evaluation is found', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(evaluationService, 'getOrderEvaluation').rejects(new Error());

            await evaluationApi.getOrderEvaluation(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
            expect(res.send.calledOnceWith('No OrderEvaluation with 12345 and 2023 found!')).to.be.true;
        });
    });

    describe('GET /eval/spr/:id/:year (getSocialPerformanceRecord)', () => {
        it('should return the correct social performance record', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            const fakeSocialPerformanceRecord = { sid: '12345', year: '2023', performanceScore: 80 };
            sandbox.stub(evaluationService, 'getSocialPerformanceRecord').resolves(fakeSocialPerformanceRecord);

            await evaluationApi.getSocialPerformanceRecord(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
        });

        it('should return 404 if no social performance record is found', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(evaluationService, 'getSocialPerformanceRecord').rejects();

            await evaluationApi.getSocialPerformanceRecord(req, res);

            expect(res.status.calledOnceWith(404)).to.be.true;
        });
    });

    describe('PUT /eval/oe/:id/:year (updateOrderEvaluation)', () => {
        it('should update the order evaluation successfully', async () => {
            req.params.id = '12345';
            req.params.year = '2023';
            req.body =  {
                totalBonus: 0,
                orders: []
            }

            sandbox.stub(evaluationService, 'updateOrderEvaluation').resolves();

            await evaluationApi.updateOrderEvaluation(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
        });

        it('should return 500 if update fails', async () => {
            req.params.id = '12345';
            req.params.year = '2023';
            req.body =  {
                totalBonus: 0,
                orders: []
            }

            sandbox.stub(evaluationService, 'updateOrderEvaluation').rejects(new Error());

            await evaluationApi.updateOrderEvaluation(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });

    describe('PUT /eval/spr/:id/:year (updateSocialPerformanceRecord)', () => {
        it('should update the social performance record successfully', async () => {
            req.params.id = '12345';
            req.params.year = '2023';
            req.body = new SocialPerformanceRecordDTO({ sid: '12345', year: '2023', performanceScore: 80 });

            sandbox.stub(evaluationService, 'updateSocialPerformanceRecord').resolves();

            await evaluationApi.updateSocialPerformanceRecord(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
        });

        it('should return 500 if update fails', async () => {
            req.params.id = '12345';
            req.params.year = '2023';
            const sprDto =
            req.body = new SocialPerformanceRecordDTO({ sid: '12345', year: '2023', performanceScore: 80 });

            sandbox.stub(evaluationService, 'updateSocialPerformanceRecord').rejects(new Error());

            await evaluationApi.updateSocialPerformanceRecord(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });

    describe('DELETE /eval/:id/:year (deleteEvaluation)', () => {
        it('should delete the evaluation successfully', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(evaluationService, 'deleteEvaluation').resolves();

            await evaluationApi.deleteEvaluation(req, res);

            expect(res.status.calledOnceWith(200)).to.be.true;
        });

        it('should return 500 if deletion fails', async () => {
            req.params.id = '12345';
            req.params.year = '2023';

            sandbox.stub(evaluationService, 'deleteEvaluation').rejects(new Error());

            await evaluationApi.deleteEvaluation(req, res);

            expect(res.status.calledOnceWith(500)).to.be.true;
        });
    });
});
