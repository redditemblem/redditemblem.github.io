import { Component, inject, input, OnChanges, signal } from '@angular/core';
import { TeamDataService } from '../../services/team-data-service';
import { ICoordinate } from '../../data/interfaces/map/coordinate';
import { ITileObject } from '../../data/interfaces/system/tile-object';
import { ITileObjectInstance } from '../../data/interfaces/map/tile-object-instance';
import { TextFieldsWithLabeledHeader } from "../text-fields-with-labeled-header/text-fields-with-labeled-header";
import { StringDictionary } from '../../data/interfaces/common/dictionaries';
import { KeyValuePipe } from '@angular/common';
import { TileObjectHpBar } from "../tile-object-hp-bar/tile-object-hp-bar";

@Component({
  selector: 'tile-object-instance',
  imports: [TextFieldsWithLabeledHeader, KeyValuePipe, TileObjectHpBar],
  templateUrl: './tile-object-instance.html',
  styleUrl: './tile-object-instance.scss',
})
export class TileObjectInstance implements OnChanges {

  //External inputs
  public id = input.required<number>();
  public coordinate = input.required<ICoordinate>();

  //Internal attributes
  protected instanceData = signal<ITileObjectInstance | undefined>(undefined);
  protected systemData = signal<ITileObject | undefined>(undefined);

  constructor(private readonly teamDataService: TeamDataService) {
    this.teamDataService = inject(TeamDataService);
  }

  ngOnChanges() {
    this.instanceData.set(this.teamDataService.getTileObjectInstanceByID(this.id(), this.coordinate()));
    if (this.instanceData() === undefined) return;

    this.systemData.set(this.teamDataService.getTileObjectByName(this.instanceData()!.name));
  }

  protected dictHasKeys(dict: StringDictionary<any> | undefined) : boolean {
    if (dict === undefined) 
      return false;
    return Object.keys(dict).length > 0;
  }

  protected doNotSortByKey() : number { return 0; }
}
