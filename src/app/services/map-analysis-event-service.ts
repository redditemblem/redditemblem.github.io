import { Injectable, signal } from '@angular/core';
import { IMapSegment } from '../data/interfaces/map/map-segment';
import { IAnalysisWarpGroup } from './map-analysis-data-service';

export type MapAnalysisMode = "moveCost" | "terrainType" | "warpGroup" | "specialty";
export type MapAnalysisSpecialtyMode = "cannotStopOn" | "blocksItems" | "restrictAff";

@Injectable({
  providedIn: 'root',
})
export class MapAnalysisEventService {

  /** Fully resets values stored in the event service back to their default state. */
  public reset() {
    this.mode.set("moveCost");
    this.segment.set(undefined);

    this.movementType.set(undefined);
    this.affiliationGroup.set(undefined);
    this.terrainType.set(undefined);
    this.warpGroup.set(undefined);
    this.specialtyMode.set(undefined);
  }

  public mode = signal<MapAnalysisMode>("moveCost");

  // #region Selected Segment and Tile  

  private segment = signal<IMapSegment | undefined>(undefined);
  public readonly selectedSegment = this.segment.asReadonly();

  public updateSelectedSegment(segment: IMapSegment) {
    this.segment.set(segment);
  }

  // #endregion Selected Segment and Tile

  // #region Movement Type

  public movementType = signal<string | undefined>(undefined);
  public affiliationGroup = signal<string | undefined>(undefined);

  // #endregion Movement Type

  // #region Terrain Type

  public terrainType = signal<string | undefined>(undefined);

  // #endregion Terrain Type

  // #region Warp Groups

  public warpGroup = signal<IAnalysisWarpGroup | undefined>(undefined);

  // #endregion Warp Groups

  // #region Specialty Mode

  public specialtyMode = signal<MapAnalysisSpecialtyMode | undefined>(undefined);

  // #endregion Specialty Mode
}
