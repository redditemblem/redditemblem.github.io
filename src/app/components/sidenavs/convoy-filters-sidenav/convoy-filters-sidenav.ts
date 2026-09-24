import { Component, inject, OnInit, signal } from '@angular/core';
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDivider } from "@angular/material/divider";
import { MatCheckboxChange, MatCheckboxModule } from "@angular/material/checkbox";
import { ConvoyDataService } from '../../../services/convoy-data-service';
import { IItemSort } from '../../../data/interfaces/storage/item-sort';
import { ConvoyEventService } from '../../../services/convoy-event-service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'convoy-filters-sidenav',
  imports: [MatInputModule, MatSelectModule, MatDivider, MatCheckboxModule, MatSlideToggleModule],
  templateUrl: './convoy-filters-sidenav.html',
  styleUrl: './convoy-filters-sidenav.scss',
})
export class ConvoyFiltersSidenav implements OnInit {

  protected sortBy = signal<IItemSort | undefined>(undefined);
  protected ownedBy = signal<string | undefined>(undefined);

  constructor(protected convoyDataService: ConvoyDataService, protected convoyEventService: ConvoyEventService) {
    this.convoyDataService = inject(ConvoyDataService);
    this.convoyEventService = inject(ConvoyEventService);
  }

  ngOnInit(): void {
    const sorts = this.convoyDataService.getConvoyItemSorts();
    if(sorts.length > 0)
      this.convoyEventService.sortItemsBy.set(sorts[0]);

    const owners = this.convoyDataService.getConvoyItemOwners();
    if(owners.length > 0)
      this.convoyEventService.itemsOwnedBy.set(owners[0]);
  }

  protected itemCategoryCheckbox_OnChange(event: MatCheckboxChange) {
    const value = event.source.value;

    if(value === "All") {
      const categories = this.convoyDataService.getConvoyItemCategories();
      categories.forEach(category => this.convoyEventService.updateItemCategoryFilter(category, event.checked));
    }
    else
      this.convoyEventService.updateItemCategoryFilter(value, event.checked);
  }

  protected utilizedStatCheckbox_OnChange(event: MatCheckboxChange) {
    const value = event.source.value;

    if(value === "All") {
      const stats = this.convoyDataService.getConvoyItemUtilizedStats();
      stats.forEach(stat => this.convoyEventService.updateUtilizedStatFilter(stat, event.checked));
    }
    else 
      this.convoyEventService.updateUtilizedStatFilter(value, event.checked);
  }

  protected targetedStatCheckbox_OnChange(event: MatCheckboxChange) {
    const value = event.source.value;

    if(value === "All") {
      const stats = this.convoyDataService.getConvoyItemTargetedStats();
      stats.forEach(stat => this.convoyEventService.updateTargetedStatFilter(stat, event.checked));
    }
    else 
      this.convoyEventService.updateTargetedStatFilter(value, event.checked);
  }
}
