import { Container, FillGradient, Filter, Graphics, Sprite } from "pixi.js";
import { SpriteFilters } from "./sprite-filters";
import { TeamDataService } from "../../services/team-data-service";
import { IUnit } from "../../data/interfaces/unit/unit";
import { StringDictionary } from "../../data/interfaces/common/dictionaries";
import { IMapConstants } from "../../data/interfaces/map/map-constants";
import { SpriteLoader } from "./sprite-loader";
import { IAffiliation } from "../../data/interfaces/system/affiliation";
import { IStatusCondition } from "../../data/interfaces/system/status-condition";
import { ITag } from "../../data/interfaces/system/tag";
import { inject, Injector, runInInjectionContext } from "@angular/core";
import { IHpBarColorSet, UnitHpBar } from "../unit-hp-bar/unit-hp-bar";

export class UnitContainer extends Container {

  //Constants
  /** Number of milliseconds. Used to establish rotation intervals for status condition and tag sprites. */
  private readonly SPRITE_ROTATION_INTERVAL: number = 2000;
  /** Maximum height/width in pixels for status condition and tag sprites. */
  private readonly SPRITE_MAX_DIMENSIONS: number = 12;
  private readonly OVERLAY_Z_INDEX: number = 1;

  private readonly GRAYSCALE_FILTER: string = "grayscale";
  private readonly BRIGHT_FILTER: string = "bright";
  private readonly GLOW_FILTER: string = "glow";
  private readonly PINNED_FILTER: string = "pinned";
  private readonly PAIRUP_FILTER: string = "pairup";

  //Internal attributes
  private teamDataService: TeamDataService | undefined;

  public unit: IUnit | undefined;
  public unitDimensions: number = 0;

  private sprite: Sprite | undefined;
  private activeSpriteFilters: StringDictionary<Filter> = {};

  constructor(private readonly injector: Injector, public readonly unitName: string, private readonly isBackOfPair: boolean) {
    super({
      label: `unit ${unitName}`,
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none'
    });
    
    runInInjectionContext(injector, () => {
      this.teamDataService = inject(TeamDataService);
    });
  }

  public async init() {
    //Attempt to load the unit by its name
    this.unit = this.teamDataService?.getUnitByName(this.unitName);
    if(this.unit === undefined) {
      console.error(`Failed to locate unit name '${this.unitName}'.`);
      return;
    }

    const constants: IMapConstants | undefined = this.teamDataService?.getMapConstants();
    const tileDimensions: number = (constants?.tileSize ?? 16);
    this.unitDimensions = tileDimensions * this.unit.location.unitSize;

    await Promise.all([
      this.loadUnitSprite(),
      this.renderHealthBar(),
      this.renderUnitNumber(),
      this.renderStatusConditions(),
      this.renderTags()
    ]);

    //Set initial filter list
    const filters = Object.values(this.activeSpriteFilters);
    if(this.sprite !== undefined && filters.length > 0) {
      this.sprite.filters = filters;
    }
  }

  private async loadUnitSprite() {
    if (this.unit === undefined) return;

    const url: string = this.unit.sprite.spriteURL ?? "";
    const assetAlias: string = `unit ${this.unit.normalizedName}`;
    this.sprite = await SpriteLoader.getExternalSpriteByExtension(assetAlias, url);

    //If we failed to load the unit's sprite, use a placeholder instead
    if (this.sprite === undefined) {
      const rect = new Graphics({ label: "unit_sprite" })
        .rect(0, 0, this.unitDimensions, this.unitDimensions)
        .fill(SpriteFilters.missingSpriteFill);
      this.addChild(rect);
      
      return;
    }

    this.addChild(this.sprite);
    this.sprite.label = 'unit_sprite';
    this.sprite.anchor.set(0.5); //manipulate sprite relative to its center
    this.sprite.position.set(
      this.unitDimensions / 2, //horizonal center
      this.unitDimensions - (this.sprite.height / 2) - 2 //2px from bottom
    );

    //Horizontally flip sprite
    const affiliation: IAffiliation | undefined = this.teamDataService?.getAffiliationByName(this.unit.affiliation);
    if (affiliation?.flipUnitSprites ?? false)
      this.sprite.scale.x *= -1;

    //Add grayscale filter
    if(this.unit.sprite.hasMoved ?? false)
      this.activeSpriteFilters[this.GRAYSCALE_FILTER] = SpriteFilters.getGrayscaleFilter();

    //Add pairup filter
    if(this.isBackOfPair)
      this.activeSpriteFilters[this.PAIRUP_FILTER] = SpriteFilters.getDarkFilter();

    //Add aura glow filter
    const auraColor: string = (this.unit.sprite.aura ?? "");
    if(auraColor.length > 0)
      this.activeSpriteFilters[this.GLOW_FILTER] = SpriteFilters.getGlowFilter(auraColor);
  }

