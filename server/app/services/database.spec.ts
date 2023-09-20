import { expect } from 'chai';
// import * as sinon from 'sinon';
import { testingContainer } from '../../test/test-utils';
import Types from '../types';
import { DatabaseService } from './database.service';

describe('Date Service', () => {
    let databaseService: DatabaseService;

    beforeEach(async () => {
        const [container] = await testingContainer();
        databaseService = container.get<DatabaseService>(Types.DateService);
    });

    it('should return all drawing', async () => {
        const result = databaseService.getAllDrawing();
        expect(result).to.not.equal('');
    });
});
