import { Component, input } from '@angular/core';
import { ITeamData } from '../../data/interfaces/team-data';
import { MatButton } from '@angular/material/button';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'team-listing',
  imports: [MatButton, RouterLink],
  templateUrl: './team-listing.html',
  styleUrl: './team-listing.scss',
})
export class TeamListing {
  //External inputs
  public team = input.required<ITeamData>();

  protected getTeamNameWithoutSpaces(): string{
    return this.team().teamName.replace(' ', '');
  }
}
