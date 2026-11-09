import { Component, effect, inject, Injector, OnDestroy, OnInit } from '@angular/core';
import { MapAnalysisDataService } from '../../services/map-analysis-data-service';
import { MapAnalysisEventService } from '../../services/map-analysis-event-service';
import { Application, Assets, TextureSource } from 'pixi.js';
import { IMapSegment } from '../../data/interfaces/map/map-segment';
import { SegmentAnalysisContainer } from './segment-analysis-container';
import { StringDictionary } from '../../data/interfaces/common/dictionaries';

@Component({
  selector: 'map-analysis-canvas',
  imports: [],
  template: `<div id="scrollbox"><div id="pixiContainer"></div></div>`,
  styles: `
    #scrollbox {
      height: calc(100vh - 56px);
      width: 100%;
      overflow: auto;
    }
    #pixiContainer {
      padding-right: 56px;
    }
  `,
})
export class MapAnalysisCanvas implements OnInit, OnDestroy {

  //Internal attributes
  private readonly injector: Injector;
  private readonly pixiApp : Application;

  private segmentContainers : StringDictionary<SegmentAnalysisContainer> = {};
  private activeSegment: SegmentAnalysisContainer | undefined;

  constructor(private readonly analysisDataService: MapAnalysisDataService, private readonly eventService: MapAnalysisEventService) {
    this.injector = inject(Injector);
    this.analysisDataService = inject(MapAnalysisDataService);
    this.eventService = inject(MapAnalysisEventService);

    this.pixiApp = new Application();

    //Watch for changes in the selected segment
    effect(() => {
      this.updateActiveSegment(this.eventService.selectedSegment());
    });

    //Watch for changes in the zoom level
    effect(() => {
      this.updateZoomLevel(this.eventService.zoomLevel());
    })
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

    await this.initializePixiApp(pixiContainer);
    await this.createSegmentContainers();
    
    this.updateActiveSegment(this.eventService.selectedSegment());
  }

  ngOnDestroy() {
    //Completely destroys the canvas, all children, etc.
    this.pixiApp.destroy(true, true);
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

  /** Creates a new `SegmentAnalysisContainer` per map segment and adds them to the stage. */
  private async createSegmentContainers() {
    const segments: IMapSegment[] = this.analysisDataService.mapData().map?.segments ?? [];

    //Create segments in parallel
    await Promise.all(segments.map(async segment => {
      try {
        const container: SegmentAnalysisContainer = new SegmentAnalysisContainer(this.injector, segment);
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

  private updateActiveSegment(segment: IMapSegment | undefined) {
    if(segment === undefined) return;

    const container: SegmentAnalysisContainer = this.segmentContainers[segment.title];
    if(container === undefined) return;

    //If there is a current active segment, inactivate it first
    this.activeSegment?.hide();

    //Update the active segment
    this.activeSegment = container;
    this.activeSegment.show();

    //Resize containing div + canvas to this new segment
    const zoomLevel: number = this.eventService.zoomLevel() ?? 1.0;
    const width: number = Math.ceil(container.segment.widthInPixels * zoomLevel);
    const height: number = Math.ceil(container.segment.heightInPixels * zoomLevel);

    this.pixiApp.renderer.resize(width, height);

    const pixiContainer: HTMLElement | null = document.getElementById("pixiContainer");
    if (pixiContainer !== null) {
      pixiContainer.style.height = `${height}px`;
      pixiContainer.style.width = `${width}px`;
    }
  }

  private updateZoomLevel(zoomLevel: number) {
    this.pixiApp.stage.scale.set(zoomLevel);
    
    //Resize div + canvas to new scale
    const width: number = Math.ceil((this.activeSegment?.segment.widthInPixels ?? 0) * zoomLevel);
    const height: number = Math.ceil((this.activeSegment?.segment.heightInPixels ?? 0) * zoomLevel);
    if (width > 0 && height > 0) {
      this.pixiApp.renderer.resize(width, height);

      const pixiContainer: HTMLElement | null = document.getElementById("pixiContainer");
      if (pixiContainer !== null) {
        pixiContainer.style.height = `${height}px`;
        pixiContainer.style.width = `${width}px`;
      }
    }
  }
}
