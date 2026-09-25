import { inject, Injectable, signal } from '@angular/core';
import { IConvoyData } from '../data/interfaces/storage/convoy/convoy-data';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IConvoyItem } from '../data/interfaces/storage/convoy/convoy-item';
import { IItem } from '../data/interfaces/system/item';
import { IEngraving } from '../data/interfaces/system/engraving';
import { ITag } from '../data/interfaces/system/tag';
import { ISkill } from '../data/interfaces/system/skill';
import { IItemSort } from '../data/interfaces/storage/item-sort';
import { IEngravingLookupService } from './interfaces/engraving-lookup-service';
import { ISkillLookupService } from './interfaces/skill-lookup-service';
import { lastValueFrom } from 'rxjs';
import { ICurrencyConstantsLookupService } from './interfaces/currency-constants-lookup-service';
import { ICurrencyConstants } from '../data/interfaces/system/currency-constants';

@Injectable({
  providedIn: 'root',
})
export class ConvoyDataService implements ICurrencyConstantsLookupService, IEngravingLookupService, ISkillLookupService {

  private readonly apiUrl = 'https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/convoy/';

  private errors = signal<string[]>([]);
  public readonly errorMessages = this.errors.asReadonly();

  private convoyConfigured = signal<boolean>(true);
  public readonly isConvoyConfigured = this.convoyConfigured.asReadonly();

  private convoy = signal<IConvoyData | undefined>(undefined);
  public readonly convoyData = this.convoy.asReadonly();

  constructor(private readonly http: HttpClient) {
    this.http = inject(HttpClient);
  }

  public async loadDataForTeam(teamName: string) {
    this.errors.set([]);
    this.convoyConfigured.set(true);
    this.convoy.set(undefined);

    await lastValueFrom(this.http.get<IConvoyData>(`${this.apiUrl}${teamName}`, {responseType: 'json'}))
      .then((response: IConvoyData) => {
          this.convoy.set(response);
      })
      .catch((response: HttpErrorResponse) => {
        if (response.status === 0) {
          this.errors.set(["HTTP request failed. Unable to contact the API endpoint."]);
        }
        else {
          this.convoyConfigured.set(response.status !== 403);

          const nestedErrors: string[] = this.flattenNestedErrorMessages(response.error, []);
          this.errors.set(nestedErrors);
       }
    });
  }

  /** Recursively loops through nested exceptions and flattens their messages into a string array. */
  private flattenNestedErrorMessages(error: any, messages: string[]) : string[] {
    if (error === null || error === undefined)
      return messages;

    const message: string = error.Message as string ?? error.message as string ?? "";
    if (message.length > 0)
      messages.push(message);

    return this.flattenNestedErrorMessages(error.InnerException ?? error.innerException, messages);
  }

  public getWorksheetID() : string | undefined { return this.convoyData()?.workbookID ?? ''; }
  public isShopConfigured() : boolean { return this.convoyData()?.showShopLink ?? false; }

  public getCurrencyConstants() : ICurrencyConstants | undefined {
    return this.convoyData()?.currency;
  } 

  public getConvoyItemsList() : IConvoyItem[] {
    return this.convoyData()?.convoyItems ?? [];
  }

  public getConvoyItemSorts() : IItemSort[] {
    return this.convoyData()?.parameters?.sorts ?? [];
  }

  public getConvoyItemCategories(): string[] { 
    return this.convoyData()?.parameters.itemCategories ?? [];
  }

  public getConvoyItemOwners() : string[] {
    return this.convoyData()?.parameters.owners ?? [];
  }

  public getConvoyItemUtilizedStats() : string[] {
    return this.convoyData()?.parameters.utilizedStats ?? [];
  }

  public getConvoyItemTargetedStats() : string[] {
    return this.convoyData()?.parameters.targetedStats ?? [];
  }

  public getEngravingByName(name: string) : IEngraving | undefined {
    const dict = this.convoyData()?.engravings;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getItemByName(name: string) : IItem | undefined {
    const dict = this.convoyData()?.items;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getSkillByName(name: string) : ISkill | undefined {
    const dict = this.convoyData()?.skills;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getTagByName(name: string) : ITag | undefined {
    const dict = this.convoyData()?.tags;
    if(!dict || !name) return undefined;
    else return dict[name];
  }
}
