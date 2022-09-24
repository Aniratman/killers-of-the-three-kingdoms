import { Card, CardValue } from '../common/CommonStructs';
import { PlayerBehavior } from '../controler/BehaviorEvent';

export default class PlayCard {
    private readonly __card: Card = null;

    get name() {
        return this.__card.name;
    }

    get id() {
        return this.__card.id;
    }

    get spell() {
        return this.__card.spell;
    }

    private __behavior: PlayerBehavior = null;
    get behavior() {
        return this.__behavior;
    }

    constructor(card: Card) {
        this.__card = card;
        this.initBehavior();
    }

    initBehavior() {
        const value = CardValue[this.__card.spell] ? CardValue[this.__card.spell] : CardValue[CardValue.USE_EQUIP];
        this.__behavior = PlayerBehavior[value];
    }
}
