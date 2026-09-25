import { ITerrainType } from "../../data/interfaces/system/terrain-type";

/**
 * Interface requiring implementation of a getTerrainTypeByName() function.
 */
export interface ITerrainTypeLookupService {
  getTerrainTypeByName(name: string): ITerrainType | undefined;
}