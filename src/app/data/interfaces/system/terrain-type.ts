import { ITerrainTypeStats } from "./terrain-type-stats";

/** Equivalent to `TerrainType.cs` */
export interface ITerrainType {
    name: string,
    statGroups?: ITerrainTypeStats[],
    warpType?: WarpType,
    warpCost?: number,
    cannotStopOn?: boolean,
    blocksItems?: boolean,
    textFields?: string[],
    canRestrictAffiliations?: boolean
}

export enum WarpType {
    None = 0,
    Entrance = 1,
    Exit = 2,
    Dual = 3
}