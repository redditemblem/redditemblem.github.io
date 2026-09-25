import { StringDictionary } from "../common/dictionaries";

/** Equivalent to `UnitInventoryItemStat.cs` */
export interface IUnitInventoryItemStat {
    baseValue: number,
    finalValue: number,
    modifiers?: StringDictionary<number>,
    invertModifiedDisplayColors?: boolean
}