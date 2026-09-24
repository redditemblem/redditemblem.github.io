import { StringDictionary } from "../common/dictionaries";
import { IModifiedStatValue } from "../common/modified-stat-value";
import { IHealthPoints } from "../system/health-points";

/** Equivalent to `UnitStatsData.cs` */
export interface IUnitStatsData { 
    level: number,
    experience?: number,
    heldCurrency?: number,
    hp: IHealthPoints,
    combat?: StringDictionary<IModifiedStatValue>,
    general: StringDictionary<IModifiedStatValue>,
    system_Prioritized?: StringDictionary<IModifiedStatValue>,
    system_NonPrioritized?: StringDictionary<IModifiedStatValue>
}