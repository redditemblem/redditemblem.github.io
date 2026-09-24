import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { TeamDataService } from '../../services/team-data-service';
import { ITag } from '../../data/interfaces/system/tag';

@Component({
  selector: 'unit-tag',
  imports: [],
  templateUrl: './unit-tag.html',
  styles: `
    div.tagContainer {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      column-gap: 4px;
      padding: 4px 8px 4px 8px;
      border-radius: 0px 8px 0px 8px;
      background: var(--tertiary-theme-color);

      img {
        max-height: 16px;
        max-width: 16px;
        object-fit: scale-down;
      }

      p {
        margin: 0px;
        max-width: 125px;
        overflow: hidden;
        font-family: macExtMinecraft;
        font-size: 0.7rem;
        text-overflow: ellipsis;
        text-wrap: nowrap;
      }
    }
  `
})
export class UnitTag implements OnChanges {
  //External inputs
  public tag = input.required<string>();

  //Internal attributes
  protected systemData = signal<ITag | undefined>(undefined);

  constructor(private readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.systemData.set(this.teamDataService.getTagByName(this.tag()));
  }
}
