import { Component, input, OnChanges, signal } from '@angular/core';

export interface IHpBarColorSet {
  "primary": string,
  "secondary": string,
  "border": string
}

@Component({
  selector: 'unit-hp-bar',
  imports: [],
  templateUrl: './unit-hp-bar.html',
  styles: `
    div.hpBar {
      width: 100%;
      height: 6px;
    }
  `
})
export class UnitHpBar implements OnChanges {
  //External inputs
  public percentage = input.required<number>();

  //Constants
  private static readonly overfilled: IHpBarColorSet = {
    "primary": "#992DE4",
    "secondary": "#d9cce3",
    "border": "#360b55"
  };

  private static readonly above50: IHpBarColorSet = {
    "primary": "#3CD66F",
    "secondary": "#d3efdd",
    "border": "#114923"
  };

  private static readonly above25: IHpBarColorSet = {
    "primary": "#FFC107",
    "secondary": "#fff4d4",
    "border": "#9d6b00"
  };

  private static readonly below25: IHpBarColorSet = {
    "primary": "#F13535",
    "secondary": "#efd1d1",
    "border": "#640707"
  };

  //Internal attributes
  protected colorSet = signal<IHpBarColorSet>(UnitHpBar.above50);

  ngOnChanges() {
    this.colorSet.set(UnitHpBar.getHpBarColorSet(this.percentage()));
  }

  public static getHpBarColorSet(hpPercentage: number) : IHpBarColorSet {
    if(hpPercentage > 100) return this.overfilled;
    if(hpPercentage > 50) return this.above50;  
    if(hpPercentage > 25) return this.above25;
    
    return this.below25;
  }
}