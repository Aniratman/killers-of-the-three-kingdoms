import { Card } from '../common/CommonStructs';

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

    constructor(card: Card) {
        this.__card = card;
    }
}
