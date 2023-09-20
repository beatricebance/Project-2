// import { expect } from 'chai';
import { assert } from 'chai';
import * as mongo from 'mongodb';
import 'reflect-metadata';
import * as sinon from 'sinon';
import * as supertest from 'supertest';
import * as CONSTANTS from '../../../client/src/app/constants/constants';
import { testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import types from '../types';
import { DatabaseController } from './database.controller';

let controller: DatabaseController;
let app: Express.Application;
const configureRouter = 'configureRouter';

describe.only('Test save controller', () => {
    beforeEach(async () => {
        const [container] = await testingContainer();
        controller = container.get<DatabaseController>(types.DatabaseController);
        app = container.get<Application>(types.Application).app;
    });
    it('should test get', () => {
        controller[configureRouter]();
        setTimeout(() => {
            const stub = sinon.stub(controller.col, 'find');
            stub.withArgs({}).returns({} as mongo.Cursor<unknown>);
            supertest(app).get('/api/database').then((response) => {
                assert(response.ok);
                stub.resolves();
                assert(stub.called);
                stub.restore();
            });
        }, CONSTANTS.TEST_DATABASE);
    });

    it('should post', () => {
        controller[configureRouter]();
        setTimeout(async () => {
            const stub = sinon.stub(controller.col, 'insertOne');
            stub.returns(await Promise.resolve());
            supertest(app).post('/api/save').then((response) => {
                assert(response.ok);
                stub.resolves();
                assert(stub.called);
                stub.restore();
            });

        }, CONSTANTS.TEST_DATABASE);
    });

});
