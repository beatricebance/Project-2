import { Box } from '../box';
import { Coordinate } from '../commun-interface';
import { SelectorService } from '../selector/selector.service';

export class RotateSelection {

  constructor(private selection: SelectorService) {}

  onWheel($event: WheelEvent): void {
    const rotationAngle = 15;
    const sign = ($event.deltaY  < 0 ) ? 1 : -1;
    const degrees = ($event.altKey) ? 1 : rotationAngle;
    if ($event.shiftKey) {
      this.rotateOnSelf(degrees * sign);
    } else {
      this.rotateOnAll(degrees * sign);
    }
    this.selection.selectAllArray(new Set(this.selection.selected));
  }

  rotateOnSelf(degrees: number): void {
    this.selection.selected.forEach((element) => {
      const box = this.selection.getElementBox(element);
      const center: Coordinate = {
        x : (box.left + box.right) / 2,
        y : (box.top + box.bottom) / 2
      };
      this.rotate(element, center, degrees);
    });
  }

  rotateOnAll(degrees: number): void {
    let box: Box | undefined;
    this.selection.selected.forEach((element: SVGElement) => {
      const elementBox = this.selection.getElementBox(element);
      box = !!box ? box.union(elementBox) : elementBox;
    });
    if (box === undefined) {
      return ;
    }
    const center: Coordinate = {
      x : (box.left + box.right) / 2,
      y : (box.top + box.bottom) / 2
    };
    this.selection.selected.forEach((element) => {
      this.rotate(element, center, degrees);
    });
  }

  rotate(element: SVGElement, {x, y}: Coordinate, degrees: number): void {
    const piInDegrees = 180;
    const cos = (deg: number) => Math.cos(deg * Math.PI / piInDegrees);
    const sin = (deg: number) => Math.sin(deg * Math.PI / piInDegrees);
    const transformMatrix = [
      [cos(degrees), - sin(degrees), (1 - cos(degrees)) * x + sin(degrees) * y],
      [sin(degrees),   cos(degrees), (1 - cos(degrees)) * y - sin(degrees) * x],
      [           0,              0,                                         1],
    ];
    const actualMatrix = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ];
    const transformAttribute = element.getAttribute('transform');
    if (transformAttribute !== null) {
      const regExpr = /matrix\(\s*([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)\)/;
      const allNumbers = regExpr.exec(transformAttribute) as RegExpMatchArray;
      const pos3 = 3;
      const pos4 = 4;
      const pos5 = 5;
      const pos6 = 6;
      actualMatrix[0][0] = +allNumbers[1];
      actualMatrix[0][1] = +allNumbers[pos3];
      actualMatrix[0][2] = +allNumbers[pos5];
      actualMatrix[1][0] = +allNumbers[2];
      actualMatrix[1][1] = +allNumbers[pos4];
      actualMatrix[1][2] = +allNumbers[pos6];
    }
    const newMatrix = this.multiplyMatrix(actualMatrix, transformMatrix);
    element.setAttribute('transform', `matrix(${newMatrix[0][0]}, ${newMatrix[1][0]}, ${newMatrix[0][1]}, ${newMatrix[1][1]}, ${newMatrix[0][2]}, ${newMatrix[1][2]})`);
  }

  private multiplyMatrix(matrix1: number[][], matrix2: number[][]): number[][] {
    const matrixSize = 3;
    const result = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    for (let row = 0; row < matrixSize; row++) {
      for (let column = 0; column < matrixSize; column++) {
        for (let i = 0; i < matrixSize; i++) {
          result[row][column] += matrix1[row][i] * matrix2[i][column];
        }
      }
    }
    return result;
  }
}
