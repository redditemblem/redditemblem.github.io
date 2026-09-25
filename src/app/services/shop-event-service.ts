
import { computed, Injectable, signal } from '@angular/core';
import { IItemSort } from '../data/interfaces/storage/item-sort';
import { StringDictionary } from '../data/interfaces/common/dictionaries';

@Injectable({
  providedIn: 'root',
})
export class ShopEventService {

  /** Fully resets values stored in the event service back to their default state. */
  public reset() {
    this.sortItemsBy.set(undefined);
    this.showExpandedItemData.set(false);
    this.showNew.set(false);
    this.showOnSale.set(false);
    this.showOutOfStock.set(false);

    this.selectedItemCategories.set({});
    this.selectedUtilizedStats.set({});
    this.selectedTargetedStats.set({});
  }

  public sortItemsBy = signal<IItemSort | undefined>(undefined);
  public showExpandedItemData = signal<boolean>(false);

  public showNew = signal<boolean>(false);
  public showOnSale = signal<boolean>(false);
  public showOutOfStock = signal<boolean>(false);

  // #region Item Category Filter

  private selectedItemCategories = signal<StringDictionary<boolean>>({});
  public readonly someItemCategoriesSelected = computed(() => {
    return !this.allItemCategoriesSelected() && Object.values(this.selectedItemCategories()).some(flag => flag === true);
  });
  public readonly allItemCategoriesSelected = computed(() => {
    return Object.values(this.selectedItemCategories()).every(flag => flag === true);
  });

  public updateItemCategoryFilter(category: string, checked: boolean) {
    this.selectedItemCategories.update(dict => {
      dict[category] = checked;
      return {...dict};
    });
  }

  public getItemCategoryFilter(category: string) : boolean {
    return this.selectedItemCategories()[category] ?? true;
  }

  // #endregion Item Category Filter

  // #region Utilized Stats Filter

  private selectedUtilizedStats = signal<StringDictionary<boolean>>({});
  public readonly someUtilizedStatsSelected = computed(() => {
    return !this.allUtilizedStatsSelected() && Object.values(this.selectedUtilizedStats()).some(flag => flag === true);
  });
  public readonly allUtilizedStatsSelected = computed(() => {
    return Object.values(this.selectedUtilizedStats()).every(flag => flag === true);
  });

  public updateUtilizedStatFilter(stat: string, checked: boolean) {
    this.selectedUtilizedStats.update(dict => {
      dict[stat] = checked;
      return {...dict};
    });
  }

  public getUtilizedStatFilter(stat: string) : boolean {
    return this.selectedUtilizedStats()[stat] ?? true;
  }

  // #endregion Utilized Stats Filter

  // #region Targeted Stats Filter

  private selectedTargetedStats = signal<StringDictionary<boolean>>({});
  public readonly someTargetedStatsSelected = computed(() => {
    return !this.allTargetedStatsSelected() && Object.values(this.selectedTargetedStats()).some(flag => flag === true);
  });
  public readonly allTargetedStatsSelected = computed(() => {
    return Object.values(this.selectedTargetedStats()).every(flag => flag === true);
  });

  public updateTargetedStatFilter(stat: string, checked: boolean) {
    this.selectedTargetedStats.update(dict => {
      dict[stat] = checked;
      return {...dict};
    });
  }

  public getTargetedStatFilter(stat: string) : boolean {
    return this.selectedTargetedStats()[stat] ?? true;
  }

  // #endregion Targeted Stats Filter
}
