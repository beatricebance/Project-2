// import { ElementRef} from '@angular/core';
import { ObjectId } from 'mongodb';
import { UndoRedoPile } from '../../../client/src/app/services/commun-interface';

export interface Drawingdata {
    _id: ObjectId;
    name: string;
    tag: string [];
    svgxml: string;
    drawingPile: UndoRedoPile[];
    svgHeight: number;
    svgWidth: number;
    svgColorHexa: string;
    // data: ElementRef;

}
