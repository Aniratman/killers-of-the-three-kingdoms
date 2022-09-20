import { Game, math } from 'cc';
import { cloneDeep, shuffle } from 'lodash-es';
import { Card, Character } from './CommonStructs';
import { theConfigManager } from './ConfigManager';
import GameEvent, { GameStage } from './GameEvent';
import GamePlayer from './GamePlayer';
import { Utility } from './Utility';

export default class GameManager extends GameEvent {
    private static __instance: GameManager = null;
    static get instance() {
        if (!this.__instance) {
            this.__instance = new GameManager();
        }
        return this.__instance;
    }

    public roundNum: number = 0;
    public curOrder: number = 0;

    public tableCards: Card[] = null;
    public garbageCards: Card[] = null;

    public characters: Character[] = null;
    public gamePlayers: GamePlayer[] = null;

    public generatorStage: Generator = null;

    private constructor() {
        super();
        this.tableCards = [];
        this.garbageCards = [];
        this.characters = [];
        this.gamePlayers = [];
    }

    initTableCards() {
        this.tableCards = cloneDeep(theConfigManager.cards);
        shuffle(this.tableCards);
    }

    dealCards(count: number = 1) {
        const ret: Card[] = [];
        while (count) {
            if (!this.tableCards.length) {
                shuffle(this.garbageCards);
                Utility.swapValue(this.tableCards, this.garbageCards);
            }
            ret.push(this.tableCards.shift());
            count -= 1;
        }
        return ret;
    }

    recycleCards(garbage: Card | Card[]) {
        if (garbage instanceof Array) {
            while (garbage.length) {
                this.garbageCards.push(garbage.pop());
            }
        } else {
            this.garbageCards.push(garbage);
        }
    }

    judgeCard() {
        // todo:  触发判定
        const [card] = this.dealCards();
        // todo:  判定结束
        this.recycleCards(card);
    }

    initCharacters() {
        const characters = shuffle(cloneDeep(theConfigManager.characters));
        this.characters = characters.slice(0, 54);
    }

    initGamePlayers(count: number = 5) {
        for (let i = 0; i < count; ++i) {
            const index = math.randomRangeInt(0, this.characters.length);
            const [character] = this.characters.splice(index, 1);
            const palyer = new GamePlayer(character);
            palyer.initSkills();
            palyer.registerEvents();
            this.gamePlayers.push(palyer);
        }
    }

    calculateDistanceOfPlayers(own: GamePlayer, other: GamePlayer) {
        const ownIndex = Utility.indexOf(this.gamePlayers, own);
        const otherIndex = Utility.indexOf(this.gamePlayers, other);
        if (ownIndex < 0 || otherIndex < 0) {
            return -1;
        }
        const dinstance = Math.abs(ownIndex - otherIndex) + other.distanceDefanceHorse - own.distanceAttackHorse;
        return dinstance;
    }

    calculateAttackDistanceOfPlayers(own: GamePlayer, other: GamePlayer) {
        const baseDistance = this.calculateDistanceOfPlayers(own, other);
        if (baseDistance < 0) {
            return -1;
        }
        return baseDistance + own.distanceWeapon;
    }

    initGame() {
        this.initCharacters();
        this.initTableCards();
        this.initGamePlayers();
    }

    startGame() {
        for (let i = 0; i < this.gamePlayers.length; ++i) {
            const cards = this.dealCards(4);
            this.gamePlayers[i].catchCards(cards);
        }
        this.generatorStage = this.triggerEventWithGenerator(GameStage.GAME_START);
        while (!this.generatorStage.next().done) {
            this.generatorStage.next();
        }
    }

    *triggerEventWithGenerator(stage: GameStage) {
        for (let i = 0; i < this.gamePlayers.length; ++i) {
            const player = this.gamePlayers[i];
            if (!player.isValid) {
                continue;
            }
            yield this.triggerEventListener(stage, player);
        }
        console.log(`结束当前阶段响应:${GameStage[stage]}`);
        if (stage === GameStage.GAME_END) {
            return;
        }
        this.generatorStage = this.triggerEventWithGenerator(stage + 1);
    }
}

export const theGameManager = GameManager.instance;
