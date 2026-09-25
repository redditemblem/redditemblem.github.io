/** Equivalent to `Coordinate.cs` */
export interface ICoordinate {
    x: number,
    y: number,
    asText: string
}

/** Equivalent to `CoordinateFormat` enum */
export enum CoordinateFormat {
    XY = 0,
    Alphanumerical = 1
}