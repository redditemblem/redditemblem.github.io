import { StringDictionary } from "./dictionaries";

//Equivalent to ModifiedStatValue.cs
export interface IModifiedStatValue {
    baseValue: number,
    finalValue: number,
    modifiers?: StringDictionary<number>,
    invertModifiedDisplayColors?: boolean,
    usePrioritizedDisplay?: boolean
}