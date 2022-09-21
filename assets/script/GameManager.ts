import { director, Game, ISchedulable, math } from 'cc';
import { cloneDeep, shuffle } from 'lodash-es';
import { Card, Character } from './CommonStructs';
import { theConfigManager } from './ConfigManager';
import GameEvent, { GameStage } from './GameEvent';
import GamePlayer from './GamePlayer';
import GeneratorStack from './GeneratorStack';
import { Utility } from './Utility';

export default class GameManager extends GameEvent implements ISchedulable {
    private static __instance: GameManager = null;
    static get instance() {
        if (!this.__instance) {
            this.__instance = new GameManager();
        }
        return this.__instance;
    }

    public id?: string = 'GameManager';
    public uuid?: string = `GM_${Date.now()}`;

    public roundNum: number = 0;
    public curOrder: number = -1;

    public tableCards: Card[] = null;
    public garbageCards: Card[] = null;

    public characters: Character[] = null;
    public gamePlayers: GamePlayer[] = null;

    public isResponse: boolean = false;
    public generatorStack: GeneratorStack<boolean, GameStage, unknown> = null;

    public gameStage: GameStage = null;

    private constructor() {
        super();
        this.tableCards = [];
        this.garbageCards = [];
        this.characters = [];
        this.gamePlayers = [];
        this.generatorStack = new GeneratorStack();
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
            if (!this.tableCards.length) {
                console.warn('无牌可发');
                break;
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
            palyer['registerEvents']();
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
            this.gamePlayers[i].gainCards(cards);
        }
        this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_START));
        this.startStageScheduler();
    }

    switchCurrentPlayer(order: number) {
        this.curOrder = order >= this.gamePlayers.length ? 0 : order;
        const player = this.gamePlayers[this.curOrder];
        if (!player.isValid) {
            this.switchCurrentPlayer(this.curOrder + 1);
        }
        console.log(`*********当前是第${this.curOrder}位玩家回合*********`);
    }

    queryFirstPlayerOneRound() {
        for (let i = 0; i < this.gamePlayers.length; ++i) {
            if (this.gamePlayers[i].isValid) {
                return i;
            }
        }
        return 0;
    }

    queryLastPlayerOneRound() {
        for (let i = this.gamePlayers.length - 1; i > 0; i--) {
            if (this.gamePlayers[i].isValid) {
                return i;
            }
        }
        return this.gamePlayers.length - 1;
    }

    *createStageEventTriggerGenerator(stage: GameStage) {
        console.time('RESPONCE_STAGE');
        for (let i = 0; i < this.gamePlayers.length; ++i) {
            const player = this.gamePlayers[i];
            if (!player.isValid) {
                continue;
            }
            const nextParam = yield this.triggerEventListener(stage, player, this.gamePlayers[this.curOrder]);
        }
        console.timeEnd('RESPONCE_STAGE');
        console.log(`结束当前阶段响应:${GameStage[stage]}`);
        return stage;
    }

    startStageScheduler() {
        this.generatorStack.next();
        director.getScheduler().schedule(this.scheduleUpdate, this, 0.1);
    }

    private scheduleUpdate() {
        if (this.generatorStack && this.isResponse) {
            this.isResponse = false;
            const iterResult = this.generatorStack.next();
            if (iterResult.done) {
                const stage = iterResult.value as GameStage;
                this.switchStage(stage);
                this.generatorStack.next();
            } else if (!iterResult.value) {
                console.error('当前阶段回调失败');
            }
        }
    }

    switchStage(stage: GameStage) {
        switch (stage) {
            case GameStage.GAME_START:
                this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_ALL_BEGIN));
                break;
            case GameStage.GAME_ALL_BEGIN:
                this.roundNum++;
                console.log(`*********当前进行第${this.roundNum}轮*********`);
                this.switchCurrentPlayer(this.curOrder + 1);
                this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_SINGLE_PREPARE));
                break;
            case GameStage.GAME_SINGLE_PREPARE:
                this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_SINGLE_JUDGE));
                break;
            case GameStage.GAME_SINGLE_JUDGE:
                this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_SINGLE_DEAL_CARD));
                break;
            case GameStage.GAME_SINGLE_DEAL_CARD:
                this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_SINGLE_PLAY_CARD));
                break;
            case GameStage.GAME_SINGLE_PLAY_CARD:
                this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_SINGLE_GARBAGE_CARD));
                break;
            case GameStage.GAME_SINGLE_GARBAGE_CARD:
                this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_SINGLE_FINISH));
                break;
            case GameStage.GAME_SINGLE_FINISH:
                if (this.curOrder === this.queryLastPlayerOneRound()) {
                    this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_ALL_FINISH));
                } else {
                    this.switchCurrentPlayer(this.curOrder + 1);
                    this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_SINGLE_PREPARE));
                }
                break;
            case GameStage.GAME_ALL_FINISH:
                this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_ALL_BEGIN));
                break;
            case GameStage.GAME_END:
                this.generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_START));
                break;
            default:
                break;
        }
    }

    stopStageGenerator() {
        director.getScheduler().unschedule(this.scheduleUpdate, this);
    }
}

export const theGameManager = GameManager.instance;
