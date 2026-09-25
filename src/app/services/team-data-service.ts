import { inject, Injectable, signal } from '@angular/core';
import { IMapData } from '../data/interfaces/map/map-data';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IUnit } from '../data/interfaces/unit/unit';
import { IAffiliation } from '../data/interfaces/system/affiliation';
import { IClass } from '../data/interfaces/system/class';
import { IInterfaceLabels } from '../data/interfaces/system/interface-labels';
import { ICurrencyConstants } from '../data/interfaces/system/currency-constants';
import { ITag } from '../data/interfaces/system/tag';
import { IStatusCondition } from '../data/interfaces/system/status-condition';
import { IItem } from '../data/interfaces/system/item';
import { IEngraving } from '../data/interfaces/system/engraving';
import { ISkill } from '../data/interfaces/system/skill';
import { IMapConstants } from '../data/interfaces/map/map-constants';
import { IEmblem } from '../data/interfaces/system/emblem';
import { IEngageAttack } from '../data/interfaces/system/engage-attack';
import { IEngravingLookupService } from './interfaces/engraving-lookup-service';
import { ICurrencyConstantsLookupService } from './interfaces/currency-constants-lookup-service';
import { ISkillLookupService } from './interfaces/skill-lookup-service';
import { IBattleStyle } from '../data/interfaces/system/battle-style';
import { IBattalion } from '../data/interfaces/system/battalion';
import { IGambit } from '../data/interfaces/system/gambit';
import { IAdjutant } from '../data/interfaces/system/adjutant';
import { ICombatArt } from '../data/interfaces/system/combat-art';
import { ITerrainType } from '../data/interfaces/system/terrain-type';
import { ICoordinate } from '../data/interfaces/map/coordinate';
import { IMapSegment } from '../data/interfaces/map/map-segment';
import { ITileObjectInstance } from '../data/interfaces/map/tile-object-instance';
import { ITileObject } from '../data/interfaces/system/tile-object';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { ITile } from '../data/interfaces/map/tile';
import { ITerrainTypeLookupService } from './interfaces/terrain-type-lookup-service';

@Injectable({
  providedIn: 'root',
})
export class TeamDataService implements ICurrencyConstantsLookupService, IEngravingLookupService, ISkillLookupService, ITerrainTypeLookupService {

  private readonly apiUrl = 'https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/map/';

  private errors = signal<string[]>([]);
  public readonly errorMessages = this.errors.asReadonly();

  private mapLocked = signal<boolean>(false);
  public readonly isMapLocked = this.mapLocked.asReadonly();

  private map = signal<IMapData>({});
  public readonly mapData = this.map.asReadonly();

  constructor(private readonly http: HttpClient) {
    this.http = inject(HttpClient);
  }

