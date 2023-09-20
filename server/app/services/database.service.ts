import { injectable } from 'inversify';
import { Collection, FilterQuery, MongoClient, MongoClientOptions, ObjectId} from 'mongodb';
import 'reflect-metadata';
import * as CONSTANTS from '../../../client/src/app/constants/constants';
import { Drawingdata } from '../controllers/drawingdata';

const DATABASE_URL = 'mongodb+srv://halima:polymtl2020@cluster0-ddpj4.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'POLYDRAWING';
const DATABASE_COLLECTION = 'drawing';

@injectable()
export class DatabaseService {

    collection: Collection<Drawingdata>;

    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
                console.log('Connexion a la base de donnée reussie');
            })
            .catch(() => {
                console.error('Erreur de connexion. Impossible de se connecter a la base de donnée');
                process.exit(1);
            });

    }

    async getAllDrawing(): Promise<Drawingdata[]> {
        return  this.collection.find({}).toArray()
                .then((DRAWING: Drawingdata[]) => {
                    return DRAWING;
                })
                .catch((error: Error) => {
                    throw  error;
                });
    }

    async getDrawingByTag(drawingtag: string): Promise<Drawingdata[]> {
        const filterQuery: FilterQuery<Drawingdata> = {tag: drawingtag };
        return  this.collection.find(filterQuery).toArray()
                .then((DRAWING: Drawingdata[]) => {
                    return DRAWING;
                })
                .catch((error: Error) => {
                    throw error;
                });
    }

    async getAllTag(): Promise< string []> {
        return  this.collection.distinct('tag')
        .then((drawingtag: string[]) => {
            return drawingtag;
        })
        .catch((error: Error) => {
            throw error;
        });
    }

    async deleteDrawing(drawingname: string): Promise<void> {
        return this.collection
            .findOneAndDelete({ name: drawingname })
        .then(() => {
            console.log('dessin supprimer de la base de donnée');
        })
        .catch((error: Error) => {
            throw error;
        });
    }

    async deleteDrawingById(drawingid: ObjectId): Promise<void> {
        return this.collection
            .findOneAndDelete({ id: drawingid })
        .then(() => {
            console.log('dessin supprimer de la base de donnée');
        })
        .catch((error: Error) => {
            throw error;
        });
    }

    async addDrawingData(data: Drawingdata): Promise<void> {
        if (this.validatedrawingdata(data)) {
            this.collection.insertOne(data).catch((error: Error) => {
                throw error;
            });
        } else {
            console.log('Invalide Drawingdata');
        }
    }

    private validatedrawingdata(data: Drawingdata): boolean {
        return this.validateTag(data.tag) && this.validateName(data.name);
    }
    private validateTag(tag: string []): boolean {
        return tag.length <= CONSTANTS.DIALOGSAVE_VALIDATOR_MAX;
    }

    private validateName(name: string): boolean {
        return name !== CONSTANTS.EMPTY_STRING;
    }

}
