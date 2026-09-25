/** Equivalent to `StatusCondition.cs` */
export interface IStatusCondition {
    name: string,
    spriteURL?: string,
    type?: StatusConditionType,
    turns?: number,
    textFields?: string[],
    isEffectConfigured?: boolean
}

export enum StatusConditionType {
    Unassigned = 0,
    Positive = 1,
    Negative = 2,
    Neutral = 3
}