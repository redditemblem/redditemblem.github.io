import { StringDictionary } from "../common/dictionaries";
import { IItemSort } from "./item-sort";

/** Equivalent to `FilterParameters.cs` */
export interface IFilterParameters {
    sorts: IItemSort[],
    owners: string[],
    itemCategories: string[],
    utilizedStats: string[],
    targetedStats: string[],
    filterConditions: StringDictionary<boolean>
}