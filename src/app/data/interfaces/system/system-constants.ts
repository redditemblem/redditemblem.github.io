import { ICurrencyConstants } from "./currency-constants";

/** Equivalent to `SystemConstantsConfig.cs` */
export interface ISystemConstants {
    currency?: ICurrencyConstants
    weaponRanks?: string[],
    allowNonInventoryEquippedItems?: boolean
}