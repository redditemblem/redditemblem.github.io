import { IUnitInventoryItem } from "./unit-inventory-item";
import { IUnitSkill } from "./unit-skill";

/** Equivalent to `UnitEmblem.cs` */
export interface IUnitEmblem {
    name: string,
    bondLevel?: number,
    engageMeterCount?: number,
    isEngaged?: boolean,
    syncSkills?: IUnitSkill[],
    engageSkills?: IUnitSkill[],
    engageWeapons?: IUnitInventoryItem[]
    engageAttacks?: string[]
}