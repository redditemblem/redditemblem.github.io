import { Component, inject, OnInit, signal } from '@angular/core';
import { TeamListService } from '../../../services/team-list-service';
import { TeamListing } from '../../team-listing/team-listing';
import { BreakpointService } from '../../../services/breakpoint-service';
import { LoadingIcon } from "../../loading-icon/loading-icon";
import { ITeamData } from '../../../data/interfaces/team-data';
import { ThemeService } from '../../../services/theme-service';
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'home',
  imports: [TeamListing, LoadingIcon, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit{
  
  //Internal attributes
  protected isLoading = signal<boolean>(true);
  protected readonly teamExample: ITeamData = { 
    'teamName': 'Team Example',
    'showConvoyLink': true,
    'showShopLink': true
  };

  constructor(protected readonly breakpointService: BreakpointService, protected readonly themeService: ThemeService, protected readonly teamListService: TeamListService){
    this.breakpointService = inject(BreakpointService);
    this.themeService = inject(ThemeService);
    this.teamListService = inject(TeamListService);
  }

  ngOnInit() {
    this.teamListService.loadTeamsList()
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  protected getViewWidth() : string {
    if (this.breakpointService.isSmallWidth())
      return "100%";
    if (this.breakpointService.isMediumWidth())
      return "80%";

    return "60%";
  }
}
