import { inject, Injectable, signal } from '@angular/core';
import { IMapData } from '../data/interfaces/map/map-data';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { first, firstValueFrom } from 'rxjs';
import { IMapSegment } from '../data/interfaces/map/map-segment';
import { ITile } from '../data/interfaces/map/tile';
import { ITerrainType } from '../data/interfaces/system/terrain-type';
import { StringDictionary } from '../data/interfaces/common/dictionaries';
import { ITerrainTypeLookupService } from './interfaces/terrain-type-lookup-service';
import { IMapConstants } from '../data/interfaces/map/map-constants';

export interface IAnalysisWarpGroup {
  groupNumber: number,
  coordinates: string
};

@Injectable({
  providedIn: 'root',
})
export class MapAnalysisDataService implements ITerrainTypeLookupService {

  private readonly apiUrl = 'https://2zxk6z36pe.execute-api.us-east-2.amazonaws.com/Prod/api/map/analyze/';

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

  public getMapConstants() : IMapConstants | undefined {
    return this.mapData().map?.constants;
  }

  public getTerrainTypeByName(name: string) : ITerrainType | undefined {
    const dict = this.mapData().system?.terrainTypes;
    if(!dict || !name) return undefined;
    else return dict[name];
  }

  public getMovementTypes() : string[] {
    const terrainTypes: StringDictionary<ITerrainType> = this.mapData()?.system?.terrainTypes ?? {};
    const keys: string[] = Object.keys(terrainTypes);

    if (keys.length < 1) return [];
    
    const firstType: ITerrainType = terrainTypes[keys[0]];
    if ((firstType?.statGroups?.length ?? 0) < 1)
      return [];

    const costs: string[] = Object.keys(firstType.statGroups![0].movementCosts);
    return costs.sort();
  }

  public getTerrainTypes() : string[] {
    const terrainTypes: string[] = Object.keys(this.mapData()?.system?.terrainTypes ?? {});
    return terrainTypes.sort();
  }

  public getTerrainTypeAffiliationGroupings() : string[] {
    const affiliationGroups: string[] = [ "No Filter / Default" ];

    const terrainTypes: StringDictionary<ITerrainType> = this.mapData()?.system?.terrainTypes ?? {};
    const typesWithStatGroups: ITerrainType[] = Object.values(terrainTypes).filter(t => (t.statGroups?.length ?? 0) > 1);

    const affiliations: string[] = typesWithStatGroups.flatMap(t => t.statGroups?.flatMap(g => g.affiliationNames ?? []) ?? []);
    affiliationGroups.push(...[...new Set(affiliations)]);

    return affiliationGroups;
  }

  public getWarpGroupsList() : IAnalysisWarpGroup[] {
    const segments: IMapSegment[] = this.mapData()?.map?.segments ?? [];
    const warpGroups: IAnalysisWarpGroup[] = [];

    for (const segment of segments) {
      for (const row of segment.tiles) {
        
        //Search row of tiles for any in a warp group
        const tilesInWarpGroup: ITile[] = row.filter(t => (t.warpData?.inWarpGroup ?? false) && (t.warpData?.warpGroupNumber ?? 0) > 0);
        for (const tile of tilesInWarpGroup) {
          
          //If we haven't cataloged this warp group number yet, add it to our list
          if (!warpGroups.some(g => g.groupNumber === (tile.warpData?.warpGroupNumber ?? 0))) {
            warpGroups.push({
              groupNumber: tile.warpData?.warpGroupNumber ?? 0,
              coordinates: tile.warpData?.warpGroupCoordinates ?? ""
            });
          }
        }

      }
    }

    return warpGroups.sort((a, b) => a.groupNumber - b.groupNumber);
  }
}