  private async renderHealthBar() {
    if (this.unit === undefined) return;

    const healthBarGradient = this.getHealthBarGradient(this.unit.stats.hp.percentage);
    const healthBar = new Graphics({ zIndex: this.OVERLAY_Z_INDEX })
      .rect(2, this.unitDimensions - 4, this.unitDimensions - 2, 3)
      .fill(healthBarGradient)
      .stroke({ width: 1, color: 0x000000, pixelLine: true });

    this.addChild(healthBar);
  }

  /**
   * Determine the colors codes appropriate for the unit's current `hpPercentage`.
   * 
   * @returns A new FillGradient containing a linear left-right gradient
   */
  private getHealthBarGradient(hpPercentage: number) : FillGradient { 
    //Primary and secondary color hexes should match the ones from unit-hp-bar.ts
    const colorSet: IHpBarColorSet = UnitHpBar.getHpBarColorSet(hpPercentage);

    //Prevent overfilled HP from going above 1.0
    const hpFraction: number = Math.min(hpPercentage / 100, 1.0);

    return new FillGradient({
      type: 'linear',
      start: { x: 0, y: 0.5 }, //linear left-to-right gradient
      end: { x: 1, y: 0.5 },
      colorStops: [
        //Transition colors immediately at the hpFraction
        { offset: hpFraction, color: colorSet.primary },
        { offset: hpFraction, color: colorSet.secondary },
      ],
    });
  }

  private async renderUnitNumber() {
    if (this.unit === undefined) return;

    const unitNumber: string = this.unit.unitNumber ?? "";
    if(unitNumber.length < 1) return;

    const numbersContainer: Container = new Container({
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none',
      zIndex: this.OVERLAY_Z_INDEX
    });

    unitNumber.split('').forEach((digit) => 
    {
      const sprite: Sprite = Sprite.from(digit);
      numbersContainer.addChild(sprite);
      sprite.x = numbersContainer.width; //move sprite to end of the container
    });

    this.addChild(numbersContainer);
    numbersContainer.position.set(
      this.unitDimensions - numbersContainer.width - 7,
      this.unitDimensions - numbersContainer.height - 5
    );
  }

  private async renderStatusConditions() {
    if (this.unit === undefined) return;

    const unitStatuses = this.unit.statusConditions ?? [];
    if(unitStatuses.length < 1) return;

    let conditionSprites: Sprite[] = [];
    let useDefaultSprite: boolean = false;
    let useLoadFailedGraphic: boolean = false;

    //Load sprites in parallel
    await Promise.all(unitStatuses.map(async status =>
    {
      const statusData: IStatusCondition | undefined = this.teamDataService?.getStatusConditionByName(status.name);
      if(statusData === undefined) return;

      const url: string = statusData.spriteURL ?? "";
      if (url.length < 1) {
        useDefaultSprite = true;
        return;
      }

      const assetAlias = `status ${statusData.name}`;      
      const sprite: Sprite | undefined = await SpriteLoader.getExternalSpriteByExtension(assetAlias, url);

      if (sprite === undefined) {
        useLoadFailedGraphic = true;
        return;
      }

      //Scale sprite down if it exceeds max dimensions
      sprite.height = Math.min(sprite.height, this.SPRITE_MAX_DIMENSIONS);
      sprite.width = Math.min(sprite.width, this.SPRITE_MAX_DIMENSIONS);

      conditionSprites.push(sprite);
    }));

    //If we flagged a condition without a sprite, push the default sprite to the front of the list
    if (useDefaultSprite) {
      const heart: Sprite = Sprite.from('status_heart');
      conditionSprites.unshift(heart);
    }

    const statusContainer: Container = new Container({
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none',
      zIndex: this.OVERLAY_Z_INDEX
    });
    
    const shouldRotateSprites: boolean = (conditionSprites.length > 1) || (conditionSprites.length > 0 && useLoadFailedGraphic);
    conditionSprites.forEach((sprite) => {
      statusContainer.addChild(sprite);
      sprite.visible = !shouldRotateSprites; //make invisible if we're going to rotate
    }); 

    //If we failed to load any sprite, add a placeholder graphic as the last child
    if (useLoadFailedGraphic) {
      const rect = new Graphics({ visible: !shouldRotateSprites })
        .rect(0, 0, this.SPRITE_MAX_DIMENSIONS, this.SPRITE_MAX_DIMENSIONS)
        .fill(SpriteFilters.missingSpriteFill);
      statusContainer.addChild(rect);
    }

    //If we have multiple sprites, make only the first sprite visible and 
    //establish an interval to rotate the visible sprite.
    if (shouldRotateSprites) {
      statusContainer.getChildAt(0).visible = true;
      setInterval(this.rotateVisibilityOfContainerChildren, this.SPRITE_ROTATION_INTERVAL, statusContainer);
    }

    this.addChild(statusContainer);
  }

