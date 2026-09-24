import { ICoordinate } from "../map/coordinate";

/** Equivalent to `UnitLocationData.cs` */
export interface IUnitLocationData { 
    coordinate: ICoordinate,
    unitSize: number,
    isBackOfPair: boolean,
    pairedUnit?: string
}