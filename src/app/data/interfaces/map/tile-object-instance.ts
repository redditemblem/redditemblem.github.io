import { IHealthPoints } from "../system/health-points";
import { ICoordinate } from "./coordinate";

/** Equivalent to `TileObjectInstance.cs` */
export interface ITileObjectInstance {
    id: number,
    name: string,
    anchorCoordinate: ICoordinate,
    hp?: IHealthPoints,
    attackRange: ICoordinate[]
}