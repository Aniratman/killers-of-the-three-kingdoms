import { Character, Identity } from '../common/CommonStructs';
import { theConfigManager } from '../controler/ConfigManager';
import Equip from './Equip';
import PlayCard from './PlayCard';
import { externGamePlayerFunctions, StageHandler } from './StageHandler';
import Robot from '../robots/Robot';
import { RobotConfig } from '../robots/RobotConfig';
import Skill from '../skills/Skill';
import { querySkill } from '../skills/SkillConfig';
import { Utility } from '../common/Utility';
import { BehaviorListener, StageListener } from './GameInterface';
import { BehaviorHandler } from './BehaviorHandler';
import { theGameManager } from '../controler/GameManager';

export default class GamePlayer implements Partial<StageListener>, Partial<BehaviorListener> {
    public equips: Equip[] = [];
    public skills: Skill[] = [];
    public handCards: PlayCard[] = [];
    public judgeCards: PlayCard[] = [];
    public extraCards: PlayCard[] = [];

    public identity: Identity = null;
    public order: number = -1;

    public curHp: number = 0;
    public maxHp: number = 0;
    public curCardNum: number = 0;
    public maxCardNum: number = 0;
    public distanceWeapon: number = 1;
    public distanceAttackHorse: number = 0;
    public distanceDefanceHorse: number = 0;

    public gainCardNum: number = 2;

    public useWineNum: number = 0;

    public isValid: boolean = true;

    public robot: Robot = null;

    private readonly __character: Character = null;

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
    }

    static create(character: Character, identity: Identity, order: number) {
        const player = new GamePlayer(character);
        player.identity = identity;
        player.order = order;
        player.initSkills();
        player.registerStageEvents();
        player.registerBehaviorEvents();
        return player;
    }

    registerStageEvents() {
        Reflect.get(Reflect.getPrototypeOf(this), 'registerStageEvents').call(this);
    }

    registerBehaviorEvents() {
        Reflect.get(Reflect.getPrototypeOf(this), 'registerBehaviorEvents').call(this);
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

    addEquip(card: PlayCard) {
        const index = Utility.indexOf(this.equips, (equip) => equip.id === card.id);
        if (index >= 0) {
            return;
        }
        const equip = new Equip(card, this);
        equip.attachWithPlayer();
        this.equips.push(equip);
    }

    removeEquip(card: PlayCard) {
        const index = Utility.indexOf(this.equips, (equip) => equip.id === card.id);
        if (index < 0) {
            return;
        }
        const equip = this.equips[index];
        equip.removeFromPlayer();
        this.equips.splice(index, 1);
    }

    playCard(card: PlayCard, player?: GamePlayer) {}

    gainCards(cards: PlayCard[]) {
        this.handCards = this.handCards.concat(cards);
        for (const card of cards) {
            console.log(`${this.name}获得了${card.name}`);
        }
    }

    loseCards(cards: PlayCard[]) {
        for (const card of cards) {
            const index = this.handCards.indexOf(card);
            this.handCards.splice(index, 1);
            console.log(`${this.name}丢弃了${card.name}`);
        }
        theGameManager.recycleCards(cards);
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

    attachRobot() {
        if (!this.robot) {
            this.robot = new RobotConfig[this.identity](this);
        }
        this.robot.enabled = true;
    }

    detachRobot() {
        if (!this.robot) {
            return;
        }
        this.robot.enabled = false;
    }
}

externGamePlayerFunctions(StageHandler);
externGamePlayerFunctions(BehaviorHandler);
