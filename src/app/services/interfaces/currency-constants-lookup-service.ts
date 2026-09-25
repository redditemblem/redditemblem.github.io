import { ICurrencyConstants } from "../../data/interfaces/system/currency-constants";

/**
 * Interface requiring implementation of a getCurrencyConstants() function.
 */
export interface ICurrencyConstantsLookupService {
    getCurrencyConstants(): ICurrencyConstants | undefined;
}