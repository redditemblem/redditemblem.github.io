import { StringDictionary } from "../common/dictionaries";
import { IGambitRange } from "./gambit-range";

/** Equivalent to `Gambit.cs` */
export interface IGambit {
    name: string,
    spriteURL?: string,
    maxUses?: number,
    utilizedStats?: string[],
    range: IGambitRange,
    stats?: StringDictionary<number>,
    textFields?: string[]
}