import { effect, inject, Injector, runInInjectionContext } from "@angular/core";
import { Container, Graphics, Text } from "pixi.js";
import { MapAnalysisEventService, MapAnalysisMode, MapAnalysisSpecialtyMode } from "../../services/map-analysis-event-service";
import { ITile } from "../../data/interfaces/map/tile";
import { ITerrainType, WarpType } from "../../data/interfaces/system/terrain-type";
import { IAnalysisWarpGroup, MapAnalysisDataService } from "../../services/map-analysis-data-service";
import { ITerrainTypeStats } from "../../data/interfaces/system/terrain-type-stats";
import { ITileWarpData } from "../../data/interfaces/map/tile-warp-data";

export class TileAnalysisBackgroundContainer extends Container {
  
  //Constants
  private readonly LOW_MOVE_COST_COLOR = "#000000";
  private readonly MEDIUM_MOVE_COST_COLOR = "#e2aa00";
  private readonly HIGH_MOVE_COST_COLOR = "#db1212";
  private readonly EXTREME_MOVE_COST_COLOR = "#992DE4";

  private readonly WHITE_SHADOW_COLOR = "#ffffff";
  private readonly BLACK_SHADOW_COLOR = "#000000";

  //Internal attributes
  private eventService: MapAnalysisEventService | undefined;
  private terrainType: ITerrainType | undefined;

  private readonly tintGraphic: Graphics;
  private readonly text: Text;

  constructor(private readonly injector: Injector, private readonly tile: ITile, private readonly dimensions: number) {
    super({ 
      label: `${tile.coordinate.asText} background`,
      visible: false,
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none'
    });

    this.tintGraphic = this.createTint();
    this.text = this.createText();
    this.addChild(this.tintGraphic, this.text);

    //Watch for tile state changes
    runInInjectionContext(injector, () => {
      const dataService = inject(MapAnalysisDataService);
      this.eventService = inject(MapAnalysisEventService);

      this.terrainType = dataService.getTerrainTypeByName(tile.terrainType);

      effect(() => {
        this.updateState(this.eventService!.mode());
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
      alpha: 0.6
    });
  }

  private createText(): Text {
    const tileMidpoint: number = Math.ceil(this.dimensions / 2);
    return new Text({
      text: "1",
      style: {
        fontSize: Math.floor(this.dimensions * 0.75),
        fontWeight: 'bold',
        fill: this.LOW_MOVE_COST_COLOR,
        dropShadow: {
          color: this.WHITE_SHADOW_COLOR,
          blur: 0,
          distance: 2
        }
      },
      textureStyle: {
        scaleMode: 'nearest', //make the text crisp
      },
      anchor: 0.5,
      x: tileMidpoint,
      y: tileMidpoint,
      visible: false,
      interactive: false,
      interactiveChildren: false,
      eventMode: 'none'
    });
  }

  private updateState(mode: MapAnalysisMode) {
    this.hideChildren();

    switch (mode) {
      case "moveCost": this.updateMovementCostState(); break;
      case "terrainType": this.updateTerrainTypeState(); break;
      case "warpGroup": this.updateWarpGroupState(); break;
      case "specialty": this.updateSpecialtyState(); break;
    }

    this.visible = this.tintGraphic.visible;
  }

  private hideChildren() {
    this.tintGraphic.visible = false;
    this.text.visible = false;
  }

  private updateMovementCostState() {
    //If we've selected an actual affiliation group filter, locate the first stat group with that
    //affiliation group name in its list.
    const affiliationGroup: string = this.eventService?.affiliationGroup() ?? "";

    let statGroup: ITerrainTypeStats | undefined;
    if (affiliationGroup.length > 0 && affiliationGroup !== "No Filter / Default")
      statGroup = this.terrainType?.statGroups?.find(g => g.affiliationNames?.some(aff => aff === affiliationGroup));
    else
      statGroup = this.terrainType?.statGroups?.find(g => (g.affiliationNames?.length ?? 0) === 0);

    const movementType: string = this.eventService?.movementType() ?? "";
    const movementCost: number = statGroup?.movementCosts[movementType] ?? -1;
    if (movementCost < 0 || movementCost >= 99) {
      this.hideChildren();
      return;
    }

    this.tintGraphic.visible = true;
    this.text.visible = true;

    this.text.text = movementCost;
    this.text.style.fill = this.getMovementCostTextColor(movementCost);
    this.text.style.dropShadow.color = this.getMovementCostTextShadowColor(movementCost);
  }

  private getMovementCostTextColor(cost: number) : string {
    if (cost >= 5)
      return this.EXTREME_MOVE_COST_COLOR;
    if (cost >= 3)
      return this.HIGH_MOVE_COST_COLOR;
    if (cost >= 2)
      return this.MEDIUM_MOVE_COST_COLOR;

    return this.LOW_MOVE_COST_COLOR;
  }

  private getMovementCostTextShadowColor(cost: number) {
    if (cost >= 2)
      return this.BLACK_SHADOW_COLOR;

    return this.WHITE_SHADOW_COLOR;
  }

  private updateTerrainTypeState() {
    const terrainType: string = this.eventService?.terrainType() ?? "";
    if (terrainType.length < 1 || this.terrainType?.name !== terrainType) {
      this.hideChildren();
      return;
    }

    this.tintGraphic.visible = true;
  }

  private updateWarpGroupState() {
    const warpGroup: IAnalysisWarpGroup | undefined = this.eventService?.warpGroup();
    const tileWarpData: ITileWarpData | undefined = this.tile.warpData;

    if (warpGroup === undefined || this.terrainType === undefined || warpGroup.groupNumber !== tileWarpData?.warpGroupNumber) {
      this.hideChildren();
      return;
    }

    this.tintGraphic.visible = true;
    this.text.visible = true;

    const warpCost: number = this.terrainType?.warpCost ?? -1;
    const warpType: WarpType = this.terrainType?.warpType ?? WarpType.None;
    const directionSymbol: string = this.getWarpTypeDirectionSymbol(warpType);

    this.text.text = `${directionSymbol}${warpCost > -1 ? warpCost : "--"}`;
    this.text.style.fill = this.LOW_MOVE_COST_COLOR;
    this.text.style.dropShadow.color = this.WHITE_SHADOW_COLOR;
  }

  private getWarpTypeDirectionSymbol(type: WarpType) : string {
    switch (type) {
      case WarpType.Dual: return "↕";
      case WarpType.Entrance: return "↓";
      case WarpType.Exit: return "↑";
      default: return "";
    }
  }

  private updateSpecialtyState() {
    const specialty: MapAnalysisSpecialtyMode | undefined = this.eventService?.specialtyMode();

    let hasSpecialty: boolean = false;
    if (specialty === "cannotStopOn") {
      hasSpecialty = this.terrainType?.cannotStopOn ?? false;
    }
    else if (specialty === "blocksItems") {
      hasSpecialty = this.terrainType?.blocksItems ?? false;
    }
    else if (specialty === "restrictAff") {
      hasSpecialty = this.terrainType?.canRestrictAffiliations ?? false;
    }

    if (!hasSpecialty) {
      this.hideChildren();
      return;
    }

    this.tintGraphic.visible = true;
  }
}