import { Spell } from '../CommonStructs';
import GamePlayer from '../GamePlayer';

export default class Skill {
    protected maxHp: number = 0;
    protected maxCardNum: number = 0;
    protected distanceWeapon: number = 0;
    protected distanceAttackHorse: number = 0;
    protected distanceDefanceHorse: number = 0;

    private readonly __spell: Spell = null;
    private readonly __player: GamePlayer = null;

    get name() {
        return this.__spell.name;
    }

    get id() {
        return this.__spell.id;
    }

    get type() {
        return this.__spell.type;
    }

    get desc() {
        return this.__spell.desc;
    }

    constructor(spell: Spell, player: GamePlayer) {
        this.__spell = spell;
        this.__player = player;
        this.registerEvent();
    }

    registerEvent() {}

    attachWithPlayer() {
        this.__player.maxHp += this.maxHp;
        this.__player.maxCardNum += this.maxCardNum;
        this.__player.distanceWeapon += this.distanceWeapon;
        this.__player.distanceAttackHorse += this.distanceAttackHorse;
        this.__player.distanceDefanceHorse += this.distanceDefanceHorse;
    }

    removeFromPlayer() {
        this.__player.maxHp -= this.maxHp;
        this.__player.maxCardNum -= this.maxCardNum;
        this.__player.distanceWeapon -= this.distanceWeapon;
        this.__player.distanceAttackHorse -= this.distanceAttackHorse;
        this.__player.distanceDefanceHorse -= this.distanceDefanceHorse;
    }

    triggerEffect() {}
}
