import { computed, EventEmitter, Injectable, Output, signal } from '@angular/core';
import { NumberDictionary, StringDictionary } from '../data/interfaces/common/dictionaries';
import { IUnit } from '../data/interfaces/unit/unit';
import { ICoordinate } from '../data/interfaces/map/coordinate';
import { ITile } from '../data/interfaces/map/tile';
import { IMapSegment } from '../data/interfaces/map/map-segment';
import { ITileObjectInstance } from '../data/interfaces/map/tile-object-instance';

@Injectable({
  providedIn: 'root',
})
export class MapEventService {

  /** Fully resets values stored in the event service back to their default state. */
  public reset() {
    this.uPinStates.set({});
    this.toPinStates.set({});
    this.tileStates.set({});

    this.segment.set(undefined);
    this.tile.set(undefined);

    this.paintMode.set(false);
    this.penColor.set("#000000");
    this.penWidth.set(2);
  }

  // #region Pin Actions

  @Output() switchDisplayToUnit = new EventEmitter<IUnit>();

  public switchDisplayedUnit(unit: IUnit) {
    this.switchDisplayToUnit.emit(unit);
  }

  private uPinStates = signal<StringDictionary<boolean>>({});
  public readonly unitPinStates = this.uPinStates.asReadonly();

  public readonly someUnitPinned = computed(() => {
    return Object.values(this.uPinStates()).some(flag => flag === true);
  });

  private toPinStates = signal<NumberDictionary<boolean>>({});
  public readonly tileObjectPinStates = this.toPinStates.asReadonly();

  private tileStates = signal<StringDictionary<ITileState>>({});
  public readonly tileDisplayStates = this.tileStates.asReadonly();

  /**
   * Flips `unit`'s pinned state and updates tile states for its movement, attack, and utility ranges.
   * 
   * @returns Unit's updated pinned state
   */
  public toggleUnitPinnedState(unit: IUnit) : boolean {
    const name: string = unit.name;
    const isPinned: boolean = this.getPinnedStateForUnit(unit.name);

    this.uPinStates.update(dict => {
      dict[name] = !isPinned;
      return {...dict};
    });

    //Update tile states based on unit's ranges
    const movRange: ICoordinate[] = unit.ranges.movement ?? [];
    const atkRange: ICoordinate[] = unit.ranges.attack ?? [];
    const utilRange: ICoordinate[] = unit.ranges.utility ?? [];

    const modifier: number = (isPinned ? -1 : 1);
    this.tileStates.update(dict => {
      
      movRange.forEach(coord => {
        const state: ITileState = dict[coord.asText] ?? this.getEmptyTileState();
        state.movement = Math.max(0, state.movement + modifier);

        dict[coord.asText] = state;
      });

      atkRange.forEach(coord => {
        const state: ITileState = dict[coord.asText] ?? this.getEmptyTileState();
        state.attack = Math.max(0, state.attack + modifier);

        dict[coord.asText] = state;
      });

      utilRange.forEach(coord => {
        const state: ITileState = dict[coord.asText] ?? this.getEmptyTileState();
        state.utility = Math.max(0, state.utility + modifier);

        dict[coord.asText] = state;
      });

      return {...dict};
    });

    return !isPinned;
  }

  /** @returns The current pinned state of `unitName` */
  public getPinnedStateForUnit(unitName: string) : boolean {
    return this.uPinStates()[unitName] ?? false;
  }

  /** Unpins all units and resets the unit range values for tile states. */
  public unpinAllUnits() {
    this.uPinStates.set({});

    //Reset the state of all tiles
    this.tileStates.update(dict => {
      Object.keys(dict).forEach(coord => {
        const state: ITileState = dict[coord] ?? this.getEmptyTileState();
        state.movement = 0;
        state.attack = 0;
        state.utility = 0;

        dict[coord] = state;
      });

      return {...dict};
    });
  }

  /**
   * Flips `tileObject`'s pinned state and updates tile states for its attack range, if it has one.
   * 
   * @returns Tile object's updated pinned state 
   */
  public toggleTileObjectPinnedState(tileObject: ITileObjectInstance) : boolean {
    const isPinned: boolean = this.getPinnedStateForTileObject(tileObject.id);

    this.toPinStates.update(dict => {
      dict[tileObject.id] = !isPinned;
      return {...dict};
    });

    //Update tile states based on tile object's ranges
    const atkRange: ICoordinate[] = tileObject.attackRange ?? [];

    if (atkRange.length > 0) {
      const modifier: number = (isPinned ? -1 : 1);
      this.tileStates.update(dict => {
        
        atkRange.forEach(coord => {
          const state: ITileState = dict[coord.asText] ?? this.getEmptyTileState();
          state.tileObjectAtk = Math.max(0, state.tileObjectAtk + modifier);

          dict[coord.asText] = state;
        });

        return {...dict};
      });
    }

    return !isPinned;
  }

  /** @returns The current pinned state for the tile object with `id`. */
  public getPinnedStateForTileObject(id: number) : boolean {
    return this.toPinStates()[id] ?? false;
  }

  /** @returns The current tile state for the tile at `coordinate`. */
  public getStateForTile(coordinate: ICoordinate) : ITileState {
    return this.tileStates()[coordinate.asText] ?? this.getEmptyTileState();
  }

  /** Returns a new `ITileState` with all values set to 0. */
  private getEmptyTileState(): ITileState {
    return {
      movement: 0,
      attack: 0,
      utility: 0,
      tileObjectAtk: 0
    }
  }

  // #endregion Pin Actions

  // #region Selected Segment and Tile  

  private segment = signal<IMapSegment | undefined>(undefined);
  public readonly selectedSegment = this.segment.asReadonly();

  private tile = signal<ITile | undefined>(undefined);
  public readonly highlightedTile = this.tile.asReadonly();

  public updateSelectedSegment(segment: IMapSegment) {
    this.segment.set(segment);
  }

  public updateHighlightedTile(tile: ITile) {
    //Don't update if this is already the current tile
    if (this.tile()?.coordinate.x == tile.coordinate.x
     && this.tile()?.coordinate.y == tile.coordinate.y)
     return;

    this.tile.set(tile);
  }

  // #endregion Selected Segment and Tile

  // #region Paint Mode

  @Output() downloadMapAsImage = new EventEmitter<void>();
  @Output() clearPaintContainer = new EventEmitter();
  @Output() undoLastPaintContainerLine = new EventEmitter();

  private paintMode = signal<boolean>(false);
  public inPaintMode = this.paintMode.asReadonly();

  private penColor = signal<string>('#000000');
  public drawingPenColor = this.penColor.asReadonly();

  private penWidth = signal<number>(2);
  public drawingPenWidth = this.penWidth.asReadonly();

  public triggerMapImageDownload() {
    this.downloadMapAsImage.emit();
  }

  public updatePaintMode(inPaintMode: boolean) {
    //Don't trigger an update if the mode is not changing
    if (this.paintMode() === inPaintMode) return;

    this.paintMode.set(inPaintMode);
  }

  public setPenColor(colorCode: string) {
    this.penColor.set(colorCode);
  }

  public setPenWidth(width: number) {
    this.penWidth.set(width);
  }

  public eraseAllPaint() {
    if (confirm("Are you sure you want to clear all paint on the screen?"))
      this.clearPaintContainer.emit();
  }

  public undoLastLine() {
    this.undoLastPaintContainerLine.emit();
  }

  // #endregion Paint Mode
}

export interface ITileState {
  movement: number,
  attack: number,
  utility: number,
  tileObjectAtk: number
}