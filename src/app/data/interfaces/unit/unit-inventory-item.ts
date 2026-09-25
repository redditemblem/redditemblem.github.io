import { StringDictionary } from "../common/dictionaries";
import { IUnitInventoryItemStat } from "./unit-inventory-item-stat";

/** Equivalent to `UnitInventoryItem.cs` */
export interface IUnitInventoryItem {
    name: string,
    uses?: number,
    maxUses?: number,
    stats?: StringDictionary<IUnitInventoryItemStat>,
    minRange?: IUnitInventoryItemStat,
    maxRange?: IUnitInventoryItemStat,
    canEquip?: boolean,
    isPrimaryEquipped?: boolean,
    isSecondaryEquipped?: boolean,
    isDroppable?: boolean,
    isUsePrevented?: boolean,
    isNotInInventory?: boolean,
    maxRangeExceedsCalculationLimit?: boolean,
    allowMeleeRange?: boolean,
    tags?: string[],
    engravings?: string[]
}