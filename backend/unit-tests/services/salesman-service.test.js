const { expect } = require('chai');
const sinon = require('sinon');
const SalesmanService = require('../../src/services/salesman-service');

describe('salesman-service unit-tests', function () {
    let dbMock, collectionMock;

    beforeEach(function () {
        collectionMock = {
            find: sinon.stub().returns({
                toArray: sinon.stub().resolves([
                    { sid: '123', name: 'John Doe' },
                    { sid: '456', name: 'Jane Doe' }
                ])
            }),
            findOne: sinon.stub().resolves({ sid: '123', name: 'John Doe' }),
            insertOne: sinon.stub().resolves({ insertedId: 'mockId' }),
            deleteOne: sinon.stub().resolves({ deletedCount: 1 }),
            updateOne: sinon.stub().resolves({ modifiedCount: 1 }),
        };

        dbMock = {
            collection: sinon.stub().returns(collectionMock),
        };
    });

    afterEach(function () {
        sinon.restore();
    });

    it('should fetch all salesmen', async function () {
        const salesmen = await SalesmanService.getAllSalesman(dbMock);

        expect(dbMock.collection.calledWith('salesman')).to.be.true;
        expect(salesmen).to.be.an('array');
        expect(salesmen).to.have.lengthOf(2);
        expect(salesmen[0]).to.have.property('sid', '123');
        expect(salesmen[1]).to.have.property('sid', '456');
    });

    it('should fetch a specific salesman by sid', async function () {
        const salesman = await SalesmanService.getSalesman(dbMock, '123');

        expect(dbMock.collection.calledWith('salesman')).to.be.true;
        expect(collectionMock.findOne.calledOnceWith({ sid: '123' })).to.be.true;
        expect(salesman).to.have.property('sid', '123');
        expect(salesman).to.have.property('name', 'John Doe');
    });

    it('should create a new salesman', async function () {
        const newSalesman = { sid: '789', name: 'Alice Smith' };
        const result = await SalesmanService.createSalesman(dbMock, newSalesman);

        expect(dbMock.collection.calledWith('salesman')).to.be.true;
        expect(collectionMock.insertOne.calledOnceWith(newSalesman)).to.be.true;
        expect(result).to.have.property('insertedId', 'mockId');
    });

    it('should delete a salesman by sid', async function () {
        const result = await SalesmanService.deleteSalesman(dbMock, '123');

        expect(dbMock.collection.calledWith('salesman')).to.be.true;
        expect(collectionMock.deleteOne.calledOnceWith({ sid: '123' })).to.be.true;
        expect(result).to.have.property('deletedCount', 1);
    });

    it('should update a salesman successfully', async function () {
        const updatedSalesman = { sid: '123', name: 'John Updated' };
        const result = await SalesmanService.updateSalesman(dbMock, updatedSalesman);

        expect(dbMock.collection.calledWith('salesman')).to.be.true;
        expect(collectionMock.updateOne.calledOnceWith(
            { sid: '123' },
            { $set: { ...updatedSalesman }}
        )).to.be.true;
        expect(result).to.have.property('modifiedCount', 1);
    });

    it('should throw an error when updating a salesman without sid', async function () {
        try {
            await SalesmanService.updateSalesman(dbMock, { name: 'No SID' });
        } catch (error) {
            expect(error.message).to.equal('Salesman not found!');
        }
    });

    it('should return null when getting a non-existing salesman', async function () {
        collectionMock.findOne.resolves(null);
        const salesman = await SalesmanService.getSalesman(dbMock, '999');

        expect(salesman).to.be.null;
    });

    it('should return zero deleted count when trying to delete a non-existing salesman', async function () {
        collectionMock.deleteOne.resolves({ deletedCount: 0 });
        const result = await SalesmanService.deleteSalesman(dbMock, '999');

        expect(result).to.have.property('deletedCount', 0);
    });
});
