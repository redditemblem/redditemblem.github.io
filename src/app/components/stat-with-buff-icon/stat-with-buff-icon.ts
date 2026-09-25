import { Component, input } from '@angular/core';

@Component({
  selector: 'stat-with-buff-icon',
  imports: [],
  templateUrl: './stat-with-buff-icon.html',
  styleUrl: './stat-with-buff-icon.scss',
})
export class StatWithBuffIcon {
  //External inputs
  public base = input.required<number>();
  public final = input.required<number>();
  public invertColors = input<boolean>(false);
  public height = input<number>(16);
}
