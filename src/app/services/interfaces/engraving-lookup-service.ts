import { IEngraving } from "../../data/interfaces/system/engraving";

/**
 * Interface requiring implementation of a getEngravingByName() function.
 */
export interface IEngravingLookupService {
  getEngravingByName(name: string): IEngraving | undefined;
}