import { Component, inject, input, OnChanges, signal, Signal, SimpleChanges } from '@angular/core';
import { TeamDataService } from '../../services/team-data-service';
import { IAdjutant } from '../../data/interfaces/system/adjutant';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'adjutant',
  imports: [MatDivider],
  templateUrl: './adjutant.html',
  styleUrl: './adjutant.scss',
})
export class Adjutant implements OnChanges {
  //External inputs
  name = input.required<string>();

  //Internal attributes
  protected systemData = signal<IAdjutant | undefined>(undefined);
  protected isExpanded = signal<boolean>(false);

  constructor(private readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.teamDataService.getAdjutantByName(this.name()));
  }
}
