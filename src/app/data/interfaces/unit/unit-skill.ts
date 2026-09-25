import { StringDictionary } from "../common/dictionaries";

/** Equivalent to `UnitSkill.cs` */
export interface IUnitSkill {
    name: string,
    additionalStats: StringDictionary<number>
}