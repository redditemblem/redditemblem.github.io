import { StringDictionary } from "../common/dictionaries";
import { ITileObjectRange } from "./tile-object-range";

/** Equivalent to `TileObject.cs` */
export interface ITileObject {
    name: string
    spriteURL?: string,
    size?: number,
    layer?: TileObjectLayer,
    range?: ITileObjectRange,
    hpModifier?: number,
    combatStatModifiers?: StringDictionary<number>,
    statModifiers?: StringDictionary<number>,
    movementCostOverride?: number,
    textFields?: string[]
}

export enum TileObjectLayer {
    Below = 0,
    Above = 1
}