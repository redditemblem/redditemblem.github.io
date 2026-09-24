import { ICoordinate } from "../map/coordinate";

/** Equivalent to `UnitRangeData.cs` */
export interface IUnitRangeData {
    movement?: ICoordinate[],
    attack?: ICoordinate[],
    utility?: ICoordinate[]
}