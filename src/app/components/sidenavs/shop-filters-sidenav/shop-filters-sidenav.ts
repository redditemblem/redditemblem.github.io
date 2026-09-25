import { Component, inject, OnInit, signal } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { IItemSort } from '../../../data/interfaces/storage/item-sort';
import { ShopDataService } from '../../../services/shop-data-service';
import { ShopEventService } from '../../../services/shop-event-service';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'shop-filters-sidenav',
  imports: [MatInputModule, MatSelectModule, MatSlideToggleModule, MatDivider, MatCheckboxModule],
  templateUrl: './shop-filters-sidenav.html',
  styleUrl: './shop-filters-sidenav.scss',
})
export class ShopFiltersSidenav implements OnInit {

  constructor(protected shopDataService: ShopDataService, protected shopEventService: ShopEventService) {
    this.shopDataService = inject(ShopDataService);
    this.shopEventService = inject(ShopEventService);
  }

  ngOnInit(): void {
    const sorts = this.shopDataService.getShopItemSorts();
    if(sorts.length > 0)
      this.shopEventService.sortItemsBy.set(sorts[0]);
  }

  protected newItemsCheckbox_OnChange(event: MatCheckboxChange) {
    this.shopEventService.showNew.set(!this.shopEventService.showNew());
  }

  protected onSaleItemsCheckbox_OnChange(event: MatCheckboxChange) {
    this.shopEventService.showOnSale.set(!this.shopEventService.showOnSale());
  }

  protected outOfStockItemsCheckbox_OnChange(event: MatCheckboxChange) {
    this.shopEventService.showOutOfStock.set(!this.shopEventService.showOutOfStock());
  }

  protected itemCategoryCheckbox_OnChange(event: MatCheckboxChange) {
    const value = event.source.value;

    if(value === "All") {
      const categories = this.shopDataService.getShopItemCategories();
      categories.forEach(category => this.shopEventService.updateItemCategoryFilter(category, event.checked));
    }
    else
      this.shopEventService.updateItemCategoryFilter(value, event.checked);
  }

  protected utilizedStatCheckbox_OnChange(event: MatCheckboxChange) {
    const value = event.source.value;

    if(value === "All") {
      const stats = this.shopDataService.getShopItemUtilizedStats();
      stats.forEach(stat => this.shopEventService.updateUtilizedStatFilter(stat, event.checked));
    }
    else 
      this.shopEventService.updateUtilizedStatFilter(value, event.checked);
  }

  protected targetedStatCheckbox_OnChange(event: MatCheckboxChange) {
    const value = event.source.value;

    if(value === "All") {
      const stats = this.shopDataService.getShopItemTargetedStats();
      stats.forEach(stat => this.shopEventService.updateTargetedStatFilter(stat, event.checked));
    }
    else 
      this.shopEventService.updateTargetedStatFilter(value, event.checked);
  }
}
