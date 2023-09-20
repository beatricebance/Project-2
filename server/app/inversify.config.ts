import { Container } from 'inversify';
import { Application } from './app';
import { DatabaseController } from './controllers/database.controller';
import { DateController } from './controllers/date.controller';
import { EmailController } from './controllers/email.controller';
import { IndexController } from './controllers/index.controller';
import { Server } from './server';
import { DatabaseService } from './services/database.service';
import { DateService } from './services/date.service';
import { EmailService } from './services/email.service';
import { IndexService } from './services/index.service';
import Types from './types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(Types.Server).to(Server);
    container.bind(Types.Application).to(Application);
    container.bind(Types.IndexController).to(IndexController);
    container.bind(Types.IndexService).to(IndexService);

    container.bind(Types.DateController).to(DateController);
    container.bind(Types.DateService).to(DateService);

    container.bind(Types.DatabaseController).to(DatabaseController);
    container.bind(Types.DatabaseService).to(DatabaseService);

    container.bind(Types.EmailController).to(EmailController);
    container.bind(Types.EmailService).to(EmailService);

    return container;
};
