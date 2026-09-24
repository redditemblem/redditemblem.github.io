import { IUnitSkill } from "../unit/unit-skill";
import { IItemRange } from "./item-range";

/** Equivalent to `Item.cs` */
export interface IItem {
    name: string,
    spriteURL?: string,
    category: string,
    weaponRank?: string,
    isAlwaysUsable?: boolean,
    utilizedStats?: string[],
    targetedStats?: string[],
    dealsDamage?: boolean,
    maxUses: number,
    equippedSkills?: IUnitSkill[],
    range: IItemRange,
    textFields?: string[],
    graphicURL?: string
}