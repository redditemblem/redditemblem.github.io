import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TeamDataService } from '../../services/team-data-service';
import { ICurrencyConstants } from '../../data/interfaces/system/currency-constants';
import { ICurrencyConstantsLookupService } from '../../services/interfaces/currency-constants-lookup-service';

@Component({
  selector: 'currency',
  imports: [],
  template: `<p>{{formatCurrentString()}}</p>`,
  styles: `p { margin: 0px; }`
})
export class Currency implements OnInit{
  //External inputs
  public amount = input.required<number | undefined>();
  public dataService = input.required<ICurrencyConstantsLookupService>();

  //Internal attributes
  private constants = signal<ICurrencyConstants | undefined>(undefined);

  ngOnInit() {
    this.constants.set(this.dataService()?.getCurrencyConstants());
  }

  /** Formats the `amount()` into a display string. */
  protected formatCurrentString() : string {
    const value: number = this.amount() ?? 0;
    if(this.constants === undefined)
      return `${value}`;

    const currSymbol: string = this.constants()?.currencySymbol ?? "";
    
    if(this.constants()?.isSymbolLeftAligned) {
      if(this.constants()?.includeSpace) {
        return `${currSymbol} ${value}`;
      }
      else {
        return `${currSymbol}${value}`;
      }
    }
    else {
      if(this.constants()?.includeSpace) {
        return `${value} ${currSymbol}`;
      }
      else {
        return `${value}${currSymbol}`;
      }
    }
  }
}
