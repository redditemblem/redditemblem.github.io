import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { TeamDataService } from '../../services/team-data-service';
import { IStatusCondition } from '../../data/interfaces/system/status-condition';
import { IUnitStatus } from '../../data/interfaces/unit/unit-status';
import { MatDivider } from "@angular/material/divider";
import { MatTooltip } from "@angular/material/tooltip";
import { StringDictionary } from '../../data/interfaces/common/dictionaries';

@Component({
  selector: 'unit-status-condition',
  imports: [MatDivider, MatTooltip],
  templateUrl: './unit-status-condition.html',
  styleUrl: './unit-status-condition.scss',
})
export class UnitStatusCondition implements OnChanges {
  //External inputs
  public status = input.required<IUnitStatus>();
  
  //Internal attributes
  protected systemData = signal<IStatusCondition | undefined>(undefined);

  constructor(private readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.teamDataService.getStatusConditionByName(this.status().name));
  }

  protected buildTitle() : string {
    const name: string = this.status().name;
    const remainingTurns: number = this.status().remainingTurns ?? 0;
    const maxTurns: number = this.systemData()?.turns ?? 0;

    let turns: string = "";
    if (remainingTurns > 0) {
      if(maxTurns > 0)
        turns = `(${remainingTurns}/${maxTurns} turns)`;
      else
        turns = `(${remainingTurns} turns)`;
    }

    return `${name} ${turns}`.trimEnd();
  }

  protected buildSubtitle() : string {
    const stats: StringDictionary<number> = this.status().additionalStats ?? {};
    return Object.entries(stats).map(stat => `${stat[1]} ${stat[0]}`).join(", ");
  }
}
