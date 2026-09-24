import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { ICombatArt } from '../../data/interfaces/system/combat-art';
import { TeamDataService } from '../../services/team-data-service';
import { MatTooltip } from "@angular/material/tooltip";
import { MatDivider } from "@angular/material/divider";
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'combat-art',
  imports: [MatTooltip, MatDivider, KeyValuePipe],
  templateUrl: './combat-art.html',
  styleUrl: './combat-art.scss',
})
export class CombatArt implements OnChanges {
  //External inputs
  name = input.required<string>();

  //Internal attributes
  protected systemData = signal<ICombatArt | undefined>(undefined);
  protected isExpanded = signal<boolean>(false);

  constructor(protected readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.teamDataService.getCombatArtByName(this.name()));
  }

  protected buildSubtitleText() : string {
    let subtitle: string = "";

    const weaponRank = this.systemData()?.weaponRank ?? "";
    if (weaponRank.length > 0) {
      subtitle += weaponRank;
    }

    const category = this.systemData()?.category ?? "";
    if (category.length > 0) {
      if (subtitle.length > 0) { subtitle += ` - ${category}`; }
      else { subtitle += category; }
    }

    const utilizedStats = this.systemData()?.utilizedStats ?? [];
    if(utilizedStats.length > 0) {
      if (subtitle.length > 0) subtitle += " ";

      subtitle += `(${utilizedStats.join("/")})`;
    }

    return subtitle;
  }

  protected doNotSortByKey() : number { return 0; }
}
