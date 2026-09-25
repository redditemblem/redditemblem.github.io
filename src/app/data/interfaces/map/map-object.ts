import { IMapConstants } from "./map-constants";
import { IMapSegment } from "./map-segment";

/** Equivalent to `MapObj.cs` */
export interface IMapObject {
    constants: IMapConstants,
    chapterPostURL: string,
    segments: IMapSegment[]
}