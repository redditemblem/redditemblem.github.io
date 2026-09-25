import { Component, input } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'text-fields-with-labeled-header',
  imports: [MatIconModule],
  templateUrl: './text-fields-with-labeled-header.html',
  styleUrl: './text-fields-with-labeled-header.scss',
})
export class TextFieldsWithLabeledHeader {
  //External inputs
  public label = input.required<string | undefined>();
  public title = input.required<string | undefined>();

  public spriteURL = input<string | undefined>(undefined);
  public titleHref = input<string | undefined>(undefined);
  public textFields = input<string[] | undefined>(undefined);
}