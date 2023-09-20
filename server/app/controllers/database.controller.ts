import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import * as mongo from 'mongodb';
import { DatabaseService } from '../services/database.service';
import Types from '../types';
import { Drawingdata } from './drawingdata';

@injectable()
export class DatabaseController {

    router: Router;
    col: mongo.Collection;

    constructor(
        @inject(Types.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        // route pour recuperer tous les documents de la collection
        this.router.get('/DRAWING', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllDrawing()
                .then((DRAWING: Drawingdata[]) => {
                    res.json(DRAWING);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        // route pour recuperer tous les tag de tous les documents dans la collection
        this.router.get('/DRAWING/tag', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllTag()
                .then((drawingtag: string[]) => {
                    res.json(drawingtag);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        // route pour enregistrer un nouveau dessin dans la collection
        this.router.post('/DRAWING/', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.addDrawingData(req.body)
                .then(() => {
                    res.sendStatus(Httpstatus.CREATED).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
        // route pour supprimer un dessin a partir de son nom
        this.router.delete('/DRAWING:name', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.deleteDrawing(req.params.name)
                .then(() => {
                    res.sendStatus(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

           // route pour supprimer un dessin a partir de son id
        this.router.delete('/DRAWING', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.deleteDrawingById(req.query.id)
                .then(() => {
                    res.sendStatus(Httpstatus.NO_CONTENT).send();
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

     // route pour recuperer tous les dessins de tous les documents dans la collection en fonction du tag rentrer
        this.router.get('/DRAWING/:tag', async (req: Request, res: Response, next: NextFunction) => {
        this.databaseService.getDrawingByTag(req.params.tag)
            .then((DRAWING: Drawingdata[]) => {
                res.json(DRAWING);
            })
            .catch((error: Error) => {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
    });
    }

}
