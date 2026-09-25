import { Container, FederatedPointerEvent, Graphics } from "pixi.js";
import { MapEventService } from "../../services/map-event-service";
import { inject, Injector, runInInjectionContext } from "@angular/core";

export class PaintContainer extends Container {

  private eventService: MapEventService | undefined;

  private userIsDrawing: boolean = false;
  private currentLine: Graphics | undefined;
  private graphicsBuffer: Graphics[] = [];

  constructor(private readonly injector: Injector, private readonly segmentHeight: number, private readonly segmentWidth: number) {
    super({
      label: "Paint Canvas",
      height: segmentHeight,
      width: segmentWidth
    });

    runInInjectionContext(injector, () => {
      this.eventService = inject(MapEventService);
    });

    //Without a child, the container collapses to 0 height and width
    const rect = new Graphics()
      .rect(0, 0, segmentWidth, segmentHeight)
      .fill({
        color: '#ffffff',
        alpha: 0
      });
    this.addChild(rect);

    this.on('pointerdown', this.PaintContainer_PointerDown);
    this.on('pointermove', this.PaintContainer_PointerMove);
    this.on('pointerup', this.PaintContainer_PointerUp);
    this.on('pointerupoutside', this.PaintContainer_PointerUp)
  }

  /** Makes the container visible and enables interaction. */
  public show() {
    this.visible = true;
    this.interactive = true;
    this.interactiveChildren = true;
    this.eventMode = 'static';
  }

  /** Makes the container invisible and disables interaction. */
  public hide() {
    this.visible = false;
    this.interactive = false;
    this.interactiveChildren = false;
    this.eventMode = 'none';
  }

  public async clearGraphicsBuffer() {
    //Destroy all graphics in parallel
    await Promise.all(this.graphicsBuffer.map(async(graphic) => {
      graphic?.destroy();
    }));

    //Flush the buffer
    this.graphicsBuffer = [];
  }

  public async destroyLatestGraphic() {
    const latestGraphic = this.graphicsBuffer.pop();
    latestGraphic?.destroy();
  }

  // #region Event Handlers

  private PaintContainer_PointerDown(event: FederatedPointerEvent) {
    this.userIsDrawing = true;

    const newLine = new Graphics({
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none'
    });
    newLine.moveTo(event.screen.x, event.screen.y);

    this.currentLine = newLine;
    this.graphicsBuffer.push(newLine);
    this.addChild(newLine);
  }

  private PaintContainer_PointerMove(event: FederatedPointerEvent) {
    if(!this.userIsDrawing) return;
    this.currentLine?.lineTo(event.screen.x, event.screen.y)
      .stroke({
        color: this.eventService?.drawingPenColor(),
        width: this.eventService?.drawingPenWidth(),
        cap: 'round',
        join: 'round'
      });
  }

  private PaintContainer_PointerUp(event: FederatedPointerEvent) {
    this.userIsDrawing = false;

    //Check if we actually drew something, instead of just clicking on the canvas
    const lineHeight = this.currentLine?.height ?? 0;
    const lineWidth = this.currentLine?.width ?? 0;
    if(lineHeight < 1 || lineWidth < 1) {
      this.currentLine?.destroy();
      this.graphicsBuffer.pop();
    }
  }

  // #endregion Event Handlers
}