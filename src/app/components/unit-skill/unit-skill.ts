import { Component, input, OnChanges, signal } from '@angular/core';
import { IUnitSkill } from '../../data/interfaces/unit/unit-skill';
import { ISkill } from '../../data/interfaces/system/skill';
import { MatDivider } from "@angular/material/divider";
import { ISkillLookupService } from '../../services/interfaces/skill-lookup-service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'unit-skill',
  imports: [MatDivider, MatTooltip],
  templateUrl: './unit-skill.html',
  styleUrl: './unit-skill.scss',
})
export class UnitSkill implements OnChanges {
  //External inputs
  public skill = input.required<IUnitSkill>();
  public dataService = input.required<ISkillLookupService>();

  public expanded = input<boolean>(true);
  public disabled = input<boolean>(false);

  //Internal attributes
  protected systemData = signal<ISkill | undefined>(undefined);

  ngOnChanges() {
    this.systemData.set(this.dataService().getSkillByName(this.skill().name));
  }

  protected getAdditionalStatsText() : string {
    const stats = this.skill().additionalStats;
    return Object.entries(stats).map(s => `${s[1]} ${s[0]}`).join(", ");
  }
}
