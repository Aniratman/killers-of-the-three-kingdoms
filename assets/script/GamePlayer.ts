import { Card, Character, Identity } from './CommonStructs';
import { theConfigManager } from './ConfigManager';
import Equip from './Equip';
import EventHub from './EventHub';
import { GameStage } from './GameEvent';
import PlayerHandler from './PlayerHandler';
import Skill from './skills/Skill';
import { querySkill } from './skills/SkillConfig';
import { Utility } from './Utility';

export default class GamePlayer {
    public equips: Equip[] = [];
    public skills: Skill[] = [];
    public cards: Card[] = [];

    public identity: Identity = null;

    public curHp: number = 0;
    public maxHp: number = 0;
    public curCardNum: number = 0;
    public maxCardNum: number = 0;
    public distanceWeapon: number = 0;
    public distanceAttackHorse: number = 0;
    public distanceDefanceHorse: number = 0;

    public isValid: boolean = true;

    private readonly __character: Character = null;
    private readonly __eventHub: EventHub<GameStage> = null;
    private readonly __handlers: PlayerHandler = null;

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
        this.__handlers = new PlayerHandler(this);
    }

    registerEvents() {
        this.__handlers.registerEvents();
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

    catchCards(cards: Card[]) {
        this.cards = this.cards.concat(cards);
    }
}
