import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { IConvoyItem } from '../../data/interfaces/storage/convoy/convoy-item';
import { ConvoyDataService } from '../../services/convoy-data-service';
import { IItem } from '../../data/interfaces/system/item';
import { IEngraving } from '../../data/interfaces/system/engraving';
import { ITag } from '../../data/interfaces/system/tag';
import { MatDivider } from "@angular/material/divider";
import { KeyValuePipe } from '@angular/common';
import { StatWithBuffIcon } from "../stat-with-buff-icon/stat-with-buff-icon";
import { ItemRangeShape } from '../../data/interfaces/system/item-range';
import { Engraving } from "../engraving/engraving";
import { Currency } from "../currency/currency";
import { UnitSkill } from "../unit-skill/unit-skill";

@Component({
  selector: 'convoy-item',
  imports: [MatDivider, KeyValuePipe, StatWithBuffIcon, Engraving, Currency, UnitSkill],
  templateUrl: './convoy-item.html',
  styleUrl: './convoy-item.scss',
})
export class ConvoyItem implements OnChanges {
  //External inputs
  public item = input.required<IConvoyItem>();
  public expand = input.required<boolean>(); //global expand

  //Constants  
  protected readonly ItemRangeShape = ItemRangeShape; //expose enum options
  private readonly defaultExpansionState = false;

  //Internal attributes
  protected systemData = signal<IItem | undefined>(undefined);
  protected isExpanded = signal<boolean>(this.defaultExpansionState); //individual expand

  constructor(protected readonly convoyDataService: ConvoyDataService) {
    this.convoyDataService = inject(ConvoyDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.convoyDataService.getItemByName(this.item().name));
    this.isExpanded.set(this.defaultExpansionState);
  }

  protected getEngravingByName(name: string) : IEngraving | undefined {
    return this.convoyDataService.getEngravingByName(name);
  }

  protected getTagByName(name: string) : ITag | undefined {
    return this.convoyDataService.getTagByName(name);
  }

  protected buildTitle() : string {
    const uses: number = this.item().uses ?? 0;
    
    if (uses > 0)
      return `${this.item().name} (${uses})`;
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
