import { StringDictionary } from "../common/dictionaries"
import { IUnitBattalion } from "./unit-battalion"
import { IUnitEmblem } from "./unit-emblem"
import { IUnitInventory } from "./unit-inventory"
import { IUnitLocationData } from "./unit-location-data"
import { IUnitRangeData } from "./unit-range-data"
import { IUnitSkillSubsection } from "./unit-skill-subsection"
import { IUnitSpriteData } from "./unit-sprite-data"
import { IUnitStatsData } from "./unit-stats-data"
import { IUnitStatus } from "./unit-status"

/** Equivalent to `Unit.cs` */
export interface IUnit {
    name: string,
    unitNumber?: string,
    player?: string,
    characterApplicationURL?: string,
    textFields?: string[]
    sprite: IUnitSpriteData,
    location: IUnitLocationData,
    classes?: string[],
    unitMovementType?: string,
    affiliation: string,
    stats: IUnitStatsData,
    tags?: string[],
    behavior?: string,
    statusConditions?: IUnitStatus[],
    skillSubsections?: IUnitSkillSubsection[],
    ranges: IUnitRangeData,
    normalizedName: string,
    movementType: string,
    hasSkills: boolean
    
    //Inventory
    weaponRanks?: StringDictionary<string>,
    inventory?: IUnitInventory,

    //3H
    combatArts?: string[],
    battalion?: IUnitBattalion,
    adjutants?: string[],

    //Engage
    emblem?: IUnitEmblem,
    battleStyle?: string
}