import { Component, computed, inject, input, OnChanges, Signal, signal } from '@angular/core';
import { IUnitEmblem } from '../../data/interfaces/unit/unit-emblem';
import { TeamDataService } from '../../services/team-data-service';
import { IEmblem } from '../../data/interfaces/system/emblem';
import { MatDivider } from '@angular/material/divider';
import { UnitSkill } from "../unit-skill/unit-skill";
import { UnitInventoryItem } from '../unit-inventory-item/unit-inventory-item';
import { UnitEngageAttack } from "../unit-engage-attack/unit-engage-attack";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'unit-emblem',
  imports: [MatDivider, UnitSkill, UnitInventoryItem, UnitEngageAttack, MatTooltip],
  templateUrl: './unit-emblem.html',
  styleUrl: './unit-emblem.scss',
})
export class UnitEmblem implements OnChanges {
  //External inputs
  public emblem = input.required<IUnitEmblem>();

  //Constants
  private readonly defaultExpansionState: boolean = false;

  //Internal attributes
  protected systemData = signal<IEmblem | undefined>(undefined);
  protected isExpanded = signal<boolean>(this.defaultExpansionState);
  
  protected isEngaged: Signal<boolean> = computed(() => this.emblem().isEngaged ?? false);
  protected engagedAuraColor: Signal<string> = computed(() => this.systemData()?.engagedUnitAura ?? "var(--primary-theme-color)");

  constructor(protected readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.teamDataService.getEmblemByName(this.emblem().name));
    this.isExpanded.set(this.defaultExpansionState);
  }
}
