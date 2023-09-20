import { Coordinate } from './commun-interface';

export class Box {

  left: number;
  right: number;
  top: number;
  bottom: number;

  constructor(public startPoint: Coordinate, public width: number, public height: number) {
    this.left = startPoint.x;
    this.right = startPoint.x + width;
    this.top = startPoint.y;
    this.bottom = startPoint.y + height;
  }

  intercepts(box: Box): boolean {
    const left = Math.max(this.left, box.left);
    const right = Math.min(this.right, box.right);
    const top = Math.max(this.top, box.top);
    const bottom = Math.min(this.bottom, box.bottom);
    return left < right && top < bottom;
  }

  union(box: Box): Box {
    const left = Math.min(this.left, box.left);
    const right = Math.max(this.right, box.right);
    const top = Math.min(this.top, box.top);
    const bottom = Math.max(this.bottom, box.bottom);
    return new Box(
      { x: left, y: top},
      right - left,
      bottom - top
    );
  }

}
