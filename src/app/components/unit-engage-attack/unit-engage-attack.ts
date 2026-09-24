import { Component, inject, input, OnChanges, signal, SimpleChanges } from '@angular/core';
import { IEngageAttack } from '../../data/interfaces/system/engage-attack';
import { TeamDataService } from '../../services/team-data-service';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'unit-engage-attack',
  imports: [MatDivider],
  templateUrl: './unit-engage-attack.html',
  styleUrl: './unit-engage-attack.scss',
})
export class UnitEngageAttack implements OnChanges {
  //External inputs
  public attack = input.required<string>();
  public expanded = input<boolean>(true);

  //Internal attributes
  protected systemData = signal<IEngageAttack | undefined>(undefined);

  constructor(private readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.teamDataService.getEngageAttackByName(this.attack()));
  }
}
