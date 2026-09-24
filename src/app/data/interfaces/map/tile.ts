import { ICoordinate } from "./coordinate";
import { ITileUnitData } from "./tile-unit-data";
import { ITileWarpData } from "./tile-warp-data";

/** Equivalent to `Tile.cs` */
export interface ITile {
    coordinate: ICoordinate,
    terrainType: string,
    unitData: ITileUnitData,
    warpData?: ITileWarpData,
    tileObjectInstanceIDs?: number[],
    movCount?: number,
    atkCount?: number,
    utilCount?: number,
    tileObjCount?: number
}