  public async loadDataForTeam(teamName: string) {
    this.errors.set([]);
    this.mapLocked.set(false);
    this.map.set({});

    await firstValueFrom(this.http.get<IMapData>(`${this.apiUrl}${teamName}`, {responseType: 'json'}))
      .then((response: IMapData) => {
        this.map.set(response);
      })
      .catch((response: HttpErrorResponse) => {
        if (response.status === 0) {
          this.errors.set(["HTTP request failed. Unable to contact the API endpoint."]);
        }
        else {
          this.mapLocked.set(response.status === 403);

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
  
  public getWorksheetID() : string | undefined { return this.mapData().workbookID; }
  public isConvoyConfigured() : boolean { return this.mapData().showConvoyLink ?? false; }
  public isShopConfigured() : boolean { return this.mapData().showShopLink ?? false; }
  public getChapterPostUrl() : string | undefined { return this.mapData().map?.chapterPostURL; }

  public getUnitsList() : IUnit[] {
    return this.mapData().units ?? [];
  }

  public getMapConstants() : IMapConstants | undefined {
	  return this.mapData().map?.constants;
  }

  public getCurrencyConstants() : ICurrencyConstants | undefined {
	  return this.mapData().system?.constants.currency;
  }

  public getSegmentByCoordinate(coordinate: ICoordinate) : IMapSegment | undefined {
    return this.mapData().map?.segments.find(s => 
      s.horizontalTileRangeWithinMap.start.value <= coordinate.x && s.horizontalTileRangeWithinMap.end.value >= coordinate.x
    );
  }

  public getTileByCoordinate(coordinate: ICoordinate) : ITile | undefined {
    const segment: IMapSegment | undefined = this.getSegmentByCoordinate(coordinate);
    if (segment === undefined)
      return undefined;

    const x: number = coordinate.x - segment.horizontalTileRangeWithinMap.start.value;
    return segment.tiles[coordinate.y - 1][x];
  };

  // #region Interface Labels

  private getInterfaceLabels() : IInterfaceLabels | undefined {
	return this.mapData().system?.interfaceLabels;
  }

  public getAdjutantsInterfaceLabel() : string {
	return this.getInterfaceLabels()?.adjutants ?? "Adjutants";
  }

  public getBattalionInterfaceLabel() : string {
	return this.getInterfaceLabels()?.battalion ?? "Battalion";
  }

  public getBattleStyleInterfaceLabel() : string {
	return this.getInterfaceLabels()?.battleStyle ?? "Battle Style";
  }

  public getClassInterfaceLabel() : string {
	return this.getInterfaceLabels()?.class ?? "Class";
  }

  public getCombatArtsInterfaceLabel() : string {
	return this.getInterfaceLabels()?.combatArts ?? "Combat Arts";
  }

  public getEmblemInterfaceLabel() : string {
	return this.getInterfaceLabels()?.emblem ?? "Emblem";
  }

  public getGambitInterfaceLabel() : string {
	return this.getInterfaceLabels()?.gambit ?? "Gambit";
  }

  public getInventoryInterfaceLabel() : string {
	return this.getInterfaceLabels()?.inventory ?? "Inventory";
  }

  public getInventorySubsectionInterfaceLabel(subsectionIndex: number) : string {
	const labels = this.getInterfaceLabels()?.inventorySubsections ?? [];
	return labels[subsectionIndex] ?? "";
  }

  public getSkillsInterfaceLabel() : string {
	return this.getInterfaceLabels()?.skills ?? "Skills";
  }

  public getSkillSubsectionInterfaceLabel(subsectionIndex: number) : string {
	const labels = this.getInterfaceLabels()?.skillSubsections ?? [];
	return labels[subsectionIndex] ?? "";
  }

  public getStatusConditionsInterfaceLabel() : string {
	return this.getInterfaceLabels()?.statusConditions ?? "Status Conditions";
  }

  public getWeaponRanksInterfaceLabel() : string {
	return this.getInterfaceLabels()?.weaponRanks ?? "Weapon Ranks";
  }

  // #endregion Interface Labels

  public getAffiliationByName(name: string) : IAffiliation | undefined {
    const dict = this.mapData().system?.affiliations;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getAdjutantByName(name: string) : IAdjutant | undefined {
    const dict = this.mapData().system?.adjutants;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getBattalionByName(name: string) : IBattalion | undefined {
    const dict = this.mapData().system?.battalions;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getBattleStyleByName(name: string) : IBattleStyle | undefined {
    const dict = this.mapData().system?.battleStyles;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getClassByName(name: string) : IClass | undefined {
    const dict = this.mapData().system?.classes;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getCombatArtByName(name: string) : ICombatArt | undefined {
    const dict = this.mapData().system?.combatArts;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getEmblemByName(name: string) : IEmblem | undefined { 
    const dict = this.mapData().system?.emblems;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getEngageAttackByName(name: string) : IEngageAttack | undefined {
    const dict = this.mapData().system?.engageAttacks;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getEngravingByName(name: string) : IEngraving | undefined { 
    const dict = this.mapData().system?.engravings;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getGambitByName(name: string) : IGambit | undefined {
    const dict = this.mapData().system?.gambits;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getItemByName(name: string) : IItem | undefined {
    const dict = this.mapData().system?.items;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getSkillByName(name: string) : ISkill | undefined {
    const dict = this.mapData().system?.skills;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getStatusConditionByName(name: string) : IStatusCondition | undefined {
    const dict = this.mapData().system?.statusConditions;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getTagByName(name: string) : ITag | undefined {
    const dict = this.mapData().system?.tags;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getTerrainTypeByName(name: string) : ITerrainType | undefined {
    const dict = this.mapData().system?.terrainTypes;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getTileObjectByName(name: string) : ITileObject | undefined {
    const dict = this.mapData().system?.tileObjects;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getTileObjectInstanceByID(id: number, coordinate: ICoordinate) : ITileObjectInstance | undefined {
    const segment: IMapSegment | undefined = this.getSegmentByCoordinate(coordinate);
    if (segment === undefined) return undefined;
    
    return segment.tileObjectInstances[id];
  }

  public getUnitByName(name: string) : IUnit | undefined {
    let array = this.mapData().units ?? [];
    return array.find(unit => unit.name == name);
  }
}