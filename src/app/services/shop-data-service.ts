import { inject, Injectable, signal } from '@angular/core';
import { ITag } from '../data/interfaces/system/tag';
import { ISkill } from '../data/interfaces/system/skill';
import { IItem } from '../data/interfaces/system/item';
import { IEngraving } from '../data/interfaces/system/engraving';
import { IShopItem } from '../data/interfaces/storage/shop/shop-item';
import { IItemSort } from '../data/interfaces/storage/item-sort';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IShopData } from '../data/interfaces/storage/shop/shop-data';
import { IEngravingLookupService } from './interfaces/engraving-lookup-service';
import { ICurrencyConstantsLookupService } from './interfaces/currency-constants-lookup-service';
import { ICurrencyConstants } from '../data/interfaces/system/currency-constants';
import { ISkillLookupService } from './interfaces/skill-lookup-service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShopDataService implements ICurrencyConstantsLookupService, IEngravingLookupService, ISkillLookupService {

  private readonly apiUrl = 'https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/shop/';

  private errors = signal<string[]>([]);
  public readonly errorMessages = this.errors.asReadonly();

  private shopConfigured = signal<boolean>(true);
  public readonly isShopConfigured = this.shopConfigured.asReadonly();

  private shop = signal<IShopData | undefined>(undefined);
  public readonly shopData = this.shop.asReadonly();

  constructor(private readonly http: HttpClient) {
	  this.http = inject(HttpClient);
  }

  public async loadDataForTeam(teamName: string) {
    this.errors.set([]);
    this.shopConfigured.set(true);
    this.shop.set(undefined);

    await firstValueFrom(this.http.get<IShopData>(`${this.apiUrl}${teamName}`, {responseType: 'json'}))
      .then((response: IShopData) => {
          this.shop.set(response);
      })
      .catch((response: HttpErrorResponse) => {
        if (response.status === 0) {
          this.errors.set(["HTTP request failed. Unable to contact the API endpoint."]);
        }
        else {
          this.shopConfigured.set(response.status !== 403);

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

  public getWorksheetID() : string | undefined { return this.shopData()?.workbookID ?? ''; }
  public isConvoyConfigured() : boolean { return this.shopData()?.showConvoyLink ?? false; }
  
  public getCurrencyConstants() : ICurrencyConstants | undefined {
	return this.shopData()?.currency;
  }

  public getShopItemsList() : IShopItem[] {
    return this.shopData()?.shopItems ?? [];
  }

  public getShopItemSorts() : IItemSort[] {
    return this.shopData()?.parameters?.sorts ?? [];
  }

  public getShopItemCategories(): string[] { 
  return this.shopData()?.parameters.itemCategories ?? [];
  }

  public getShopItemUtilizedStats() : string[] {
  return this.shopData()?.parameters.utilizedStats ?? [];
  }

  public getShopItemTargetedStats() : string[] {
  return this.shopData()?.parameters.targetedStats ?? [];
  }

  public getEngravingByName(name: string) : IEngraving | undefined {
    const dict = this.shopData()?.engravings;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getItemByName(name: string) : IItem | undefined {
    const dict = this.shopData()?.items;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getSkillByName(name: string) : ISkill | undefined {
    const dict = this.shopData()?.skills;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getTagByName(name: string) : ITag | undefined {
    const dict = this.shopData()?.tags;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

}
