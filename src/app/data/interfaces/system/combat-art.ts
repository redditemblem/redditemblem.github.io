import { StringDictionary } from "../common/dictionaries";
import { ICombatArtRange } from "./combat-art-range";

/** Equivalent to `CombatArt.cs` */
export interface ICombatArt {
    name: string,
    spriteURL?: string,
    weaponRank?: string,
    category?: string,
    utilizedStats?: string[],
    range: ICombatArtRange,
    stats?: StringDictionary<number>,
    durabilityCost?: number,
    tags?: string[],
    textFields?: string[]
}