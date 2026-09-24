import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { IUnitBattalion } from '../../data/interfaces/unit/unit-battalion';
import { TeamDataService } from '../../services/team-data-service';
import { IBattalion } from '../../data/interfaces/system/battalion';
import { MatDivider } from "@angular/material/divider";
import { KeyValuePipe } from '@angular/common';
import { Gambit } from "../gambit/gambit";

@Component({
  selector: 'unit-battalion',
  imports: [MatDivider, KeyValuePipe, Gambit],
  templateUrl: './unit-battalion.html',
  styleUrl: './unit-battalion.scss',
})
export class UnitBattalion implements OnChanges {
  //External inputs
  public battalion = input.required<IUnitBattalion>();

  //Constants
  private readonly defaultExpansionState: boolean = false;

  //Internal attributes
  protected isExpanded = signal<boolean>(this.defaultExpansionState);
  protected systemData = signal<IBattalion | undefined>(undefined);

  constructor(protected readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.teamDataService.getBattalionByName(this.battalion().name));
    this.isExpanded.set(this.defaultExpansionState);
  }

  protected doNotSortByKey() : number { return 0; }
}
