import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { IUnitInventoryItem } from '../../data/interfaces/unit/unit-inventory-item';
import { IItem } from '../../data/interfaces/system/item';
import { TeamDataService } from '../../services/team-data-service';
import { MatDivider } from '@angular/material/divider';
import { KeyValuePipe } from '@angular/common';
import { IEngraving } from '../../data/interfaces/system/engraving';
import { ITag } from '../../data/interfaces/system/tag';
import { StatWithBuffIcon } from "../stat-with-buff-icon/stat-with-buff-icon";
import { ItemRangeShape } from "../../data/interfaces/system/item-range";
import { Engraving } from '../engraving/engraving';
import { UnitSkill } from '../unit-skill/unit-skill';
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'unit-inventory-item',
  imports: [MatDivider, KeyValuePipe, StatWithBuffIcon, Engraving, UnitSkill, MatTooltip],
  templateUrl: './unit-inventory-item.html',
  styleUrl: './unit-inventory-item.scss',
})
export class UnitInventoryItem implements OnChanges {
  //External inputs
  public item = input.required<IUnitInventoryItem>();
  public disableClick = input<boolean>(false);
  public forceExpand = input<boolean>(false);

  //Constants
  protected readonly ItemRangeShape = ItemRangeShape; //expose enum options

  //Internal attributes
  protected systemData = signal<IItem | undefined>(undefined);
  protected isExpanded = signal<boolean>(this.forceExpand());

  constructor(protected readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.teamDataService.getItemByName(this.item().name));
    this.isExpanded.set(this.forceExpand());
  }

  protected getEngravingByName(name: string) : IEngraving | undefined {
    return this.teamDataService.getEngravingByName(name);
  }

  protected getTagByName(name: string) : ITag | undefined {
    return this.teamDataService.getTagByName(name);
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
