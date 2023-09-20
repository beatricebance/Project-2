import axios from 'axios';
import * as FormData from 'form-data';
import { injectable } from 'inversify';
import 'reflect-metadata';
import * as CONSTANTS from '../../../client/src/app/constants/constants';
import { EmailData } from '../controllers/emaildata';

@injectable()
export class EmailService {
    // tslint:disable-next-line:no-empty
    constructor( ) { }

    async sendByEmail(data: EmailData): Promise<void | string> {
        if (this.validatedata(data.to)) {
        const  MAIL_API_X_TEAM_KEY = 'b81784b6-3a26-4cb9-9551-980b1c8e959e';
        const MAIL_API_URL = 'https://log2990.step.polymtl.ca/email?address_validation=true&quick_return=true';

        const formData: FormData = new FormData();
        const buffer = Buffer.from(data.payload, 'base64');
        formData.append('to', data.to);
        formData.append('payload', buffer, {
            contentType: 'image/' + data.format,
            filename: data.filename + '.' + data.format,
        });
        const formHeaders = formData.getHeaders();
        const config = {
            headers: {
                'x-team-key': MAIL_API_X_TEAM_KEY,
                'content-type': 'multipart/form-data',
                ...formHeaders
            }
        };
        return axios.post(MAIL_API_URL, formData, config  )
        .then(() => {
          console.log('email envoyer');
        })
        .catch((error: Error) => {
            throw  error;
        });
        } else {
            console.log('Invalid donnees');
        }
    }

    private validatedata(data: string): boolean {
        return this.validateEmail(data);
    }
    private validateEmail(email: string): boolean {
        return email !== CONSTANTS.EMPTY_STRING;
    }
}
