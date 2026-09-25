/** Equivalent to `ItemRange.cs` */
export interface IItemRange {
    minimum: number,
    minimumRequiresCalculation: boolean,
    maximum: number,
    maximumRequiresCalculation: boolean,
    shape: ItemRangeShape
}

export enum ItemRangeShape {
    Standard = 0,
    Square = 1,
    Cross = 2,
    Saltire = 3,
    Star = 4
}