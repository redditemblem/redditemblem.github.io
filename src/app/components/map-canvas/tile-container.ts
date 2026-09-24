import { Container, FederatedPointerEvent, Rectangle } from "pixi.js";
import { UnitContainer } from "./unit-container";
import { MapEventService } from "../../services/map-event-service";
import { ITile } from "../../data/interfaces/map/tile";
import { effect, inject, Injector, runInInjectionContext } from "@angular/core";
import { TeamDataService } from "../../services/team-data-service";
import { IUnit } from "../../data/interfaces/unit/unit";
import { TileObjectContainer } from "./tile-object-container";
import { TileObjectLayer } from "../../data/interfaces/system/tile-object";
import { ITileObjectInstance } from "../../data/interfaces/map/tile-object-instance";

export class TileContainer extends Container {

  //Constants
  private readonly TILE_OBJECT_LOWER_Z_INDEX: number = 1;
  private readonly PAIRUP_UNIT_Z_INDEX: number = 2;
  private readonly UNIT_Z_INDEX: number = 3;
  private readonly TILE_OBJECT_UPPER_Z_INDEX = 4;

  //Internal attributes
  private teamDataService: TeamDataService | undefined;
  private eventService: MapEventService | undefined;

  private tileDimensions: number = 16;
  private hitAreaDimensions: number = 0;

  public unitContainer: UnitContainer | undefined;
  public pairupUnitContainer: UnitContainer | undefined;
  public interactiveTileObjects: TileObjectContainer[] = [];

  constructor(private readonly injector: Injector, public readonly tile: ITile, private readonly segmentWidth: number, private readonly segmentXOffset: number) {
    super({
      label: tile.coordinate.asText,
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none',
      zIndex: ((tile.coordinate.y - 1) * segmentWidth) + tile.coordinate.x - segmentXOffset
    });

    runInInjectionContext(injector, () => {
      this.teamDataService = inject(TeamDataService);
      this.eventService = inject(MapEventService);

      const constants = this.teamDataService.getMapConstants();
      this.tileDimensions = constants?.tileSize ?? 16;
    });
  }

  public async init() {
    await Promise.all([
      this.createTileObjectContainers(),
      this.createUnitContainers(),
    ]);
  }

  private async createTileObjectContainers() {
    const tileObjectIDs: number[] = this.tile.tileObjectInstanceIDs ?? [];
    if (tileObjectIDs.length < 1) return;

    const containers: (TileObjectContainer | undefined)[] = await Promise.all(tileObjectIDs.map(async id => 
    {
      //Attempt to load the tile object by its id
      const tileObjectInst: ITileObjectInstance | undefined = this.teamDataService?.getTileObjectInstanceByID(id, this.tile.coordinate);
      if(tileObjectInst === undefined) {
          console.error(`Failed to locate tile object instance id ${id}.`);
          return undefined;
      }

      //Only render from the anchor coordinate
      if (tileObjectInst.anchorCoordinate.x !== this.tile.coordinate.x || tileObjectInst.anchorCoordinate.y !== this.tile.coordinate.y)
        return undefined;

      const container = new TileObjectContainer(this.injector, tileObjectInst);
      await container.init();

      let zIndex: number;
      switch (container.tileObject?.layer ?? TileObjectLayer.Below) {
        case TileObjectLayer.Below: zIndex = this.TILE_OBJECT_LOWER_Z_INDEX; break;
        case TileObjectLayer.Above: zIndex = this.TILE_OBJECT_UPPER_Z_INDEX; break;
      }
      container.zIndex = zIndex;

      this.addChild(container);
      return container;
    }));

    //Add hit box for tile objects with an attack range
    this.interactiveTileObjects = containers.filter(c => c !== undefined).filter(c => (c.tileObjectInstance?.attackRange ?? []).length > 0);
    if (this.interactiveTileObjects.length > 0) {
      const maxDimensions: number = Math.max(...this.interactiveTileObjects.map(to => to.objectDimensions));
      this.createHitArea(maxDimensions);

      //Monitor for pinned status changes
      runInInjectionContext(this.injector, () => {
        effect(() => {
          this.interactiveTileObjects.forEach(to => {
            const isPinned: boolean = this.eventService?.getPinnedStateForTileObject(to.tileObjectInstance.id) ?? false;
            this.toggleTileObjectContainerPinnedStatus(to, isPinned);
          });
        });
      });
    }
  }

