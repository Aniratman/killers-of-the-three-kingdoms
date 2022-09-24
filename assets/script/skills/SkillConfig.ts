import { NumberIndexSet } from '../common/CommonStructs';
import Skill from './Skill';

export const SkillConfig: NumberIndexSet<typeof Skill> = {};

export function querySkill(spellId: number) {
    return SkillConfig[spellId] || Skill;
}
