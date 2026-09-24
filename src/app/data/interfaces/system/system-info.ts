import { StringDictionary } from "../common/dictionaries";
import { IInterfaceLabels } from "./interface-labels";
import { IClass } from "./class";
import { ISystemConstants } from "./system-constants";
import { ITerrainType } from "./terrain-type";
import { IAffiliation } from "./affiliation";
import { IItem } from "./item";
import { ITileObject } from "./tile-object";
import { ISkill } from "./skill";
import { IStatusCondition } from "./status-condition";
import { ITag } from "./tag";
import { IEngraving } from "./engraving";
import { ICombatArt } from "./combat-art";
import { IBattalion } from "./battalion";
import { IGambit } from "./gambit";
import { IAdjutant } from "./adjutant";
import { IBattleStyle } from "./battle-style";
import { IEmblem } from "./emblem";
import { IEngageAttack } from "./engage-attack";

/** Equivalent to `SystemInfo.cs` */
export interface ISystemInfo {
    constants: ISystemConstants,
    interfaceLabels: IInterfaceLabels,
    terrainTypes?: StringDictionary<ITerrainType>,
    classes?: StringDictionary<IClass>,
    affiliations?: StringDictionary<IAffiliation>,
    items?: StringDictionary<IItem>,
    tileObjects?: StringDictionary<ITileObject>,
    skills?: StringDictionary<ISkill>,
    statusConditions?: StringDictionary<IStatusCondition>,
    tags?: StringDictionary<ITag>,
    engravings?: StringDictionary<IEngraving>,
    combatArts?: StringDictionary<ICombatArt>,
    battalions?: StringDictionary<IBattalion>,
    gambits?: StringDictionary<IGambit>,
    adjutants?: StringDictionary<IAdjutant>,
    battleStyles?: StringDictionary<IBattleStyle>,
    emblems?: StringDictionary<IEmblem>,
    engageAttacks?: StringDictionary<IEngageAttack>
}