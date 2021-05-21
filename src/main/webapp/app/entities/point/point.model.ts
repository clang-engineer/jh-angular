export interface IPoint {
  id?: number;
  title?: string;
  description?: string;
}

export class Point implements IPoint {
  constructor(public id?: number, public title?: string, public description?: string) {}
}

export function getPointIdentifier(point: IPoint): number | undefined {
  return point.id;
}
