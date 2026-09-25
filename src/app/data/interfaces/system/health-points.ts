/** Equivalent to `HealthPoints.cs` */
export interface IHealthPoints {
    current: number,
    maximum: number,
    percentage: number,
    remainingBars?: number
}