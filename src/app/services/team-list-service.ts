import { inject, Injectable, signal } from '@angular/core';

import { ITeamData } from '../data/interfaces/team-data';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeamListService {
  private readonly apiUrl = 'https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/teamList';


  private errors = signal<string[]>([]);
  public readonly errorMessages = this.errors.asReadonly();

  private teams = signal<ITeamData[]>([]);
  public readonly teamsList = this.teams.asReadonly();

  constructor(private readonly http: HttpClient)  {
    this.http = inject(HttpClient);
  }

  public async loadTeamsList() {
    this.errors.set([]);
    this.teams.set([]);
    
    await firstValueFrom(this.http.get<ITeamData[]>(this.apiUrl, {responseType: 'json'}))
      .then((response: ITeamData[]) => {
        this.teams.set(response);
      })
      .catch((response: HttpErrorResponse) => {
        this.errors.set(["An error occurred. Failed to load the teams list."]);
      });
  }
}
