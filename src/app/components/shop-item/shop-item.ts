import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { ItemRangeShape } from '../../data/interfaces/system/item-range';
import { IShopItem } from '../../data/interfaces/storage/shop/shop-item';
import { IItem } from '../../data/interfaces/system/item';
import { ShopDataService } from '../../services/shop-data-service';
import { IEngraving } from '../../data/interfaces/system/engraving';
import { ITag } from '../../data/interfaces/system/tag';
import { Engraving } from "../engraving/engraving";
import { MatDivider } from "@angular/material/divider";
import { KeyValuePipe } from '@angular/common';
import { StatWithBuffIcon } from "../stat-with-buff-icon/stat-with-buff-icon";
import { Currency } from "../currency/currency";
import { UnitSkill } from '../unit-skill/unit-skill';

@Component({
  selector: 'shop-item',
  imports: [Engraving, MatDivider, KeyValuePipe, StatWithBuffIcon, Currency, UnitSkill],
  templateUrl: './shop-item.html',
  styleUrl: './shop-item.scss',
})
export class ShopItem implements OnChanges {
  //External inputs  
  public item = input.required<IShopItem>();
  public expand = input.required<boolean>(); //global expand

  //Constants
  protected readonly ItemRangeShape = ItemRangeShape; //expose enum options
  private readonly defaultExpansionState: boolean = false;

  //Internal attributes
  protected systemData = signal<IItem | undefined>(undefined);
  protected isExpanded = signal<boolean>(this.defaultExpansionState); //individual expand

  constructor(protected readonly shopDataService: ShopDataService) {
    this.shopDataService = inject(ShopDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.shopDataService.getItemByName(this.item().name));
    this.isExpanded.set(this.defaultExpansionState);
  }

  protected getEngravingByName(name: string) : IEngraving | undefined {
    return this.shopDataService.getEngravingByName(name);
  }

  protected getTagByName(name: string) : ITag | undefined {
    return this.shopDataService.getTagByName(name);
  }

  protected buildTitle() : string {
    return this.item().name;
  }

  protected buildSubtitle() : string {
    let subtitle: string = "";

    const weaponRank: string = this.systemData()?.weaponRank ?? "";
    const category: string = this.systemData()?.category ?? "";

    if (weaponRank.length > 0)
      subtitle += `${weaponRank} - ${category}`;
    else
      subtitle += `${category}`;

    const utilized: string[] = this.systemData()?.utilizedStats ?? [];
    const targeted: string[] = this.systemData()?.targetedStats ?? [];
    
    let stats : string = utilized.join("/");
    if(targeted.length > 0)
      stats += ` » ${targeted.join("/")}`;
    if(stats.length > 0)
      stats = `(${stats})`;

    return `${subtitle} ${stats}`.trimEnd();
  }

  protected hasNonZeroStatValue() : boolean {
    return Object.values(this.item().stats ?? {}).some(s => s.finalValue !== 0);
  }

  protected doNotSortByKey() : number { return 0; }
}
