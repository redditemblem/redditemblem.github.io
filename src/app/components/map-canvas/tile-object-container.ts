import { inject, Injector, runInInjectionContext } from "@angular/core";
import { Container, FillGradient, Filter, Graphics, Sprite } from "pixi.js";
import { TeamDataService } from "../../services/team-data-service";
import { ITileObjectInstance } from "../../data/interfaces/map/tile-object-instance";
import { IMapConstants } from "../../data/interfaces/map/map-constants";
import { ITileObject } from "../../data/interfaces/system/tile-object";
import { StringDictionary } from "../../data/interfaces/common/dictionaries";
import { SpriteLoader } from "./sprite-loader";
import { SpriteFilters } from "./sprite-filters";
import { TileObjectHpBar } from "../tile-object-hp-bar/tile-object-hp-bar";
import { IHpBarColorSet } from "../unit-hp-bar/unit-hp-bar";

export class TileObjectContainer extends Container {

    //Constants
    private readonly OVERLAY_Z_INDEX: number = 1;

    private readonly PINNED_FILTER: string = "pinned";
    private readonly BRIGHT_FILTER: string = "bright";

    //Internal attributes
    private teamDataService: TeamDataService | undefined;

    public tileObject: ITileObject | undefined;
    public objectDimensions: number = 0;

    public sprite: Sprite | undefined;
    private activeSpriteFilters: StringDictionary<Filter> = {};

  constructor(private readonly injector: Injector, public readonly tileObjectInstance: ITileObjectInstance) {
    super({
      label: `tile object ${tileObjectInstance.id}`,
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none'
    });

    runInInjectionContext(injector, () => {
      this.teamDataService = inject(TeamDataService);
    });
  }

  public async init() {
    this.tileObject = this.teamDataService?.getTileObjectByName(this.tileObjectInstance.name);
    if (this.tileObject === undefined) {
      console.error(`Failed to locate tile object name ${this.tileObjectInstance.name}.`);
      return;
    }

    const constants: IMapConstants | undefined = this.teamDataService?.getMapConstants();
    const tileDimensions: number = (constants?.tileSize ?? 16);
    this.objectDimensions = tileDimensions * (this.tileObject.size ?? 1);

    await Promise.all([
      this.loadTileObjectSprite(),
      this.renderHealthBar()
    ]);
  }

  private async loadTileObjectSprite() {
    if (this.tileObject === undefined) return;

    const url: string = this.tileObject.spriteURL ?? "";
    const assetAlias: string = `tile object ${this.tileObject.name}`;
    this.sprite = await SpriteLoader.getExternalSpriteByExtension(assetAlias, url);

    //If we failed to load the object's sprite, use a placeholder instead
    if (this.sprite === undefined) {
      const rect = new Graphics()
          .rect(0, 0, this.objectDimensions, this.objectDimensions)
          .fill(SpriteFilters.missingSpriteFill);
      this.addChild(rect);

      return;
    }

    this.addChild(this.sprite);
    this.sprite.label = 'tile_object_sprite';
    this.sprite.anchor.set(0.5); //manipulate sprite relative to its center
    this.sprite.position.set(this.objectDimensions / 2); //horizontal + vertical centers
  }

  private async renderHealthBar() {
    if (this.tileObjectInstance === undefined) return;

    //If hp percentage is undefined, then this tile object doesn't need a health bar
    const percentage: number | undefined = this.tileObjectInstance.hp?.percentage;
    if (percentage === undefined) return;

    const healthBarGradient = this.getHealthBarGradient(percentage);
    const healthBar = new Graphics({ zIndex: this.OVERLAY_Z_INDEX })
      .rect(2, this.objectDimensions - 4, this.objectDimensions - 2, 3)
      .fill(healthBarGradient)
      .stroke({ width: 1, color: 0x000000, pixelLine: true });

    this.addChild(healthBar);
  }

  /**
   * Determine the colors codes appropriate for the tile object's current `hpPercentage`.
   * 
   * @returns A new FillGradient containing a linear left-right gradient
   */
  private getHealthBarGradient(hpPercentage: number) : FillGradient { 
    //Primary and secondary color hexes should match the ones from tile-object-hp-bar.ts
    const colorSet: IHpBarColorSet = TileObjectHpBar.getHpBarColorSet(hpPercentage);

    //Prevent overfilled HP from going above 1.0
    const hpFraction = Math.min(hpPercentage / 100, 1.0);

    return new FillGradient({
      type: 'linear',
      start: { x: 0, y: 0.5 }, //linear left-to-right gradient
      end: { x: 1, y: 0.5 },
      colorStops: [
        //Transition colors immediately at the hpFraction
        { offset: hpFraction, color: colorSet.primary },
        { offset: hpFraction, color: colorSet.secondary },
      ]
    });
  }

  // #region Event Handling

  public pinTileObject() {
    if(this.sprite === undefined) return;

    this.activeSpriteFilters[this.PINNED_FILTER] = SpriteFilters.getUnitPinnedFilter();
    this.sprite.filters = Object.values(this.activeSpriteFilters);
  }

  public unpinTileObject() {
    if(this.sprite === undefined) return;

    delete this.activeSpriteFilters[this.PINNED_FILTER];
    this.sprite.filters = Object.values(this.activeSpriteFilters);
  }

  public onPointerEnter() {
    if(this.sprite === undefined) return;

    this.activeSpriteFilters[this.BRIGHT_FILTER] = SpriteFilters.getBrightFilter();
    this.sprite.filters = Object.values(this.activeSpriteFilters);
  }

  public onPointerLeave() {
    if(this.sprite === undefined) return;

    delete this.activeSpriteFilters[this.BRIGHT_FILTER];
    this.sprite.filters = Object.values(this.activeSpriteFilters);
  }

  // #endregion Event Handling
}