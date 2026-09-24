import { Component, input } from '@angular/core';

@Component({
  selector: 'unit-weapon-rank',
  imports: [],
  templateUrl: './unit-weapon-rank.html',
  styleUrl: './unit-weapon-rank.scss',
})
export class UnitWeaponRank {
  //External inputs
  public category = input.required<string>();
  public rank = input.required<string>();
}
