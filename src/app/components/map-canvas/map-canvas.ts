import { initDevtools } from '@pixi/devtools';
import { Application, Assets, ImageLike, TextureSource } from 'pixi.js';
import { Component, effect, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { IMapSegment } from '../../data/interfaces/map/map-segment';
import { TeamDataService } from '../../services/team-data-service';
import { StringDictionary } from '../../data/interfaces/common/dictionaries';
import { MapEventService } from '../../services/map-event-service';
import { SegmentContainer } from './segment-container';
import { PaintContainer } from './paint-container';
import { ITile } from '../../data/interfaces/map/tile';

@Component({
  selector: 'map-canvas',
  imports: [],
  template: `<div id="pixiContainer"></div>`,
  styles: `
    #pixiContainer {
      height: calc(100vh - 56px);
      width: 100%;
      overflow: auto;
    }
  `,
})
export class MapCanvas implements OnInit, OnDestroy {

  //Constants
  private readonly PAINT_CONTAINER_Z_INDEX: number = 1;

  //Internal attributes
  private readonly injector: Injector;
  private readonly pixiApp : Application;

  private segmentContainers : StringDictionary<SegmentContainer> = {};
  private paintContainers: StringDictionary<PaintContainer> = {};
  private activeSegment: SegmentContainer | undefined;
  private activePaintContainer: PaintContainer | undefined;

  constructor(private readonly teamDataService: TeamDataService, private readonly eventService: MapEventService) {
    this.injector = inject(Injector);
    this.teamDataService = inject(TeamDataService);
    this.eventService = inject(MapEventService);
    
    this.pixiApp = new Application();

    //Subscribe to external events
    this.eventService.downloadMapAsImage
      .subscribe(() => this.downloadMapAsImage());
    this.eventService.clearPaintContainer
      .subscribe(() => this.activePaintContainer?.clearGraphicsBuffer());
    this.eventService.undoLastPaintContainerLine
      .subscribe(() => this.activePaintContainer?.destroyLatestGraphic());

    //Watch for changes in the selected segment
    effect(() => {
      this.updateActiveSegment(this.eventService.selectedSegment());
    });

    //Watch for changes in the selected tile
    effect(() => {
      this.updateCanvasTitle(this.eventService?.highlightedTile());
    });

    //Watch for changes in the paint mode
    effect(() => {
      const paintMode: boolean = this.eventService.inPaintMode();
      this.updatePaintState(paintMode);
    });
  }

  async ngOnInit() {
    const pixiContainer: HTMLElement | null = document.getElementById("pixiContainer");
    if(pixiContainer === null) {
      console.error("Failed to find container for PixiJS canvas.");
      return;
    }

    //Set global preferences
    TextureSource.defaultOptions.scaleMode = 'nearest'; //render sprites crisp
    await Assets.setPreferences({
      crossOrigin: '*'
    });

    await Promise.all([
      this.loadCommonAssets(),
      this.initializePixiApp(pixiContainer)
    ]);

    await Promise.all([
      this.createSegmentContainers(),
      this.createPaintContainers()
    ]);
    
    this.updateActiveSegment(this.eventService.selectedSegment());
  }

  ngOnDestroy() {
    //Completely destroys the canvas, all children, etc.
    this.pixiApp.destroy(true, true);
  }

  /** Loads common sprites from the `img` folder. */
  private async loadCommonAssets() {
    //Unit number sprites
    Assets.addBundle('unit-numbers', [
      { alias: '0', src: 'img/numbers/num_0.png' },
      { alias: '1', src: 'img/numbers/num_1.png' },
      { alias: '2', src: 'img/numbers/num_2.png' },
      { alias: '3', src: 'img/numbers/num_3.png' },
      { alias: '4', src: 'img/numbers/num_4.png' },
      { alias: '5', src: 'img/numbers/num_5.png' },
      { alias: '6', src: 'img/numbers/num_6.png' },
      { alias: '7', src: 'img/numbers/num_7.png' },
      { alias: '8', src: 'img/numbers/num_8.png' },
      { alias: '9', src: 'img/numbers/num_9.png' }
    ]);

    Assets.addBundle('assorted', [
      { alias: 'tile_cursor', src: 'img/tile_cursor.png' },
      { alias: 'status_heart', src: 'img/status_heart.png' }
    ]);

    await Assets.loadBundle(['unit-numbers', 'assorted']);
  }

  /**
   * Initializes `pixiApp` and appends its resulting canvas as a child of the `appContainer` element.
   *  
   * @param appContainer - The HTML element that will contain the Pixi.JS canvas
  */
  private async initializePixiApp(appContainer: HTMLElement) {
    await this.pixiApp.init({ 
      backgroundAlpha: 0
    });

    this.pixiApp.canvas.id = 'pixiCanvas';
    this.pixiApp.canvas.style.touchAction = "auto"; //allows mobile users to scroll

    appContainer.appendChild(this.pixiApp.canvas);
  }

  /** Creates a new `SegmentContainer` per map segment and adds them to the stage. */
  private async createSegmentContainers() {
    const segments: IMapSegment[] = this.teamDataService.mapData().map?.segments ?? [];

    //Create segments in parallel
    await Promise.all(segments.map(async segment => {
      try {
        const container: SegmentContainer = new SegmentContainer(this.injector, segment);
        await container.init();

        //Add container to tracking dictionary
        this.segmentContainers[segment.title] = container;

        //Add segment to stage and make it invisible by default
        container.hide();
        this.pixiApp.stage.addChild(container);
      }
      catch (error) {
        //Prevent an error in one container from crashing the display
        console.error(error);
      }
    }));
  }

  private async createPaintContainers() {
    const segments: IMapSegment[] = this.teamDataService.mapData().map?.segments ?? [];

    //Create segments in parallel
    await Promise.all(segments.map(async segment => {
      try {
        const container: PaintContainer = new PaintContainer(this.injector, segment.heightInPixels, segment.widthInPixels);
        container.zIndex = this.PAINT_CONTAINER_Z_INDEX;
        container.hide();

        this.paintContainers[segment.title] = container;
        this.pixiApp.stage.addChild(container);
      }
      catch (error) {
        //Prevent an error in one container from crashing the display
        console.error(error);
      }
    }));
  }

  private updateActiveSegment(segment: IMapSegment | undefined) {
    if(segment === undefined) return;

    const container: SegmentContainer = this.segmentContainers[segment.title];
    if(container === undefined) return;

    //If there is a current active segment, inactivate it first
    this.activeSegment?.hide();
    this.activePaintContainer?.hide();

    //Update the active segment
    this.activeSegment = container;
    this.activeSegment.show();
    this.updatePaintState(this.eventService?.inPaintMode() ?? false);

    //Resize canvas to this new segment
    this.pixiApp.renderer.resize(
      container.segment.widthInPixels,
      container.segment.heightInPixels
    );
  }

  private updateCanvasTitle(tile: ITile | undefined) {
    if (tile === undefined) return;

    let title: string = `[${tile.coordinate.asText}] ${tile.terrainType}`;

    const unitName: string = tile.unitData.occupyingUnitName ?? "";
    if (unitName.length > 0)
      title += ` | ${unitName}`;

    this.pixiApp.canvas.title = title;
  }

  private updatePaintState(inPaintMode: boolean) {
    if (this.activeSegment === undefined)
      return;

    if (inPaintMode) {
      const segmentName: string = this.activeSegment.segment.title ?? "";
      if (segmentName.length < 1) return;

      this.activePaintContainer = this.paintContainers[segmentName];
      this.activePaintContainer?.show();
      this.activeSegment.allowInteraction(false);

      this.pixiApp.canvas.style.touchAction = "none"; //prevent scrolling on mobile so users can paint
    }
    else {
      this.activePaintContainer?.hide();
      this.activePaintContainer = undefined;
      this.activeSegment.allowInteraction(true);

      this.pixiApp.canvas.style.touchAction = "auto"; //allow mobile users to scroll
    }
  }

  /** Triggers the browser to download the current canvas stage as a PNG */
  private async downloadMapAsImage() {
    const blob: ImageLike = await this.pixiApp.renderer.extract.image({
      target: this.pixiApp.stage,
      format: 'png'
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = blob.src;
    downloadLink.download = `${this.activeSegment?.label ?? 'Map'}.png`;
    downloadLink.click();
    downloadLink.remove();
  }
}