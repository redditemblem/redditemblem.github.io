import { StringDictionary } from "../../common/dictionaries";
import { ICurrencyConstants } from "../../system/currency-constants";
import { IEngraving } from "../../system/engraving";
import { IInterfaceLabels } from "../../system/interface-labels";
import { IItem } from "../../system/item";
import { ISkill } from "../../system/skill";
import { ITag } from "../../system/tag";
import { IFilterParameters } from "../filter-parameters";
import { IConvoyItem } from "./convoy-item";

/** Equivalent to `ConvoyData.cs` */
export interface IConvoyData {
    currency: ICurrencyConstants,
    interfaceLabels: IInterfaceLabels,
    parameters: IFilterParameters,
    workbookID: string,
    showShopLink: boolean,
    convoyItems: IConvoyItem[],
    items: StringDictionary<IItem>,
    skills: StringDictionary<ISkill>,
    tags: StringDictionary<ITag>,
    engravings: StringDictionary<IEngraving>
}