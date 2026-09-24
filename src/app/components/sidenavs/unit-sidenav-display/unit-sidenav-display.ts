import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { IUnit } from '../../../data/interfaces/unit/unit';
import { MatIconButton } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeamDataService } from '../../../services/team-data-service';
import { TextFieldsWithLabeledHeader } from "../../text-fields-with-labeled-header/text-fields-with-labeled-header";
import { IAffiliation } from '../../../data/interfaces/system/affiliation';
import { IClass } from '../../../data/interfaces/system/class';
import { Currency } from '../../currency/currency';
import { UnitTag } from '../../unit-tag/unit-tag';
import { UnitHpBar } from '../../unit-hp-bar/unit-hp-bar';
import { KeyValuePipe } from '@angular/common';
import { ModifiedUnitStat } from '../../modified-unit-stat/modified-unit-stat';
import { UnitStatusCondition } from '../../unit-status-condition/unit-status-condition';
import { MatDivider } from '@angular/material/divider';
import { UnitInventoryItem } from '../../unit-inventory-item/unit-inventory-item';
import { UnitSkill } from "../../unit-skill/unit-skill";
import { UnitWeaponRank } from "../../unit-weapon-rank/unit-weapon-rank";
import { UnitEmblem } from "../../unit-emblem/unit-emblem";
import { StatWithBuffIcon } from "../../stat-with-buff-icon/stat-with-buff-icon";
import { IBattleStyle } from '../../../data/interfaces/system/battle-style';
import { MapEventService } from '../../../services/map-event-service';
import { UnitBattalion } from '../../unit-battalion/unit-battalion';
import { Adjutant } from '../../adjutant/adjutant';
import { CombatArt } from "../../combat-art/combat-art";
import { StringDictionary } from '../../../data/interfaces/common/dictionaries';

@Component({
  selector: 'unit-sidenav-display',
  imports: [MatIconButton, TextFieldsWithLabeledHeader, Currency, UnitTag, UnitHpBar, KeyValuePipe, ModifiedUnitStat, UnitStatusCondition, MatDivider, UnitInventoryItem, UnitSkill, UnitWeaponRank, UnitEmblem, StatWithBuffIcon, MatTooltipModule, UnitBattalion, Adjutant, CombatArt],
  templateUrl: './unit-sidenav-display.html',
  styleUrl: './unit-sidenav-display.scss',
})
export class UnitSidenavDisplay implements OnChanges {
  //External inputs
  unit = input.required<IUnit>();

  //Constants
  private readonly defaultUnitInfoExpansionState: boolean = false;
  private readonly defaultStatsExpansionState: boolean = false;
  private readonly defaultInventoryExpansionState: boolean = true;
  private readonly defaultEmblemExpansionState: boolean = true;
  private readonly defaultBattalionExpansionState: boolean = true;
  private readonly defaultSkillsExpansionState: boolean = true;
  private readonly defaultAdjutantsExpansionState: boolean = true;

  //Internal attributes
  protected isUnitInfoExpanded = signal<boolean>(this.defaultUnitInfoExpansionState);
  protected isStatsInfoExpanded = signal<boolean>(this.defaultStatsExpansionState);
  protected isInventoryExpanded = signal<boolean>(this.defaultInventoryExpansionState);
  protected isEmblemExpanded = signal<boolean>(this.defaultEmblemExpansionState);
  protected isBattalionExpanded = signal<boolean>(this.defaultBattalionExpansionState); 
  protected isSkillsInfoExpanded = signal<boolean>(this.defaultSkillsExpansionState);
  protected isAdjutantsExpanded = signal<boolean>(this.defaultAdjutantsExpansionState);

  constructor(protected readonly teamDataService: TeamDataService, private readonly eventService: MapEventService) {
    this.teamDataService = inject(TeamDataService);
    this.eventService = inject(MapEventService);
  }

  ngOnChanges() {
    //Every time unit() changes, reset expansion defaults
    this.isUnitInfoExpanded.set(this.defaultUnitInfoExpansionState);
    this.isStatsInfoExpanded.set(this.defaultStatsExpansionState);
    this.isInventoryExpanded.set(this.defaultInventoryExpansionState);
    this.isEmblemExpanded.set(this.defaultEmblemExpansionState);
    this.isBattalionExpanded.set(this.defaultBattalionExpansionState);
    this.isSkillsInfoExpanded.set(this.defaultSkillsExpansionState);
    this.isAdjutantsExpanded.set(this.defaultAdjutantsExpansionState);
  }

  protected toggleUnitInfoExpansion() { this.isUnitInfoExpanded.set(!this.isUnitInfoExpanded()); }
  protected toggleStatExpansion() { this.isStatsInfoExpanded.set(!this.isStatsInfoExpanded()); }
  protected toggleInventoryExpansion() { this.isInventoryExpanded.set(!this.isInventoryExpanded()); }
  protected toggleEmblemExpansion() { this.isEmblemExpanded.set(!this.isEmblemExpanded()); }
  protected toggleBattalionExpansion() { this.isBattalionExpanded.set(!this.isBattalionExpanded()); }
  protected toggleSkillsExpansion() { this.isSkillsInfoExpanded.set(!this.isSkillsInfoExpanded()); }
  protected toggleAdjutantExpansion() { this.isAdjutantsExpanded.set(!this.isAdjutantsExpanded()); }
  
  protected pairedUnitLink_OnClick(pairedUnitName: string) {
    const pairedUnit: IUnit | undefined = this.teamDataService.getUnitByName(pairedUnitName);
    if (pairedUnit === undefined) {
      console.error(`Failed to find unit with name \"${pairedUnitName}\".`);
      return;
    }

    this.eventService.switchDisplayedUnit(pairedUnit);
  }

  protected dictionaryHasKeys(dict: StringDictionary<any> | undefined) : boolean {
    if(dict === null || dict === undefined) return false;
    return Object.keys(dict).length > 0;
  }

  protected doNotSortByKey() : number { return 0; }

  protected buildUnitNameplateSubtext() : string {
    const level: number = this.unit().stats.level;
    const classes: string[] = this.unit().classes ?? [];

    let subtext: string = "";

    if(level > 0)
      subtext += `Lvl. ${level} `;

    if (classes.length > 0)
      subtext += classes.at(0);

    return subtext.trimEnd();
  }

  protected getUnitAffiliation() : IAffiliation | undefined {
    return this.teamDataService.getAffiliationByName(this.unit().affiliation);
  }

  protected shouldFlipUnitSprite() : boolean {
    const aff = this.getUnitAffiliation();
    return aff?.flipUnitSprites ?? false;
  }

  protected getUnitBattleStyle(name: string) : IBattleStyle | undefined {
    return this.teamDataService.getBattleStyleByName(name);
  }

  protected getUnitClass(name: string) : IClass | undefined {
    return this.teamDataService.getClassByName(name);
  }
}
