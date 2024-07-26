import { director, ISchedulable, math } from 'cc';
import { cloneDeep, shuffle } from 'lodash-es';
import { Character, Identity, NumberIndexSet } from '../common/CommonStructs';
import { theConfigManager } from './ConfigManager';
import GameEvent, { GameStage } from './GameEvent';
import GamePlayer from '../game/GamePlayer';
import GeneratorStack, { GeneratorNextData } from '../common/GeneratorStack';
import PlayCard from '../game/PlayCard';
import { Utility } from '../common/Utility';

const IdentityConfig: NumberIndexSet<Identity[]> = {
    2: [Identity.Emperor, Identity.Rebel],
    5: [Identity.Emperor, Identity.Minister, Identity.Rebel, Identity.Rebel, Identity.Provocateur],
    8: [Identity.Emperor, Identity.Minister, Identity.Minister, Identity.Rebel, Identity.Rebel, Identity.Rebel, Identity.Rebel, Identity.Provocateur],
};

export type GeneratorStage = Generator<boolean, GameStage, GeneratorNextData<unknown>>;

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

    public identitySets: NumberIndexSet<number> = null;

    public isScheduler: boolean = false;
    public gameStage: GameStage = null;

    getResponse() {
        return this.__generatorStack && this.__generatorStack.getResponse();
    }

    setResponse(response: boolean, generator?: GeneratorStage) {
        if (this.__generatorStack) {
            this.__generatorStack.setResponse(response, generator);
        }
    }

    get currentPlayer() {
        return this.gamePlayers[this.curOrder];
    }

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
        const index = this.identities.indexOf(Identity.Emperor);
        this.identities = this.identities.splice(index).concat(this.identities.slice(0, index));
    }

    initGameOrder() {
        const index = this.identities.indexOf(Identity.Emperor);
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
                [this.playCards, this.dumpCards] = Utility.swapValue(this.playCards, this.dumpCards);
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
        let ownIndex = Utility.indexOf(this.gamePlayers, own);
        let otherIndex = Utility.indexOf(this.gamePlayers, other);
        const dist = Math.abs(otherIndex - ownIndex);
        if (dist <= 1) {
            return dist + other.distanceDefanceHorse - own.distanceAttackHorse;
        }

        if (ownIndex < otherIndex) {
            ownIndex += otherIndex;
            otherIndex = ownIndex - otherIndex;
            ownIndex -= otherIndex;
        }
        const left = this.gamePlayers.slice(otherIndex);
        const right = this.gamePlayers.slice(0, ownIndex + 1);

        const dinstance = Math.min(dist, left.length + right.length - 1) + other.distanceDefanceHorse - own.distanceAttackHorse;
        return dinstance;
    }

    calculateAttackDistanceOfPlayers(own: GamePlayer, other: GamePlayer) {
        const baseDistance = this.calculateDistanceOfPlayers(own, other);
        return baseDistance - own.distanceWeapon;
    }

    startGame() {
        for (let i = 0; i < this.gamePlayers.length; ++i) {
            const cards = this.dealCards(4);
            this.gamePlayers[i].gainCards(cards);
        }
        this.switchCurrentStage(GameStage.GAME_START, this.gamePlayers);
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

    queryLastPlayerOneRound() {
        for (let i = this.gamePlayers.length - 1; i > 0; i--) {
            if (this.gamePlayers[i].isValid) {
                return i;
            }
        }
        return this.gamePlayers.length - 1;
    }

    *createStageEventTriggerGenerator(stage: GameStage, players: GamePlayer[]) {
        console.time('RESPONCE_STAGE');
        for (const player of players) {
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
        this.isScheduler = true;
        director.getScheduler().schedule(this.scheduleUpdate, this, 0.1);
    }

    private scheduleUpdate() {
        if (this.__generatorStack && this.__generatorStack.isComplete()) {
            this.stopStageScheduler();
            return;
        }

        if (this.__generatorStack && this.getResponse()) {
            this.setResponse(false);
            const iterResult = this.__generatorStack.next({});

            if (iterResult.done) {
                const stage = iterResult.value as GameStage;
                const [nextStage, players] = this.queryNextStage(stage);
                this.switchCurrentStage(nextStage, players);
            } else if (!iterResult.value) {
                console.error('当前阶段回调失败');
            }
        }
    }

    switchCurrentStage(stage: GameStage, players: GamePlayer[]) {
        this.gameStage = stage;
        this.__generatorStack.push(this.createStageEventTriggerGenerator(stage, players));
        if (!this.isScheduler) {
            this.startStageScheduler();
        }
        this.__generatorStack.next();
    }

    queryNextStage(curStage: GameStage): [GameStage, GamePlayer[]] {
        let nextStage: GameStage = null;
        let players: GamePlayer[] = [];
        switch (curStage) {
            case GameStage.GAME_PREPARE:
                nextStage = GameStage.GAME_START;
                players = this.gamePlayers;
                break;
            case GameStage.GAME_START:
                nextStage = GameStage.GAME_ROUND_BEGIN;
                players = this.gamePlayers;
                break;
            case GameStage.GAME_ROUND_BEGIN:
                console.log(`*********当前进行第${this.roundNum}轮*********`);
                nextStage = GameStage.GAME_PERSONAL_PREPARE;
                players = [this.gamePlayers[this.curOrder]];
                break;
            case GameStage.GAME_PERSONAL_PREPARE:
                nextStage = GameStage.GAME_PERSONAL_JUDGE;
                players = this.gamePlayers;
                break;
            case GameStage.GAME_PERSONAL_JUDGE:
                nextStage = GameStage.GAME_PERSONAL_DEAL_CARD;
                players = [this.gamePlayers[this.curOrder]];
                break;
            case GameStage.GAME_PERSONAL_DEAL_CARD:
                nextStage = GameStage.GAME_PERSONAL_PLAY_CARD;
                players = [this.gamePlayers[this.curOrder]];
                break;
            case GameStage.GAME_PERSONAL_PLAY_CARD:
                nextStage = GameStage.GAME_PERSONAL_LOSE_CARD;
                players = this.gamePlayers;
                break;
            case GameStage.GAME_PERSONAL_LOSE_CARD:
                nextStage = GameStage.GAME_PERSONAL_FINISH;
                players = this.gamePlayers;
                break;
            case GameStage.GAME_PERSONAL_FINISH:
                console.log(`*********座位${this.curOrder}号玩家回合结束*********`);
                this.switchCurrentOrder();
                if (this.curOrder === this.queryLastPlayerOneRound()) {
                    nextStage = GameStage.GAME_ROUND_FINISH;
                    players = this.gamePlayers;
                } else {
                    nextStage = GameStage.GAME_PERSONAL_PREPARE;
                    players = [this.gamePlayers[this.curOrder]];
                }
                break;
            case GameStage.GAME_ROUND_FINISH:
                this.roundNum++;
                players = this.gamePlayers;
                nextStage = GameStage.GAME_ROUND_BEGIN;
                break;
            case GameStage.GAME_END:
                nextStage = GameStage.GAME_START;
                break;
            default:
                nextStage = GameStage.GAME_START;
                players = this.gamePlayers;
                break;
        }
        return [nextStage, players];
    }

    stopStageScheduler() {
        this.isScheduler = false;
        director.getScheduler().unschedule(this.scheduleUpdate, this);
    }

    queryPlayersByIdentity(identity: Identity) {
        const players: GamePlayer[] = [];
        for (const player of this.gamePlayers) {
            if (player.isValid && player.identity === identity) {
                players.push(player);
            }
            if (players.length === this.identities[identity]) {
                break;
            }
        }
        return players;
    }

    convertPlayersByOrder(order: number = this.curOrder) {
        let ret: GamePlayer[] = [];
        ret = ret.concat(this.gamePlayers.slice(order)).concat(this.gamePlayers.slice(0, order));
        return ret;
    }
}

export const theGameManager = GameManager.instance;
