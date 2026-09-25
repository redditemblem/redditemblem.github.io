import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { IMapSegment } from "../../data/interfaces/map/map-segment";
import { MapEventService } from "../../services/map-event-service";
import { TeamDataService } from "../../services/team-data-service";
import { TileContainer } from "./tile-container";
import { SpriteLoader } from "./sprite-loader";
import { TileCursorSprite } from "./tile-cursor-sprite";
import { inject, Injector, runInInjectionContext } from "@angular/core";
import { IMapConstants } from "../../data/interfaces/map/map-constants";
import { StringDictionary } from "../../data/interfaces/common/dictionaries";
import { TileBackgroundContainer } from "./tile-background-container";
import { ITileObjectInstance } from "../../data/interfaces/map/tile-object-instance";
import { ICoordinate } from "../../data/interfaces/map/coordinate";
import { ITile } from "../../data/interfaces/map/tile";
import { SpriteFilters } from "./sprite-filters";

export class SegmentContainer extends Container {
  
  //Constants
  private readonly OVERLAY_Z_INDEX: number = 10000;

  //Internal attributes
  private teamDataService: TeamDataService | undefined;
  private eventService: MapEventService | undefined;

  private readonly tileDimensions: number;
  private readonly tileDimensionCenter: number;
  private readonly hasTopLeftHeaders: boolean;
  private readonly hasBottomRightHeaders: boolean;

  private tileCursor: TileCursorSprite;
  private tileContainers: StringDictionary<TileContainer> = {};

  constructor(private readonly injector: Injector, public readonly segment: IMapSegment) {
    super({
      label: segment.title,
      height: segment.heightInPixels,
      width: segment.widthInPixels
    });

    let constants: IMapConstants | undefined;
    runInInjectionContext(injector, () => {
      this.teamDataService = inject(TeamDataService);
      this.eventService = inject(MapEventService);

      constants = this.teamDataService.getMapConstants();
    });

    this.tileDimensions = (constants?.tileSize ?? 16);
    this.tileDimensionCenter = Math.floor(this.tileDimensions / 2);
    this.hasTopLeftHeaders = (constants?.hasHeaderTopLeft ?? false);
    this.hasBottomRightHeaders = (constants?.hasHeaderBottomRight ?? false);

    //Create tile cursor
    this.tileCursor = new TileCursorSprite(this.tileDimensions);
    this.tileCursor.zIndex = this.OVERLAY_Z_INDEX;
    this.addChild(this.tileCursor);

    //Subscribe to events
    this.on('pointermove', this.SegmentContainer_PointerMove_PointerTap);
    this.on('pointertap', this.SegmentContainer_PointerMove_PointerTap);
  }

  public async init() {
    //Load the segment's background. Don't use an alias here, as segments with the same name (i.e. "Segment 1")
    //will load a cached image when swapping between teams w/o reloading the app
    const segmentBackground = await SpriteLoader.getExternalSpriteByExtension("", this.segment.imageURL);
    if(segmentBackground !== undefined) {
      this.addChild(segmentBackground);
    }
    else {
      //If we fail to load the background image, fill with gray.
      const background: Graphics = new Graphics()
        .rect(0, 0, this.segment.widthInPixels, this.segment.heightInPixels)
        .fill(SpriteFilters.missingSpriteFill);
      this.addChild(background);
    }

    //Load all tiles in parallel
    const segmentXOffset: number = this.segment.horizontalTileRangeWithinMap.start.value - 1;
    await Promise.all(this.segment.tiles.map(async row => {
      await Promise.all(row.map(async tile =>
      {
        const tileXPos = this.tileDimensions * (tile.coordinate.x - this.segment.horizontalTileRangeWithinMap.start.value + (this.hasTopLeftHeaders ? 1 : 0));
        const tileYPos = this.tileDimensions * ((tile.coordinate.y - 1) + (this.hasTopLeftHeaders ? 1 : 0));

        //Always create a background for the tile
        const background: TileBackgroundContainer = new TileBackgroundContainer(this.injector, tile.coordinate, this.tileDimensions);
        background.position.set(tileXPos, tileYPos);
        this.addChild(background);

        //Conditionally create a tile container only if there is some child to put in it
        const hasTileObject: boolean = (tile.tileObjectInstanceIDs ?? []).some(id => {
          const objInst: ITileObjectInstance | undefined = this.teamDataService?.getTileObjectInstanceByID(id, tile.coordinate);
          return objInst !== undefined && objInst.anchorCoordinate.x === tile.coordinate.x && objInst.anchorCoordinate.y === tile.coordinate.y;
        });
        const hasUnit: boolean = (tile.unitData.occupyingUnitName ?? "").length > 0 && tile.unitData.isUnitAnchor;

        if (hasTileObject || hasUnit) {
          const tileContainer : TileContainer = new TileContainer(this.injector, tile, this.segment.widthInTiles, segmentXOffset);
          await tileContainer.init();
          
          tileContainer.position.set(tileXPos, tileYPos);

          this.tileContainers[tile.coordinate.asText] = tileContainer;
          this.addChild(tileContainer);
        }
      }))
    }));
  }

  /** Enables interaction and makes the segment visible. */
  public show() {
    this.visible = true;
    this.allowInteraction(true);
  }

  /** Completely disables interaction and hides the segment. */
  public hide() {
    this.visible = false;
    this.allowInteraction(false);
  }

  public allowInteraction(canInteract: boolean) {
    this.interactive = canInteract;
    this.interactiveChildren = canInteract;
    this.tileCursor.visible = false;
  }

  // #region Event Handling

  private SegmentContainer_PointerMove_PointerTap(event: FederatedPointerEvent) {
    const xNumTiles = Math.floor(event.screen.x / this.tileDimensions);
    const yNumTiles = Math.floor(event.screen.y / this.tileDimensions);

    //Hide cursor on headers/footers
    if( (this.hasTopLeftHeaders && (xNumTiles < 1 || yNumTiles < 1))
     || xNumTiles > this.segment.widthInTiles 
     || yNumTiles > this.segment.heightInTiles ) 
    {
      this.tileCursor.visible = false;
      return;
    }

    this.tileCursor.visible = true;
    this.tileCursor.position.set(
      xNumTiles * this.tileDimensions + this.tileDimensionCenter,
      yNumTiles * this.tileDimensions + this.tileDimensionCenter
    );
    this.updateCurrentTile(xNumTiles, yNumTiles);
  }

  private updateCurrentTile(x: number, y: number) {
    x += this.segment.horizontalTileRangeWithinMap.start.value - (this.hasTopLeftHeaders ? 1 : 0);
    y += (this.hasTopLeftHeaders ? 0 : 1);

    const coord: ICoordinate = { x: x, y: y, asText: '' };
    const tile: ITile | undefined = this.teamDataService?.getTileByCoordinate(coord);
    
    if (tile !== undefined)
      this.eventService?.updateHighlightedTile(tile);
  }

  // #endregion Event Handling
}