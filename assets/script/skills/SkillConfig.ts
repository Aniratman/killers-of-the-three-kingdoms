import Skill from './Skill';

export const SkillConfig: { [index: number]: typeof Skill } = {};

export function querySkill(spellId: number) {
    return SkillConfig[spellId] || Skill;
}
