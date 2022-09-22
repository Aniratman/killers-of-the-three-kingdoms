import { assetManager, director, Game, ISchedulable, math } from 'cc';
import { cloneDeep, shuffle } from 'lodash-es';
import { Character, Identity } from '../common/CommonStructs';
import { theConfigManager } from './ConfigManager';
import GameEvent, { GameStage } from './GameEvent';
import GamePlayer from '../game/GamePlayer';
import GeneratorStack, { GeneratorNextData } from '../common/GeneratorStack';
import PlayCard from '../game/PlayCard';
import { Utility } from '../common/Utility';

const IdentityConfig: { [index: number]: Identity[] } = {
    2: [Identity.Emperor, Identity.Rebel],
    5: [Identity.Emperor, Identity.Minister, Identity.Rebel, Identity.Rebel, Identity.Provocateur],
    8: [Identity.Emperor, Identity.Minister, Identity.Minister, Identity.Rebel, Identity.Rebel, Identity.Rebel, Identity.Rebel, Identity.Provocateur],
};

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

    public playCards: PlayCard[] = null;
    public dumpCards: PlayCard[] = null;

    public identities: Identity[] = null;
    public characters: Character[] = null;
    public gamePlayers: GamePlayer[] = null;

    public identitySets: { [index: number]: number } = null;

    public isResponse: boolean = false;
    public gameStage: GameStage = null;

    private __generatorStack: GeneratorStack<boolean, GameStage, GeneratorNextData<unknown>> = null;

    private __playerNum: number = 0;
    get playerNum() {
        return this.__playerNum;
    }
    set playerNum(count: number) {
        this.__playerNum = count;
    }

    private constructor() {
        super();
        this.playCards = [];
        this.dumpCards = [];
        this.identities = [];
        this.characters = [];
        this.gamePlayers = [];
        this.identitySets = {
            [Identity.Emperor]: 0,
            [Identity.Minister]: 0,
            [Identity.Rebel]: 0,
            [Identity.Provocateur]: 0,
        };
        this.__generatorStack = new GeneratorStack();
    }

    initIdentities() {
        this.identities = shuffle(cloneDeep(IdentityConfig[this.__playerNum]));
    }

    initGameOrder() {
        const index = Utility.indexOf(this.identities, (identity) => identity === Identity.Emperor);
        this.curOrder = index;
    }

    initCharacters() {
        const characters = shuffle(cloneDeep(theConfigManager.characters));
        this.characters = characters.slice(0, 54);
    }

    initPlayerCards() {
        for (const card of theConfigManager.cards) {
            this.playCards.push(new PlayCard(card));
        }
        this.playCards = shuffle(this.playCards);
    }

    initGamePlayers() {
        for (let i = 0; i < this.__playerNum; ++i) {
            const index = math.randomRangeInt(0, this.characters.length);
            const [character] = this.characters.splice(index, 1);
            const player = GamePlayer.create(character, this.identities[i], i);
            player.attachRobot();
            this.gamePlayers.push(player);
            ++this.identitySets[player.identity];
        }
    }

    initGame() {
        this.initIdentities();
        this.initGameOrder();
        this.initCharacters();
        this.initPlayerCards();
        this.initGamePlayers();
    }

    dealCards(count: number = 1) {
        const ret: PlayCard[] = [];
        while (count) {
            if (!this.playCards.length) {
                shuffle(this.dumpCards);
                Utility.swapValue(this.playCards, this.dumpCards);
            }
            if (!this.playCards.length) {
                console.warn('无牌可发');
                break;
            }
            ret.push(this.playCards.shift());
            count -= 1;
        }
        return ret;
    }

    recycleCards(garbage: PlayCard | PlayCard[]) {
        if (garbage instanceof Array) {
            while (garbage.length) {
                this.dumpCards.push(garbage.pop());
            }
        } else {
            this.dumpCards.push(garbage);
        }
    }

    judgeCard() {
        // todo:  触发判定
        const [card] = this.dealCards();
        // todo:  判定结束
        this.recycleCards(card);
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

    startGame() {
        for (let i = 0; i < this.gamePlayers.length; ++i) {
            const cards = this.dealCards(4);
            this.gamePlayers[i].gainCards(cards);
        }
        this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_START));
        this.startStageScheduler();
    }

    setCurrentOrder(order: number) {
        this.curOrder = order >= this.gamePlayers.length ? 0 : order;
    }

    switchCurrentOrder() {
        this.curOrder = this.curOrder + 1 >= this.gamePlayers.length ? 0 : this.curOrder + 1;
        if (!this.gamePlayers[this.curOrder].isValid) {
            this.switchCurrentOrder();
        }
    }

    queryFirstPlayerOneRound() {
        for (let i = 0; i < this.gamePlayers.length; ++i) {
            if (this.gamePlayers[i].identity === Identity.Emperor) {
                return i;
            }
        }
        return 0;
    }

    queryLastPlayerOneRound() {
        const order = this.queryFirstPlayerOneRound();

        let index = order - 1 < 0 ? this.gamePlayers.length - 1 : order - 1;
        let flag: boolean = false;
        for (let i = index; i > 0; i--) {
            if (this.gamePlayers[i].isValid) {
                index = i;
                flag = true;
                break;
            }
        }
        if (!flag) {
            for (let i = this.gamePlayers.length - 1; i > order; i--) {
                if (this.gamePlayers[i].isValid) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }

    *createStageEventTriggerGenerator(stage: GameStage) {
        console.time('RESPONCE_STAGE');
        for (let i = 0; i < this.gamePlayers.length; ++i) {
            const player = this.gamePlayers[i];
            if (!player.isValid) {
                continue;
            }
            const nextParam: GeneratorNextData<unknown> = yield this.triggerEventListener(stage, player, this.gamePlayers[this.curOrder]);
            if (nextParam && nextParam.isOver) {
                break;
            }
        }
        console.timeEnd('RESPONCE_STAGE');
        console.log(`结束当前阶段响应:${GameStage[stage]}`);
        return stage;
    }

    startStageScheduler() {
        this.__generatorStack.next();
        director.getScheduler().schedule(this.scheduleUpdate, this, 0.1);
    }

    private scheduleUpdate() {
        if (this.__generatorStack && this.isResponse) {
            this.isResponse = false;
            const iterResult = this.__generatorStack.next({});
            if (iterResult.done && this.__generatorStack.isComplete()) {
                this.stopStageGenerator();
                return;
            }
            if (iterResult.done) {
                const stage = iterResult.value as GameStage;
                this.switchStage(stage);
                this.__generatorStack.next();
            } else if (!iterResult.value) {
                console.error('当前阶段回调失败');
            }
        }
    }

    switchStage(stage: GameStage) {
        switch (stage) {
            case GameStage.GAME_START:
                this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_ROUND_BEGIN));
                break;
            case GameStage.GAME_ROUND_BEGIN:
                this.roundNum++;
                console.log(`*********当前进行第${this.roundNum}轮*********`);
                this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_PERSONAL_PREPARE));
                break;
            case GameStage.GAME_PERSONAL_PREPARE:
                this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_PERSONAL_JUDGE));
                break;
            case GameStage.GAME_PERSONAL_JUDGE:
                this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_PERSONAL_DEAL_CARD));
                break;
            case GameStage.GAME_PERSONAL_DEAL_CARD:
                this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_PERSONAL_PLAY_CARD));
                break;
            case GameStage.GAME_PERSONAL_PLAY_CARD:
                this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_PERSONAL_GARBAGE_CARD));
                break;
            case GameStage.GAME_PERSONAL_GARBAGE_CARD:
                this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_PERSONAL_FINISH));
                break;
            case GameStage.GAME_PERSONAL_FINISH:
                console.log(`*********座位${this.curOrder}号玩家回合结束*********`);
                this.switchCurrentOrder();

                if (this.curOrder === this.queryLastPlayerOneRound()) {
                    this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_ROUND_FINISH));
                } else {
                    this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_PERSONAL_PREPARE));
                }
                break;
            case GameStage.GAME_ROUND_FINISH:
                this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_ROUND_BEGIN));
                break;
            case GameStage.GAME_END:
                this.__generatorStack.push(this.createStageEventTriggerGenerator(GameStage.GAME_START));
                break;
            default:
                break;
        }
    }

    stopStageGenerator() {
        director.getScheduler().unschedule(this.scheduleUpdate, this);
    }

    queryPlayersByIdentity(identity: Identity) {
        const players: GamePlayer[] = [];
        for (const player of this.gamePlayers) {
            if (player.isValid && player.id === identity) {
                players.push(player);
            }
            if (players.length === this.identities[identity]) {
                break;
            }
        }
        return players;
    }
}

export const theGameManager = GameManager.instance;
