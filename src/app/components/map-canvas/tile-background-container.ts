import { Container, Graphics } from "pixi.js";
import { ITileState, MapEventService } from "../../services/map-event-service";
import { effect, inject, Injector, runInInjectionContext } from "@angular/core";
import { ICoordinate } from "../../data/interfaces/map/coordinate";

export class TileBackgroundContainer extends Container {
    
  //Constants
  private readonly RANGE_MOV_COLOR: string = "#5cb4ef";
  private readonly RANGE_ATK_COLOR: string = "#d81b62";
  private readonly RANGE_UTIL_COLOR: string = "#9dff00";

  //Internal attributes
  private tintGraphic: Graphics;
  private strokeGraphic: Graphics;

  constructor(private readonly injector: Injector, private readonly coordinate: ICoordinate, private readonly dimensions: number) {
    super({ 
      label: `${coordinate.asText} background`,
      visible: false,
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none'
    });

    this.tintGraphic = this.createTint();
    this.strokeGraphic = this.createStroke();

    this.addChild(this.tintGraphic, this.strokeGraphic);

    //Watch for tile state changes
    runInInjectionContext(injector, () => {
      const eventService = inject(MapEventService);

      effect(() => {
        const state: ITileState = eventService.getStateForTile(coordinate);
        this.updateState(state);
      });
    });
  }

  private createTint() : Graphics {
    return new Graphics({
      visible: false,
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none'
    })
    .rect(1, 1, this.dimensions-1, this.dimensions-1)
    .fill({
      color: "#ffffff",
      alpha: 0.5
    });
  }

  private createStroke() : Graphics {
    return new Graphics({
      visible: false,
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none'
    })
    .rect(2, 1, this.dimensions-2, this.dimensions-2)
    .stroke({
      width: 1,
      color: "#ffffff",
      pixelLine: true
    });
  }

  /** Updates the background tint color and background stroke according to `state`. */
  private updateState(state: ITileState) {
    let tint: string = "";
    if (state.movement > 0) { tint = this.RANGE_MOV_COLOR; }
    else if (state.attack > 0) { tint = this.RANGE_ATK_COLOR; }
    else if (state.utility > 0) { tint = this.RANGE_UTIL_COLOR; }

    //If we picked a tint color, update
    if(tint.length > 0) {
      this.tintGraphic.tint = tint;
      this.tintGraphic.visible = true;
    }
    else {
      this.tintGraphic.visible = false;
    }

    //Check if we should also apply a stroke
    const showStroke: boolean = state.tileObjectAtk > 0;
    this.strokeGraphic.visible = showStroke;

    //Update overall container visibility
    this.visible = (this.tintGraphic.visible || this.strokeGraphic.visible);
  }
}