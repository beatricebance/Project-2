import { ElementRef, Injectable } from '@angular/core';
import * as CONSTANTS from '../../constants/constants';
import { Coordinate } from '../commun-interface';

@Injectable({
  providedIn: 'root'
})

export class BucketCalculationService {

    pathsToPaint: Coordinate[][] | undefined;
    private width: number;
    private height: number;
    private ctx: CanvasRenderingContext2D;
    private painted: Set<string>;
    private list: Coordinate[];
    private strokes: Coordinate[];
    private strokesSet: Set<string>;
    private tolerance: number;
    private imageData: ImageData;
    private path: Coordinate[];
    constructor(width: number, height: number, ctx: CanvasRenderingContext2D, tolerance: number) {
        this.width = width;
        this.height = height;
        this.ctx = ctx;
        this.painted = new Set([]);
        this.strokesSet = new Set([]);
        this.list = [];
        this.strokes = [];
        this.tolerance = tolerance;
    }

    toleranceDifference(color: [number, number, number], tolerance: number, color2: [number, number, number]): boolean {
        const difference =
            Math.abs(color[0] - color2[0]) +
            Math.abs(color[1] - color2[1]) +
            Math.abs(color[2] - color2[2]) ;
        return difference / (CONSTANTS.MAX_COLOR * CONSTANTS.TOLERANCE_MULTIPLIER) <= (tolerance / CONSTANTS.POURCENTAGE_CENT);
    }

    private determinePath(): void {
        if (this.strokes.length !== 0) {
            this.pathsToPaint = [];
            this.painted = new Set([]);
            this.path = [];
            const pixel: Coordinate = this.strokes[0];
            this.painted.add(`${pixel.x} ${pixel.y}`);
            while ((pixel.y >= 0 && pixel.y >= 0)) {
                const coords = {x: pixel.x, y: pixel.y};
                this.path.push(coords);
                const closestPixel: Coordinate = { x: -1, y: -1};
                this.moveToNextPixel(pixel, closestPixel);
                this.painted.add(`${closestPixel.x} ${closestPixel.y}`);
                pixel.x = closestPixel.x;
                pixel.y = closestPixel.y;
            }
            this.pathsToPaint.push(this.path);
            this.path = [];
        }
    }

    fillAlgorithm(mousePosition: Coordinate, container: ElementRef): void {
        this.imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const targetColor: [number, number, number] = this.getColorAtPosition(mousePosition, container);
        this.list.push(mousePosition);
        while (this.list.length > 0) {
            const pixel: Coordinate = this.list.pop() as Coordinate;
            if (!this.toleranceDifference(this.getColorAtPosition(pixel, container), this.tolerance, targetColor)) {
                continue;
            }
            const surroundingPixels = [
                {x: pixel.x - 1, y: pixel.y},
                {x: pixel.x + 1, y: pixel.y},
                {x: pixel.x, y: pixel.y - 1},
                {x: pixel.x, y: pixel.y + 1},
            ];
            for (const neighborPixel of surroundingPixels) {
                if (this.painted.has(`${neighborPixel.x} ${neighborPixel.y}`)) {
                    continue;
                }
                if (!this.isRealisticCoord(neighborPixel)) {
                    this.strokes.push(pixel);
                    this.strokesSet.add(`${pixel.x} ${pixel.y}`);
                    break;
                }
                if (this.toleranceDifference(this.getColorAtPosition(neighborPixel, container), this.tolerance, targetColor)) {
                    this.list.push(neighborPixel);
                    this.painted.add(`${neighborPixel.x} ${neighborPixel.y}`);
                } else {
                    this.strokes.push(neighborPixel);
                    this.strokesSet.add(`${neighborPixel.x} ${neighborPixel.y}`);
                    break;
                }
            }
        }
        this.determinePath();
    }

    private moveToNextPixel(pixel: Coordinate, closestPixel: Coordinate): void {
        this.searchFollowingPixels(pixel, closestPixel);
        if (!(closestPixel.x >= 0 && closestPixel.y >= 0)) {
            this.searchSurroundingPixels(pixel, closestPixel);
            this.searchClosestPixels(pixel, closestPixel);
        }
    }

    private searchClosestPixels(pixel: Coordinate, closestPixel: Coordinate): void {
        let distanceBetweenPixels = Number.MAX_SAFE_INTEGER;
        this.strokes.forEach((el: Coordinate) => {
            if (!this.painted.has(`${el.x} ${el.y}`)) {
                const distance = Math.pow(pixel.x - el.x, 2) + Math.pow(pixel.y - el.y, 2);
                if (distance < distanceBetweenPixels) {
                    distanceBetweenPixels = distance;
                    closestPixel.x = el.x;
                    closestPixel.y = el.y;
                }
            }
        });

        if (distanceBetweenPixels > CONSTANTS.PIXEL_DISTANCE && this.path.length > 0) {
            if (this.pathsToPaint !== undefined) {
                this.pathsToPaint.push(this.path);
                this.path = [];
            }
        }
    }

    private findNextPixel(surroundingPixels: Coordinate[], closestPixel: Coordinate): void {
        surroundingPixels.forEach((neighborPixel: Coordinate) => {
            if (this.strokesSet.has(`${neighborPixel.x} ${neighborPixel.y}`) &&
                !this.painted.has(`${neighborPixel.x} ${neighborPixel.y}`)) {
                closestPixel.x = neighborPixel.x;
                closestPixel.y = neighborPixel.y;
            }
        });
    }

    private isRealisticCoord(pixel: Coordinate): boolean {
        return (pixel.x >= 0 && pixel.x <  this.width  && pixel.y >= 0 && pixel.y <  this.height);
    }

    private getColorAtPosition(pixel: Coordinate, container: ElementRef): [number, number, number] {
        let index: number = (pixel.y * this.width + pixel.x) * CONSTANTS.INDEX_MULTIPLIER;
        return [this.imageData.data[index++],
                this.imageData.data[index++],
                this.imageData.data[index]];
    }

    private searchSurroundingPixels(pixel: Coordinate, closestPixel: Coordinate): void {
        const surroundingPixels = [
            {x: pixel.x - 1, y: pixel.y - 1},
            {x: pixel.x - 1, y: pixel.y + 1},
            {x: pixel.x + 1, y: pixel.y - 1},
            {x: pixel.x + 1, y: pixel.y + 1},
        ];
        this.findNextPixel(surroundingPixels, closestPixel);
    }

    private searchFollowingPixels(pixel: Coordinate, closestPixel: Coordinate): void {
        const surroundingPixels = [
            {x: pixel.x - 1, y: pixel.y},
            {x: pixel.x + 1, y: pixel.y},
            {x: pixel.x, y: pixel.y - 1},
            {x: pixel.x, y: pixel.y + 1},
        ];
        this.findNextPixel(surroundingPixels, closestPixel);
    }
}