  private async renderTags() {
    if (this.unit === undefined) return;

    const tagNames: string[] = this.unit.tags ?? [];
    if (tagNames.length < 1) return;

    let tagSprites: Sprite[] = [];
    let useLoadFailedGraphic: boolean = false;

    //Load sprites in parallel
    await Promise.all(tagNames.map(async name =>
    {
      const tagData: ITag | undefined = this.teamDataService?.getTagByName(name);
      const url: string = tagData?.spriteURL ?? "";
      const showOnUnit: boolean = tagData?.showOnUnit ?? false;

      if(url.length < 1 || !showOnUnit) return;

      const assetAlias: string = `tag ${name}`;
      const sprite: Sprite | undefined = await SpriteLoader.getExternalSpriteByExtension(assetAlias, url);

      if(sprite === undefined) {
        useLoadFailedGraphic = true;
        return;
      }

      //Scale sprite down if it exceeds max dimensions
      sprite.height = Math.min(sprite.height, this.SPRITE_MAX_DIMENSIONS);
      sprite.width = Math.min(sprite.width, this.SPRITE_MAX_DIMENSIONS);

      tagSprites.push(sprite);
    }));

    const tagsContainer: Container = new Container({
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none',
      zIndex: this.OVERLAY_Z_INDEX
    });
    
    const shouldRotateSprites: boolean = (tagSprites.length > 1) || (tagSprites.length > 0 && useLoadFailedGraphic);
    tagSprites.forEach((sprite) => {
      tagsContainer.addChild(sprite);
      sprite.visible = !shouldRotateSprites; //make invisible if we're going to rotate
      sprite.position.x = tagsContainer.width - sprite.width; //right align
    });
 
    //If we failed to load any sprite, add a placeholder graphic as the last child
    if (useLoadFailedGraphic) {
      const rect = new Graphics({ visible: !shouldRotateSprites })
        .rect(0, 0, this.SPRITE_MAX_DIMENSIONS, this.SPRITE_MAX_DIMENSIONS)
        .fill(SpriteFilters.missingSpriteFill);
      tagsContainer.addChild(rect);
      rect.position.x = tagsContainer.width - rect.width;
    }

    //If we have multiple sprites, make only the first sprite visible and 
    //establish an interval to rotate the visible sprite.
    if (shouldRotateSprites) {
      tagsContainer.getChildAt(0).visible = true;
      setInterval(this.rotateVisibilityOfContainerChildren, this.SPRITE_ROTATION_INTERVAL, tagsContainer);
    }

    this.addChild(tagsContainer);
    tagsContainer.x = this.width - Math.min(this.SPRITE_MAX_DIMENSIONS, tagsContainer.width); //right align
  }

  /**
   * Intended to be called on an inverval system. Looks for the current visible child of container,
   * makes it invisible, then sets the next child to visible. Loops when it reaches the end of the
   * child list.
   */
  private rotateVisibilityOfContainerChildren(container: Container) {
    if(container.children.length === 0) return;

    let visibleChildIndex: number = container.children.findIndex(s => s.visible);
    container.getChildAt(visibleChildIndex).visible = false;

    //Increment index, reset to 0 if we exceed list length
    if(++visibleChildIndex >= container.children.length)
      visibleChildIndex = 0;

    container.getChildAt(visibleChildIndex).visible = true;
  }

  // #region Event Handling

  public pinUnit() {
    if(this.sprite === undefined) return;

    this.activeSpriteFilters[this.PINNED_FILTER] = SpriteFilters.getUnitPinnedFilter();
    this.sprite.filters = Object.values(this.activeSpriteFilters);
  }

  public unpinUnit() {
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