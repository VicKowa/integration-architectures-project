const { expect } = require('chai');
const sinon = require('sinon');
const authApi = require('../../src/apis/auth-api');
const userService = require('../../src/services/user-service');
const authService = require('../../src/services/auth-service');

describe('Auth API Tests', () => {
    let req, res, sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        req = {
            app: {
                get: sandbox.stub().returns({
                    query: {},
                    body: {}
                })
            },
            session: {}
        };
        res = {
            status: sandbox.stub().returnsThis(),
            send: sandbox.stub()
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('POST /login (login)', () => {
        it('should login successfully', async () => {
            const fakeUser = { id: '12345', username: 'john' };
            sandbox.stub(userService, 'verify').resolves(fakeUser);
            sandbox.stub(authService, 'authenticate');

            await authApi.login(req, res);

            expect(res.send.calledOnceWith('login successful')).to.be.true;
        });

        it('should return 401 when login fails', async () => {
            sandbox.stub(userService, 'verify').rejects(new Error());

            await authApi.login(req, res);

            expect(res.status.calledOnceWith(401)).to.be.true;
        });
    });

    describe('POST /logout (logout)', () => {
        it('should logout successfully', async () => {
            sandbox.stub(authService, 'deAuthenticate');

            await authApi.logout(req, res);

            expect(res.send.calledOnceWith('logout successful')).to.be.true;
            expect(authService.deAuthenticate.calledOnceWith(req.session)).to.be.true;
        });
    });

    describe('POST /register (register)', () => {
        it('should register the user successfully', async () => {
            const fakeUser = { username: 'john', password: 'password123' };
            req.body = fakeUser;
            sandbox.stub(userService, 'add').resolves();

            await authApi.register(req, res);

            expect(res.send.calledOnceWith('registration successful')).to.be.true;
        });

        it('should return 400 if registration fails', async () => {
            const fakeUser = { username: 'john', password: 'password123' };
            req.body = fakeUser;
            sandbox.stub(userService, 'add').rejects(new Error());

            await authApi.register(req, res);

            expect(res.status.calledOnceWith(400)).to.be.true;
        });
    });
});
