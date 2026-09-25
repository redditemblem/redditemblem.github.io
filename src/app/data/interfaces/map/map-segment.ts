import { NumberDictionary } from "../common/dictionaries";
import { IRange } from "../common/range";
import { ITile } from "./tile";
import { ITileObjectInstance } from "./tile-object-instance";

/** Equivalent to `MapSegment.cs` */
export interface IMapSegment {
    imageURL: string,
    title: string,
    heightInPixels: number,
    widthInPixels: number,
    heightInTiles: number,
    widthInTiles: number,
    horizontalTileRangeWithinMap: IRange,
    tiles: ITile[][],
    tileObjectInstances: NumberDictionary<ITileObjectInstance>
}