import { Card } from './CommonStructs';
import GamePlayer from './GamePlayer';

export default class Equip {
    private __card: Card = null;
    private __player: GamePlayer = null;

    get id() {
        return this.__card.id;
    }

    constructor(card: Card, player: GamePlayer) {
        this.__card = card;
        this.__player = player;
    }

    attachWithPlayer() {
        this.__player.addSkill(this.__card.spell);
    }

    removeFromPlayer() {
        this.__player.removeSkill(this.__card.spell);
    }
}
