import { Card, Character, Identity } from './CommonStructs';
import { theConfigManager } from './ConfigManager';
import Equip from './Equip';
import EventHub from './EventHub';
import { PlayerBehavior } from './PlayerEvent';
import { externGamePlayerHandlers, PlayerHandler } from './PlayerHandler';
import Skill from './skills/Skill';
import { querySkill } from './skills/SkillConfig';
import { Utility } from './Utility';

export default class GamePlayer {
    public equips: Equip[] = [];
    public skills: Skill[] = [];
    public cards: Card[] = [];

    public identity: Identity = null;
    public order: number = -1;

    public curHp: number = 0;
    public maxHp: number = 0;
    public curCardNum: number = 0;
    public maxCardNum: number = 0;
    public distanceWeapon: number = 0;
    public distanceAttackHorse: number = 0;
    public distanceDefanceHorse: number = 0;

    public isValid: boolean = true;

    private readonly __character: Character = null;
    private readonly __eventHub: EventHub<PlayerBehavior> = null;

    get name() {
        return this.__character.name;
    }

    get country() {
        return this.__character.country;
    }

    get id() {
        return this.__character.id;
    }

    get sex() {
        return this.__character.sex;
    }

    constructor(character: Character) {
        this.__character = character;
        this.curHp = this.__character.life;
        this.maxHp = this.__character.life;
        this.curCardNum = this.__character.life;
        this.maxCardNum = this.__character.life;
        this.distanceAttackHorse = 1;
        this.distanceAttackHorse = 0;
        this.distanceDefanceHorse = 0;
        this.__eventHub = new EventHub();
    }

    initSkills() {
        for (const spellId of this.__character.spells) {
            this.addSkill(spellId);
        }
    }

    addSkill(spellId: number) {
        const index = Utility.indexOf(this.skills, (skill) => skill.id === spellId);
        if (index >= 0) {
            return;
        }
        const skill = new (querySkill(spellId))(theConfigManager.querySpell(spellId), this);
        skill.attachWithPlayer();
        this.skills.push(skill);
    }

    removeSkill(spellId: number) {
        const index = Utility.indexOf(this.skills, (skill) => skill.id === spellId);
        if (index < 0) {
            return;
        }
        const skill = this.skills[index];
        skill.removeFromPlayer();
        this.skills.splice(index, 1);
    }

    addEquip(card: Card) {
        const index = Utility.indexOf(this.equips, (equip) => equip.id === card.id);
        if (index >= 0) {
            return;
        }
        const equip = new Equip(card, this);
        equip.attachWithPlayer();
        this.equips.push(equip);
    }

    removeEquip(card: Card) {
        const index = Utility.indexOf(this.equips, (equip) => equip.id === card.id);
        if (index < 0) {
            return;
        }
        const equip = this.equips[index];
        equip.removeFromPlayer();
        this.equips.splice(index, 1);
    }

    playCard(card: Card, player?: GamePlayer) {}

    gainCards(cards: Card[]) {
        this.cards = this.cards.concat(cards);
    }

    loseCards(cards: Card[]) {
        for (const card of cards) {
            const index = this.cards.indexOf(card);
            this.cards.splice(index, 1);
        }
    }

    updateHp(diff: number, isLoseHP: boolean = false) {
        this.curHp += diff;
        if (diff > 0) {
            // todo: 回复
        } else if (diff < 0 && !isLoseHP) {
            // todo: 受伤
        } else if (diff < 0 && isLoseHP) {
            // todo: 体力流失
        }
    }

    updateMaxHp(diff: number) {
        this.maxHp += diff;
        if (this.maxHp < this.curHp) {
            this.curHp = this.maxHp;
        }
        if (this.maxHp === 0) {
            // todo: 玩家阵亡
            this.isValid = false;
        }
    }
}

externGamePlayerHandlers(PlayerHandler);
