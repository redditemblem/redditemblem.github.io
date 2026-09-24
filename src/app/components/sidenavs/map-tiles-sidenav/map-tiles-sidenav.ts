import { Component, inject } from '@angular/core';
import { MapEventService } from '../../../services/map-event-service';
import { TeamDataService } from '../../../services/team-data-service';
import { MatDivider } from "@angular/material/divider";
import { TextFieldsWithLabeledHeader } from "../../text-fields-with-labeled-header/text-fields-with-labeled-header";
import { ITile } from '../../../data/interfaces/map/tile';
import { TileTerrainType } from '../../tile-terrain-type/tile-terrain-type';
import { TileObjectInstance } from '../../tile-object-instance/tile-object-instance';

@Component({
  selector: 'map-tiles-sidenav',
  imports: [MatDivider, TextFieldsWithLabeledHeader, TileTerrainType, TileObjectInstance],
  templateUrl: './map-tiles-sidenav.html',
  styleUrl: './map-tiles-sidenav.scss',
})
export class MapTilesSidenav {

  constructor(protected readonly teamDataService: TeamDataService, protected readonly eventService: MapEventService) {
    this.teamDataService = inject(TeamDataService);
    this.eventService = inject(MapEventService);
  }

  protected buildUnitNames() : string {
    const tile: ITile | undefined = this.eventService.highlightedTile();
    if (tile === undefined) return "";

    const unit1: string = tile.unitData.occupyingUnitName ?? "";
    if (unit1.length < 1) return "";

    const unit2: string = tile.unitData.pairedUnitName ?? "";
    if(unit2.length < 1) return unit1;

    return `${unit1} / ${unit2}`;
  }

  protected getWarpTypeDescription(warpTypeEnum: number) {
    switch (warpTypeEnum) {
      case 1 : return "Entrance";
      case 2 : return "Exit";
      case 3 : return "Entrance / Exit";
      default: return "";
    }
  }

}