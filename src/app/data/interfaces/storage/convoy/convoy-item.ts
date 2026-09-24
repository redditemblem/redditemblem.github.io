import { StringDictionary } from "../../common/dictionaries";
import { IUnitInventoryItemStat } from "../../unit/unit-inventory-item-stat";

/** Equivalent to `ConvoyItem.cs` */
export interface IConvoyItem {
    name: string,
    owner: string,
    uses: number,
    stats: StringDictionary<IUnitInventoryItemStat>,
    quantity: number,
    value: number,
    tags: string[],
    engravings: string[]
}