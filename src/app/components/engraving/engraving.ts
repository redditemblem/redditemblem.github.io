import { Component, input, OnChanges, OnInit, signal } from '@angular/core';
import { IEngraving } from '../../data/interfaces/system/engraving';
import { IEngravingLookupService } from '../../services/interfaces/engraving-lookup-service';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'engraving',
  imports: [MatDivider],
  templateUrl: './engraving.html',
  styleUrl: './engraving.scss',
})
export class Engraving implements OnChanges {
  //External inputs
  public name = input.required<string>();
  public dataService = input.required<IEngravingLookupService>();

  //Internal attributes
  protected systemData = signal<IEngraving | undefined>(undefined);
  
  ngOnChanges() {
    this.systemData.set(this.dataService().getEngravingByName(this.name()));
  }
}
