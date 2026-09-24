import { IUnitInventoryItem } from "./unit-inventory-item";

/** Equivalent to `UnitInventorySubsection.cs` */
export interface IUnitInventorySubsection {
    items: IUnitInventoryItem[],
    emptySlotCount: number
}