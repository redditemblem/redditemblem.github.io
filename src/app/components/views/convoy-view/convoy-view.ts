import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from "@angular/material/sidenav";
import { BreakpointService } from '../../../services/breakpoint-service';
import { MatTabsModule } from "@angular/material/tabs";
import { LinksSidenav } from "../../sidenavs/links-sidenav/links-sidenav";
import { ConvoyDataService } from '../../../services/convoy-data-service';
import { ActivatedRoute } from '@angular/router';
import { ConvoyItem } from '../../convoy-item/convoy-item';
import { IConvoyItem } from '../../../data/interfaces/storage/convoy/convoy-item';
import { ConvoyFiltersSidenav } from "../../sidenavs/convoy-filters-sidenav/convoy-filters-sidenav";
import { MatButtonModule } from '@angular/material/button';
import { ConvoyEventService } from '../../../services/convoy-event-service';
import { IItem } from '../../../data/interfaces/system/item';
import { MatIconModule } from "@angular/material/icon";
import { LoadingIcon } from "../../loading-icon/loading-icon";
import { ThemeService } from '../../../services/theme-service';

@Component({
  selector: 'convoy-view',
  imports: [MatSidenavModule, MatTabsModule, LinksSidenav, ConvoyItem, ConvoyFiltersSidenav, MatButtonModule, MatIconModule, LoadingIcon],
  templateUrl: './convoy-view.html',
  styleUrl: './convoy-view.scss',
})
export class ConvoyView implements OnInit, OnDestroy {

  //Internal attributes
  protected isLoading = signal<boolean>(true);

  constructor(private readonly route: ActivatedRoute, protected readonly breakpointService: BreakpointService, private readonly themeService: ThemeService, protected readonly convoyDataService: ConvoyDataService, protected readonly convoyEventService: ConvoyEventService) {
    this.route = inject(ActivatedRoute);
    this.breakpointService = inject(BreakpointService);
    this.themeService = inject(ThemeService);
    this.convoyDataService = inject(ConvoyDataService);
    this.convoyEventService = inject(ConvoyEventService);
  }

  ngOnInit() {
    const teamName = this.route.snapshot.paramMap.get("teamName") ?? "";
    this.convoyDataService.loadDataForTeam(teamName)
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  ngOnDestroy() {
    this.convoyEventService.reset();
  }

  protected calculateNumberOfStripes() : number {
    if(this.breakpointService.isSmallWidth()) return 8;
    if(this.breakpointService.isMediumWidth()) return 12;
    
    return 16;
  }

  protected getFilteredConvoyItemsList(): IConvoyItem[] {
    return this.convoyDataService.getConvoyItemsList()
      .filter(item =>
           this.itemOwnerMatchesFilter(item)
        && this.itemCategoryMatchesFilter(item)
        && this.itemUtilizedStatsMatchFilter(item)
        && this.itemTargetedStatsMatchFilter(item)
      )
      .sort((a, b) => this.sortItems(a, b));
  }

  /** 
   * Sorts `unitA` and `unitB` by the currently selected `sortItemsBy` parameter. 
   * If nothing is selected, fall back to an alphabetical sort.
  */
  private sortItems(convoyItemA: IConvoyItem, convoyItemB: IConvoyItem) {
    const itemSort = this.convoyEventService.sortItemsBy();
    const sortAttribute = itemSort?.sortAttribute ?? '';

    //If no sort has been set yet, default to sorting by name
    if(sortAttribute.length < 1)
      return convoyItemA.name.toLowerCase().localeCompare(convoyItemB.name.toLowerCase());

    //Intentionally use `any` typings here, so that we can correctly sort both strings and numbers
    let sortValueA: any = undefined;
    let sortValueB: any = undefined;
    if(itemSort?.isDeepSort ?? false){
        const itemA = this.convoyDataService.getItemByName(convoyItemA.name);
        if(itemA !== undefined) 
          sortValueA = itemA[sortAttribute as keyof IItem] as any;
        
        const itemB = this.convoyDataService.getItemByName(convoyItemB.name);
        if(itemB !== undefined)
          sortValueB = itemB[sortAttribute as keyof IItem] as any;
    }
    else {
        sortValueA = convoyItemA[sortAttribute as keyof IConvoyItem] as any;
        sortValueB = convoyItemB[sortAttribute as keyof IConvoyItem] as any;
    }
            
    if(sortValueA.length === 0) return 1;
    if(sortValueB.length === 0) return -1;

    //If sort values are equal, subsort by name
    if(sortValueA === sortValueB)
      return convoyItemA.name.toLowerCase().localeCompare(convoyItemB.name.toLowerCase());
    
    return sortValueA < sortValueB ? -1 : 1;
  }

  private itemOwnerMatchesFilter(item: IConvoyItem) : boolean { 
    const ownerFilter = this.convoyEventService.itemsOwnedBy() ?? '';
    if(ownerFilter.length < 1 || ownerFilter === 'All')
      return true;

    return item.owner.toLowerCase().localeCompare(ownerFilter.toLowerCase()) === 0;
  }

  private itemCategoryMatchesFilter(item: IConvoyItem) : boolean {
    const i : IItem | undefined = this.convoyDataService.getItemByName(item.name);
    if(i === undefined) return true;

    return this.convoyEventService.getItemCategoryFilter(i.category);
  }

  private itemUtilizedStatsMatchFilter(item: IConvoyItem) : boolean {
    const allStatsChecked = this.convoyEventService.allUtilizedStatsSelected();
    if(allStatsChecked) return true;
    
    const i : IItem | undefined = this.convoyDataService.getItemByName(item.name);
    if(i === undefined) return true;

    const stats = i.utilizedStats ?? [];
    return stats.some(stat => this.convoyEventService.getUtilizedStatFilter(stat));
  }

  private itemTargetedStatsMatchFilter(item: IConvoyItem) : boolean {     
    const allStatsChecked = this.convoyEventService.allTargetedStatsSelected();
    if(allStatsChecked) return true;
    
    const i : IItem | undefined = this.convoyDataService.getItemByName(item.name);
    if(i === undefined) return true;

    const stats = i.targetedStats ?? [];
    return stats.some(stat => this.convoyEventService.getTargetedStatFilter(stat));
  }
}
