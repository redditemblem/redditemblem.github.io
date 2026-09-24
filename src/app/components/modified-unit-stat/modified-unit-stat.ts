import { Component, input } from '@angular/core';
import { IModifiedStatValue } from '../../data/interfaces/common/modified-stat-value';
import { KeyValuePipe } from '@angular/common';
import { StatWithBuffIcon } from "../stat-with-buff-icon/stat-with-buff-icon";

@Component({
  selector: 'modified-unit-stat',
  imports: [KeyValuePipe, StatWithBuffIcon],
  templateUrl: './modified-unit-stat.html',
  styleUrl: './modified-unit-stat.scss',
})
export class ModifiedUnitStat {
  //External inputs
  public name = input.required<string>();
  public values = input.required<IModifiedStatValue>();
  public expanded = input<boolean>(false);
}
