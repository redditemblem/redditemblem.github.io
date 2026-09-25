import { CoordinateFormat } from "./coordinate";

/** Equivalent to `MapConstantsConfig.cs` */
export interface IMapConstants {
    tileSize: number,
    hasHeaderTopLeft: boolean,
    hasHeaderBottomRight: boolean,
    coordinateFormat: CoordinateFormat,
    calculateRanges: boolean,
    calculatePairedUnitRanges: boolean,
    itemMaxRangeAllowedForCalculation: number,
    unitMovementStatName: string
}