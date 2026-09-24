import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { TeamDataService } from '../../services/team-data-service';
import { IGambit } from '../../data/interfaces/system/gambit';
import { MatDivider } from "@angular/material/divider";
import { KeyValuePipe } from '@angular/common';

@Component({
  selector: 'gambit',
  imports: [MatDivider, KeyValuePipe],
  templateUrl: './gambit.html',
  styleUrl: './gambit.scss',
})
export class Gambit implements OnChanges {
  //External inputs
  public name = input.required<string>();
  public uses = input.required<number | undefined>();
  public expanded = input.required<boolean>();

  //Internal attributes
  protected systemData = signal<IGambit | undefined>(undefined);

  constructor(protected readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.teamDataService.getGambitByName(this.name()));
  }

  protected formatUtilizedStats() : string {
    return this.systemData()?.utilizedStats?.join("/") ?? "";
  }

  protected doNotSortByKey() : number { return 0; }
}
