export interface Coordinate {
  x: number;
  y: number;
}

export interface UndoRedoPile {
  id: number;
  element: ChildNode;
  type: string;
}
