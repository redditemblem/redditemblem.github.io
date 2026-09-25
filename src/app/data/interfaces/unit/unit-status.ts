import { StringDictionary } from "../common/dictionaries";

/** Equivalent to `UnitStatus.cs` */
export interface IUnitStatus {
    name: string,
    remainingTurns?: number,
    additionalStats?: StringDictionary<number>
}