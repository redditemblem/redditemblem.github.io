import { inject, Injector, runInInjectionContext } from "@angular/core";
import { Container, Graphics } from "pixi.js";
import { IMapSegment } from "../../data/interfaces/map/map-segment";
import { IMapConstants } from "../../data/interfaces/map/map-constants";
import { MapAnalysisDataService } from "../../services/map-analysis-data-service";
import { MapAnalysisEventService } from "../../services/map-analysis-event-service";
import { SpriteLoader } from "../map-canvas/sprite-loader";
import { SpriteFilters } from "../map-canvas/sprite-filters";
import { TileAnalysisBackgroundContainer } from "./tile-analysis-background-container";

export class SegmentAnalysisContainer extends Container {

  //Internal attributes
  private analysisDataService: MapAnalysisDataService | undefined;
  private eventService: MapAnalysisEventService | undefined;

  private readonly tileDimensions: number;
  private readonly tileDimensionCenter: number;
  private readonly hasTopLeftHeaders: boolean;
  private readonly hasBottomRightHeaders: boolean;

  constructor(private readonly injector: Injector, public readonly segment: IMapSegment) {
    super({
      label: segment.title,
      height: segment.heightInPixels,
      width: segment.widthInPixels
    });

    let constants: IMapConstants | undefined;
    runInInjectionContext(injector, () => {
      this.analysisDataService = inject(MapAnalysisDataService);
      this.eventService = inject(MapAnalysisEventService);

      constants = this.analysisDataService.getMapConstants();
    });

    this.tileDimensions = (constants?.tileSize ?? 16);
    this.tileDimensionCenter = Math.floor(this.tileDimensions / 2);
    this.hasTopLeftHeaders = (constants?.hasHeaderTopLeft ?? false);
    this.hasBottomRightHeaders = (constants?.hasHeaderBottomRight ?? false);
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

        const background: TileAnalysisBackgroundContainer = new TileAnalysisBackgroundContainer(this.injector, tile, this.tileDimensions);
        background.position.set(tileXPos, tileYPos);
        this.addChild(background);
      }))
    }));
  }
  
  /** Makes the segment visible. */
  public show() {
    this.visible = true;
  }
  
  /** Hides the segment. */
  public hide() {
    this.visible = false;
  }
}