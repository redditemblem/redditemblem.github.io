import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreakpointService } from '../../../services/breakpoint-service';
import { ThemeService } from '../../../services/theme-service';
import { MapAnalysisDataService } from '../../../services/map-analysis-data-service';
import { MapAnalysisEventService } from '../../../services/map-analysis-event-service';
import { LoadingIcon } from '../../loading-icon/loading-icon';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { LinksSidenav } from '../../sidenavs/links-sidenav/links-sidenav';
import { IMapSegment } from '../../../data/interfaces/map/map-segment';
import { MatFabButton } from '@angular/material/button';
import { MapAnalysisOptionsSidenav } from '../../sidenavs/map-analysis-options-sidenav/map-analysis-options-sidenav';
import { MapAnalysisCanvas } from '../../map-analysis-canvas/map-analysis-canvas';

@Component({
  selector: 'map-analysis-view',
  imports: [LoadingIcon, MatIconModule, MatSidenavModule, MatTabsModule, LinksSidenav, MatFabButton, MapAnalysisOptionsSidenav, MapAnalysisCanvas],
  templateUrl: './map-analysis-view.html',
  styleUrl: './map-analysis-view.scss',
})
export class MapAnalysisView implements OnInit, OnDestroy {
  
  //Internal attributes
  protected isLoading = signal<boolean>(true);

  constructor(private readonly route: ActivatedRoute, protected readonly breakpointService: BreakpointService, private readonly themeService: ThemeService, protected readonly analysisDataService: MapAnalysisDataService, protected readonly eventService: MapAnalysisEventService) {
    this.route = inject(ActivatedRoute);
    this.breakpointService = inject(BreakpointService);
    this.themeService = inject(ThemeService);
    this.analysisDataService = inject(MapAnalysisDataService);
    this.eventService = inject(MapAnalysisEventService);
  }

  ngOnInit() {
    const teamName = this.route.snapshot.paramMap.get("teamName") ?? "";
    this.analysisDataService.loadDataForTeam(teamName)
      .then(() => {
        const segment: IMapSegment | undefined = this.analysisDataService.mapData().map?.segments.at(0);
        if(segment !== undefined)
          this.eventService.updateSelectedSegment(segment);
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  ngOnDestroy(): void {
    this.eventService.reset();
  }

  protected SegmentTabs_selectedTabChange(event: MatTabChangeEvent) {
    const segment: IMapSegment | undefined = this.analysisDataService.mapData().map?.segments[event.index];
    if(segment === undefined) return;

    this.eventService.updateSelectedSegment(segment);
  }

}
