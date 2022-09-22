import GamePlayer from './GamePlayer';
import PlayCard from './PlayCard';

export default class Equip {
    private readonly __card: PlayCard = null;
    private readonly __player: GamePlayer = null;

    get id() {
        return this.__card.id;
    }

    constructor(card: PlayCard, player: GamePlayer) {
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