  /** Creates unit containers for all units on this tile. */
  private async createUnitContainers() {
    const occupyingUnitName: string = this.tile.unitData.occupyingUnitName ?? "";
    const pairUpUnitName: string = this.tile.unitData.pairedUnitName ?? "";

    //Only create units if this is a unit's anchor tile
    if(occupyingUnitName.length < 1 || !this.tile.unitData.isUnitAnchor)
      return;

    //Create unit containers in parallel
    const units = await Promise.all([
      this.createUnitContainer(occupyingUnitName, false),
      this.createUnitContainer(pairUpUnitName, true)
    ]);

    this.unitContainer = units[0];
    this.pairupUnitContainer = units[1];

    if (this.unitContainer !== undefined) {
      this.unitContainer.zIndex = this.UNIT_Z_INDEX;
      this.createHitArea(this.unitContainer.unitDimensions);
    }

    if (this.pairupUnitContainer !== undefined) {
      this.pairupUnitContainer.zIndex = this.PAIRUP_UNIT_Z_INDEX;

      //Offset both units' positions by 25%
      const offset: number = Math.floor(this.tileDimensions / 4);
      this.unitContainer?.position.set(offset, offset);
      this.pairupUnitContainer?.position.set(offset * -1, offset * -1);
    }

    runInInjectionContext(this.injector, () => {
      //Monitor for unit state changes
      effect(() => {
        let isPinned: boolean = this.eventService?.getPinnedStateForUnit(occupyingUnitName) ?? false;
        this.toggleUnitContainerPinnedStatus(this.unitContainer, isPinned);

        if (pairUpUnitName.length > 0) {
          isPinned = this.eventService?.getPinnedStateForUnit(pairUpUnitName) ?? false;
          this.toggleUnitContainerPinnedStatus(this.pairupUnitContainer, isPinned);
        }
      });
    });
  }

  /** Creates a new `UnitContainer` for `unitName` and adds it as a child. If `unitName` is an empty string, returns undefined instead. */
  private async createUnitContainer(unitName: string, isBackOfPair: boolean) : Promise<UnitContainer | undefined> {
    if(unitName.length < 1) return undefined;

    const unit: UnitContainer = new UnitContainer(this.injector, unitName, isBackOfPair);
    await unit.init();
    
    this.addChild(unit);
    return unit;
  }

  private createHitArea(dimensions: number) {
    //If we've already established a hit area for this tile, only replace it if this would be a larger hit area
    if (this.hitAreaDimensions >= dimensions) return;
    this.hitAreaDimensions = dimensions;

    this.interactive = true;
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.hitArea = new Rectangle(0, 0, dimensions, dimensions);
    
    this.on('pointerdown', this.TileContainer_PointerDown);
    this.on('pointerenter', this.TileContainer_OnPointerEnter);
    this.on('pointerleave', this.TileContainer_OnPointerLeave);
  }

  // #region Event Handlers

  private TileContainer_PointerDown(event: FederatedPointerEvent) {
    const unit: IUnit | undefined = this.unitContainer?.unit;
    if (unit !== undefined) {
      const isPinned: boolean = this.eventService?.toggleUnitPinnedState(unit) ?? false;
      if(isPinned)
        this.eventService?.switchDisplayedUnit(unit);
    }
    
    this.interactiveTileObjects.forEach(to => {
      this.eventService?.toggleTileObjectPinnedState(to.tileObjectInstance);
    });
  }

  private TileContainer_OnPointerEnter(event: FederatedPointerEvent) {
    this.unitContainer?.onPointerEnter();
    this.pairupUnitContainer?.onPointerEnter();
    this.interactiveTileObjects.forEach(to => to.onPointerEnter());
  }

  private TileContainer_OnPointerLeave(event: FederatedPointerEvent) {
    this.unitContainer?.onPointerLeave();
    this.pairupUnitContainer?.onPointerLeave();
    this.interactiveTileObjects.forEach(to => to.onPointerLeave());
  }

  private toggleUnitContainerPinnedStatus(container: UnitContainer | undefined, isPinned: boolean) {
    if (isPinned) container?.pinUnit();
    else container?.unpinUnit();
  }

  private toggleTileObjectContainerPinnedStatus(container: TileObjectContainer, isPinned: boolean) {
    if (isPinned) container?.pinTileObject();
    else container?.unpinTileObject();
  }

  // #endregion Event Handlers
}