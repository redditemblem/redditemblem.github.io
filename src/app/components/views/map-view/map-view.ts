import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MapDiceRollerSidenav } from '../../sidenavs/map-dice-roller-sidenav/map-dice-roller-sidenav';
import { MapUnitsSidenav } from '../../sidenavs/map-units-sidenav/map-units-sidenav';
import { MapTilesSidenav } from '../../sidenavs/map-tiles-sidenav/map-tiles-sidenav';
import { BreakpointService } from '../../../services/breakpoint-service';
import { ThemeService } from '../../../services/theme-service';
import { TeamDataService } from '../../../services/team-data-service';
import { ActivatedRoute } from '@angular/router';
import { MatFabButton } from '@angular/material/button';
import { LinksSidenav } from "../../sidenavs/links-sidenav/links-sidenav";
import { MapCanvas } from '../../map-canvas/map-canvas';
import { IMapSegment } from '../../../data/interfaces/map/map-segment';
import { MapPaintSidenav } from "../../sidenavs/map-paint-sidenav/map-paint-sidenav";
import { MapEventService } from '../../../services/map-event-service';
import { MatIcon } from "@angular/material/icon";
import { LoadingIcon } from "../../loading-icon/loading-icon";

@Component({
  selector: 'map-view',
  imports: [MatSidenavModule, MatTabsModule, MatFabButton, MapUnitsSidenav, MapTilesSidenav, MapDiceRollerSidenav, LinksSidenav, MapCanvas, MapPaintSidenav, MatIcon, LoadingIcon],
  templateUrl: './map-view.html',
  styleUrl: './map-view.scss',
})
export class MapView implements OnInit, OnDestroy {
  
  //Constants
  private readonly PAINT_TAB_INDEX: number = 2;

  //Internal attributes
  protected selectedTabIndex = signal<number>(0);
  protected isLoading = signal<boolean>(true);

  constructor(private readonly route: ActivatedRoute, protected readonly breakpointService: BreakpointService, private readonly themeService: ThemeService, protected readonly teamDataService: TeamDataService, protected readonly eventService: MapEventService) {
    this.route = inject(ActivatedRoute);
    this.breakpointService = inject(BreakpointService);
    this.themeService = inject(ThemeService);
    this.teamDataService = inject(TeamDataService);
    this.eventService = inject(MapEventService);
  }

  ngOnInit() {
    const teamName = this.route.snapshot.paramMap.get("teamName") ?? "";
    this.teamDataService.loadDataForTeam(teamName)
      .then(() => {
        const segment: IMapSegment | undefined = this.teamDataService.mapData().map?.segments.at(0);
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

  protected SidebarTabs_selectedTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndex.set(event.index);
    this.eventService.updatePaintMode(event.index === this.PAINT_TAB_INDEX);
  }

  protected SegmentTabs_selectedTabChange(event: MatTabChangeEvent) {
    const segment: IMapSegment | undefined = this.teamDataService.mapData().map?.segments[event.index];
    if(segment === undefined) return;

    this.eventService.updateSelectedSegment(segment);
  }
}
