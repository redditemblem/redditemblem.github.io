import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MapAnalysisEventService } from '../../../services/map-analysis-event-service';
import { MapAnalysisDataService } from '../../../services/map-analysis-data-service';
import { TileTerrainType } from '../../tile-terrain-type/tile-terrain-type';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'map-analysis-options-sidenav',
  imports: [MatInputModule, MatSelectModule, TileTerrainType, MatDivider],
  templateUrl: './map-analysis-options-sidenav.html',
  styleUrl: './map-analysis-options-sidenav.scss',
})
export class MapAnalysisOptionsSidenav implements OnInit {

  constructor(protected readonly analysisDataService: MapAnalysisDataService, protected readonly eventService: MapAnalysisEventService) {
    this.analysisDataService = inject(MapAnalysisDataService);
    this.eventService = inject(MapAnalysisEventService);
  }

  ngOnInit() {
    const groupings = this.analysisDataService.getTerrainTypeAffiliationGroupings();
    if (groupings.length > 0)
      this.eventService.affiliationGroup.set(groupings.at(0));
  }
}
