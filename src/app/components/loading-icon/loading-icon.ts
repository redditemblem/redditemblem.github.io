import { Component, input } from '@angular/core';

@Component({
  selector: 'loading-icon',
  imports: [],
  templateUrl: './loading-icon.html',
  styleUrl: './loading-icon.scss',
})
export class LoadingIcon {
  public text = input<string>("Loading...");
}
