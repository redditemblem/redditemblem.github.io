import { StringDictionary } from "../../common/dictionaries";
import { IUnitInventoryItemStat } from "../../unit/unit-inventory-item-stat";

/** Equivalent to `ShopItem`.cs */
export interface IShopItem {
    name: string,
    stats: StringDictionary<IUnitInventoryItemStat>,
    price: number,
    salePrice: number,
    stock: number,
    isNew: boolean,
    tags: string[],
    engravings: string[]
}