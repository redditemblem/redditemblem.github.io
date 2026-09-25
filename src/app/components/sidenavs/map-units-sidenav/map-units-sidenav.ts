import { Component, computed, ElementRef, inject, Signal, signal, ViewChild } from '@angular/core';
import { TeamDataService } from '../../../services/team-data-service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { IUnit } from '../../../data/interfaces/unit/unit';
import { UnitSidenavDisplay } from "../unit-sidenav-display/unit-sidenav-display";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MapEventService } from '../../../services/map-event-service';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'map-units-sidenav',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, UnitSidenavDisplay, MatButtonModule, MatIconModule, MatDivider],
  templateUrl: './map-units-sidenav.html',
  styleUrl: './map-units-sidenav.scss',
})
export class MapUnitsSidenav {
  @ViewChild('unitAutocompleteInput') unitAutocompleteInput!: ElementRef<HTMLInputElement>;
  
  //Internal attributes
  protected selectedUnit = new FormControl<IUnit | null>(null);
  private selectedUnitName = signal<string>('');
  protected isSelectedUnitPinned = computed(() => 
    this.eventService.unitPinStates()[this.selectedUnitName()] ?? false
  );

  protected filteredUnits: IUnit[] = [];

  constructor(protected readonly teamDataService: TeamDataService, protected readonly eventService: MapEventService) {
    this.teamDataService = inject(TeamDataService);
    this.eventService = inject(MapEventService);

    //Subscribe to external events
    this.eventService.switchDisplayToUnit
      .subscribe((unit) => {
        this.selectedUnit.setValue(unit);
      });
    this.selectedUnit.valueChanges
      .subscribe((value) => {
        this.selectedUnitName.set(value?.name ?? '');
      });
  }

  /** Pulls the full units list and filters it to units with names that contain the search value. */
  protected filterUnits() {
    const filterValue = this.unitAutocompleteInput.nativeElement.value.toLowerCase();
    this.filteredUnits = this.teamDataService.getUnitsList()
      .filter(unit => 
        unit.name.toLowerCase().includes(filterValue) || unit.normalizedName.toLowerCase().includes(filterValue)
      )
      .sort((a, b) => this.sortUnits(a, b));
  }

  /** Sorts `unitA` and `unitB` alphabetically by name, case insensitive. */
  private sortUnits(unitA: IUnit, unitB: IUnit) {
    const isUnitAPinned: boolean = this.eventService.getPinnedStateForUnit(unitA.name);
    const isUnitBPinned: boolean = this.eventService.getPinnedStateForUnit(unitB.name);

    if(isUnitAPinned && !isUnitBPinned) return -1;
    if(!isUnitAPinned && isUnitBPinned) return 1;
    
    return unitA.name.toLowerCase().localeCompare(unitB.name.toLowerCase());
  }

  /** If the `unit` exists, returns the unit's name. Otherwise, returns an empty string. */
  protected formatAutocompleteDisplayValue(unit: IUnit): string {
    return (unit && unit.name) ? unit.name : '';
  }

  /** Returns true if `unit`'s affiliation is configured to horizontally flip sprites. */
  protected shouldFlipUnitSprite(unit: IUnit) : boolean {
    return this.teamDataService.getAffiliationByName(unit.affiliation)?.flipUnitSprites ?? false;
  }

  protected pinButton_OnClick() {
    if(this.selectedUnit.value === null) return;
    this.eventService.toggleUnitPinnedState(this.selectedUnit.value);
  }
}
