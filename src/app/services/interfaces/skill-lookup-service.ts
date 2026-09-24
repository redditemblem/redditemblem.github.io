import { ISkill } from "../../data/interfaces/system/skill";

/**
 * Interface requiring implementation of a getSkillByName() function.
 */
export interface ISkillLookupService {
    getSkillByName(name: string): ISkill | undefined;
}