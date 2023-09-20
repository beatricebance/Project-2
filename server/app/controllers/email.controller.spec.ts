import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { EmailService } from '../services/email.service';
import Types from '../types';

// tslint:disable:no-any

const HTTP_STATUS_OK = 200;

describe('EmailController', () => {
    let emailService: Stubbed<EmailService>;
    let app: Express.Application;

    beforeEach(async () => {
        const [container, sandbox] = await testingContainer();
        container.rebind(Types.EmailService).toConstantValue({
            currentTime: sandbox.stub(),
        });
        emailService = container.get(Types.EmailService);
        app = container.get<Application>(Types.Application).app;
    });

    it('should successfully send an email to the mail API on POST request.', async () => {
            emailService.sendByEmail.resolves(HTTP_STATUS_OK);
            return supertest(app)
                .post('/api/email')
                .expect(HTTP_STATUS_OK)
                .then((response: any) => {
                    expect(response.body).to.deep.equal(HTTP_STATUS_OK);
                });
        });

    it('should fail and throw an error when the form data is missing some information', async () => {
                    emailService.sendByEmail.rejects(new Error('service error'));
                    return supertest(app)
                        .post('/api/email')
                        .expect(HTTP_STATUS_OK)
                        .then((response: any) => {
                            expect(response.body.title).to.equal('Error');
            });
                });

});
