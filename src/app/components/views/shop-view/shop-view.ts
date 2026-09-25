import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ShopDataService } from '../../../services/shop-data-service';
import { BreakpointService } from '../../../services/breakpoint-service';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTabsModule } from "@angular/material/tabs";
import { LinksSidenav } from "../../sidenavs/links-sidenav/links-sidenav";
import { MatButtonModule } from '@angular/material/button';
import { ShopEventService } from '../../../services/shop-event-service';
import { ActivatedRoute } from '@angular/router';
import { IShopItem } from '../../../data/interfaces/storage/shop/shop-item';
import { IItem } from '../../../data/interfaces/system/item';
import { ShopFiltersSidenav } from '../../sidenavs/shop-filters-sidenav/shop-filters-sidenav';
import { ShopItem } from '../../shop-item/shop-item';
import { MatIconModule } from "@angular/material/icon";
import { LoadingIcon } from "../../loading-icon/loading-icon";
import { ThemeService } from '../../../services/theme-service';

@Component({
  selector: 'shop-view',
  imports: [MatSidenavModule, MatTabsModule, LinksSidenav, MatButtonModule, ShopFiltersSidenav, ShopItem, MatIconModule, LoadingIcon],
  templateUrl: './shop-view.html',
  styleUrl: './shop-view.scss',
})
export class ShopView implements OnInit, OnDestroy {

  //Internal attributes
  protected isLoading = signal<boolean>(true);

  constructor(private readonly route: ActivatedRoute, protected readonly breakpointService: BreakpointService, private readonly themeService: ThemeService, protected readonly shopDataService: ShopDataService, protected readonly shopEventService: ShopEventService) {
    this.route = inject(ActivatedRoute);
    this.breakpointService = inject(BreakpointService);
    this.themeService = inject(ThemeService);
    this.shopDataService = inject(ShopDataService);
    this.shopEventService = inject(ShopEventService);
  }

  ngOnInit() {
    const teamName = this.route.snapshot.paramMap.get("teamName") ?? "";
    this.shopDataService.loadDataForTeam(teamName)
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  ngOnDestroy() {
    this.shopEventService.reset();
  }

  protected calculateNumberOfStripes() : number {
    if(this.breakpointService.isSmallWidth()) return 8;
    if(this.breakpointService.isMediumWidth()) return 12;
    
    return 16;
  }

  protected getFilteredShopItemsList(): IShopItem[] {
    return this.shopDataService.getShopItemsList()
      .filter(item => this.itemHasStock(item)
        && this.itemMeetsNewRestrictions(item)
        && this.itemMeetsSaleRestrictions(item)
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
  private sortItems(shopItemA: IShopItem, shopItemB: IShopItem) {
    const itemSort = this.shopEventService.sortItemsBy();
    const sortAttribute = itemSort?.sortAttribute ?? '';

    //If no sort has been set yet, default to sorting by name
    if(sortAttribute.length < 1)
      return shopItemA.name.toLowerCase().localeCompare(shopItemB.name.toLowerCase());

    //Intentionally use `any` typings here, so that we can correctly sort both strings and numbers
    let sortValueA: any = undefined;
    let sortValueB: any = undefined;
    if(itemSort?.isDeepSort ?? false){
        const itemA = this.shopDataService.getItemByName(shopItemA.name);
        if(itemA !== undefined) 
          sortValueA = itemA[sortAttribute as keyof IItem] as any;
        
        const itemB = this.shopDataService.getItemByName(shopItemB.name);
        if(itemB !== undefined)
          sortValueB = itemB[sortAttribute as keyof IItem] as any;
    }
    else {
        sortValueA = shopItemA[sortAttribute as keyof IShopItem] as any;
        sortValueB = shopItemB[sortAttribute as keyof IShopItem] as any;
    }
            
    if(sortValueA.length === 0) return 1;
    if(sortValueB.length === 0) return -1;

    //If sort values are equal, subsort by name
    if(sortValueA === sortValueB) 
      return shopItemA.name.toLowerCase().localeCompare(shopItemB.name.toLowerCase());
    
    return sortValueA < sortValueB ? -1 : 1;
  }

  private itemHasStock(item: IShopItem) : boolean {
    if (this.shopEventService.showOutOfStock())
      return item.stock === 0;
    return item.stock > 0;
  }

  private itemMeetsNewRestrictions(item: IShopItem) : boolean {
    return !this.shopEventService.showNew() || item.isNew;
  }

  private itemMeetsSaleRestrictions(item: IShopItem) : boolean {
    return !this.shopEventService.showOnSale() || item.salePrice !== item.price;
  }

  private itemCategoryMatchesFilter(item: IShopItem) : boolean {
    const i : IItem | undefined = this.shopDataService.getItemByName(item.name);
    if(i === undefined) return true;

    return this.shopEventService.getItemCategoryFilter(i.category);
  }

  private itemUtilizedStatsMatchFilter(item: IShopItem) : boolean {
    const allStatsChecked = this.shopEventService.allUtilizedStatsSelected();
    if(allStatsChecked) return true;
    
    const i : IItem | undefined = this.shopDataService.getItemByName(item.name);
    if(i === undefined) return true;

    const stats = i.utilizedStats ?? [];
    return stats.some(stat => this.shopEventService.getUtilizedStatFilter(stat));
  }

  private itemTargetedStatsMatchFilter(item: IShopItem) : boolean {     
    const allStatsChecked = this.shopEventService.allTargetedStatsSelected();
    if(allStatsChecked) return true;
    
    const i : IItem | undefined = this.shopDataService.getItemByName(item.name);
    if(i === undefined) return true;

    const stats = i.targetedStats ?? [];
    return stats.some(stat => this.shopEventService.getTargetedStatFilter(stat));
  }
}
