import { IMapObject } from "./map-object";
import { ISystemInfo } from "../system/system-info";
import { IUnit } from "../unit/unit";

/** Equivalent to `MapData.cs` */
export interface IMapData {
    map?: IMapObject
    system?: ISystemInfo
    units?: IUnit[],
    workbookID?: string,
    showConvoyLink?: boolean,
    showShopLink?: boolean
}